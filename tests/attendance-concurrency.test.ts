import { describe, it, expect, beforeEach } from 'vitest';
import {
  getOrCreateSessionSheet,
  saveDraftSheet,
  submitFinalSheet,
  requestAttendanceCorrection,
  serverAttendanceSheets,
  serverAuditLogs,
} from '@/lib/attendanceStore';
import { AttendanceRecord } from '@/lib/attendanceTypes';

describe('Attendance Domain & Concurrency Integrity Engine', () => {
  const TEST_SESSION_ID = 'sess-today-01';

  beforeEach(() => {
    // Reset test session sheet
    delete serverAttendanceSheets[TEST_SESSION_ID];
  });

  it('initializes sheet with all eligible students as UNMARKED', () => {
    const sheet = getOrCreateSessionSheet(TEST_SESSION_ID);
    expect(sheet.status).toBe('draft');
    expect(sheet.version).toBe(1);

    const records = Object.values(sheet.records);
    expect(records.length).toBeGreaterThan(0);
    records.forEach((rec) => {
      expect(rec.status).toBe('unmarked');
    });
  });

  it('increments version and records audit entry on draft save', () => {
    const sheet = getOrCreateSessionSheet(TEST_SESSION_ID);
    const initialVersion = sheet.version;

    const updatedRecords = { ...sheet.records };
    const firstStudentId = Object.keys(updatedRecords)[0];
    updatedRecords[firstStudentId] = {
      ...updatedRecords[firstStudentId],
      status: 'present',
    };

    const result = saveDraftSheet(TEST_SESSION_ID, updatedRecords, initialVersion, 't-01');
    expect(result.success).toBe(true);
    expect(result.sheet?.version).toBe(initialVersion + 1);
    expect(result.sheet?.records[firstStudentId].status).toBe('present');
  });

  it('detects optimistic concurrency conflicts and rejects outdated versions with 409 Conflict', () => {
    const sheet = getOrCreateSessionSheet(TEST_SESSION_ID);

    // Tab A saves draft (advances version from 1 to 2)
    saveDraftSheet(TEST_SESSION_ID, sheet.records, 1, 't-01');

    // Tab B attempts to save with stale version 1
    const result = saveDraftSheet(TEST_SESSION_ID, sheet.records, 1, 't-01');
    expect(result.success).toBe(false);
    expect(result.code).toBe(409);
    expect(result.error).toContain('Concurrency conflict');
  });

  it('blocks final submission if any enrolled students remain UNMARKED', () => {
    const sheet = getOrCreateSessionSheet(TEST_SESSION_ID);
    const currentVersion = sheet.version;

    // Attempt to submit while students are still unmarked
    const result = submitFinalSheet(
      TEST_SESSION_ID,
      sheet.records,
      currentVersion,
      't-01',
      'Dr. Anisur Rahman'
    );

    expect(result.success).toBe(false);
    expect(result.code).toBe(422);
    expect(result.unmarkedCount).toBeGreaterThan(0);
    expect(result.error).toContain('Final submission blocked');
  });

  it('atomically locks sheet and produces immutable audit log when all students marked', () => {
    const sheet = getOrCreateSessionSheet(TEST_SESSION_ID);
    const currentVersion = sheet.version;

    // Mark all students
    const fullRecords: Record<string, AttendanceRecord> = {};
    Object.keys(sheet.records).forEach((id, index) => {
      fullRecords[id] = {
        ...sheet.records[id],
        status: index === 0 ? 'late' : 'present',
      };
    });

    const initialAuditCount = serverAuditLogs.length;

    const result = submitFinalSheet(
      TEST_SESSION_ID,
      fullRecords,
      currentVersion,
      't-01',
      'Dr. Anisur Rahman'
    );

    expect(result.success).toBe(true);
    expect(result.sheet?.status).toBe('submitted');
    expect(serverAuditLogs.length).toBe(initialAuditCount + 1);

    const latestAudit = serverAuditLogs[serverAuditLogs.length - 1];
    expect(latestAudit.action).toBe('submitted');
    expect(latestAudit.details).toContain('Dr. Anisur Rahman');
  });

  it('rejects direct edits to an already submitted and locked sheet', () => {
    const sheet = getOrCreateSessionSheet(TEST_SESSION_ID);
    sheet.status = 'submitted';

    const result = saveDraftSheet(TEST_SESSION_ID, sheet.records, sheet.version, 't-01');
    expect(result.success).toBe(false);
    expect(result.code).toBe(403);
    expect(result.error).toContain('Cannot modify a submitted and locked attendance sheet');
  });

  it('allows teacher to submit a correction request with mandatory explanation', () => {
    const studentId = 's-01';
    const result = requestAttendanceCorrection(
      TEST_SESSION_ID,
      studentId,
      'absent',
      'late',
      'Student arrived 15 mins late due to verified traffic',
      't-01'
    );

    expect(result.success).toBe(true);
    expect(result.request?.status).toBe('pending');
    expect(result.request?.reason).toContain('verified traffic');
  });
});
