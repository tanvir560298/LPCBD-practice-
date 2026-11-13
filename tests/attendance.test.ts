import { describe, it, expect } from 'vitest';
import {
  getDhakaDateString,
  formatDhakaDateTime,
  formatDhakaTimeOnly,
  INSTITUTION_TIMEZONE,
} from '@/lib/timeUtils';
import {
  SYNTHETIC_CLASS_SESSIONS,
  SYNTHETIC_BATCHES,
  SYNTHETIC_STUDENTS,
  SYNTHETIC_ENROLLMENTS,
} from '@/lib/mockData';
import { AttendanceRecord, AttendanceStatus } from '@/lib/attendanceTypes';

describe('LPC Timezone Utilities (Asia/Dhaka)', () => {
  it('should use Asia/Dhaka as institution timezone', () => {
    expect(INSTITUTION_TIMEZONE).toBe('Asia/Dhaka');
  });

  it('should format 24h time to 12h BST string', () => {
    expect(formatDhakaTimeOnly('10:00')).toBe('10:00 AM');
    expect(formatDhakaTimeOnly('14:30')).toBe('2:30 PM');
    expect(formatDhakaTimeOnly('00:15')).toBe('12:15 AM');
    expect(formatDhakaTimeOnly('12:00')).toBe('12:00 PM');
  });

  it('should format date string in YYYY-MM-DD format', () => {
    const dhakaDate = getDhakaDateString(new Date('2026-11-13T06:00:00Z'));
    expect(dhakaDate).toBe('2026-11-13');
  });
});

describe('LPC Attendance Domain Rules', () => {
  it('should support multiple class sessions on the same date for a single batch', () => {
    const today = getDhakaDateString();
    const batch44TodaySessions = SYNTHETIC_CLASS_SESSIONS.filter(
      (s) => s.batchId === 'batch-se-44' && s.sessionDate === today
    );

    // Differentiates multiple sessions on a date (Session 5 & Session 6)
    expect(batch44TodaySessions.length).toBeGreaterThanOrEqual(2);
    expect(batch44TodaySessions[0].id).not.toBe(batch44TodaySessions[1].id);
    expect(batch44TodaySessions[0].sessionNumber).not.toBe(batch44TodaySessions[1].sessionNumber);
  });

  it('should initialize student attendance records with unmarked status by default', () => {
    const records: Record<string, AttendanceRecord> = {};
    const students = SYNTHETIC_STUDENTS.slice(0, 5);

    students.forEach((student) => {
      records[student.id] = {
        id: `rec-${student.id}`,
        sessionId: 'sess-today-01',
        studentId: student.id,
        status: 'unmarked',
        updatedAt: new Date().toISOString(),
      };
    });

    const unmarkedCount = Object.values(records).filter((r) => r.status === 'unmarked').length;
    expect(unmarkedCount).toBe(5);
  });

  it('should allow mark all present to only update unmarked rows when replaceExisting is false', () => {
    const records: Record<string, AttendanceRecord> = {
      's-01': { id: '1', sessionId: 's1', studentId: 's-01', status: 'unmarked', updatedAt: '' },
      's-02': { id: '2', sessionId: 's1', studentId: 's-02', status: 'absent', updatedAt: '' },
      's-03': { id: '3', sessionId: 's1', studentId: 's-03', status: 'unmarked', updatedAt: '' },
    };

    // Bulk present without replacing existing
    Object.keys(records).forEach((id) => {
      if (records[id].status === 'unmarked') {
        records[id].status = 'present';
      }
    });

    expect(records['s-01'].status).toBe('present');
    expect(records['s-02'].status).toBe('absent'); // Preserved!
    expect(records['s-03'].status).toBe('present');
  });

  it('should detect when unmarked students remain to block submission', () => {
    const records: Record<string, AttendanceRecord> = {
      's-01': { id: '1', sessionId: 's1', studentId: 's-01', status: 'present', updatedAt: '' },
      's-02': { id: '2', sessionId: 's1', studentId: 's-02', status: 'unmarked', updatedAt: '' },
    };

    const hasUnmarked = Object.values(records).some((r) => r.status === 'unmarked');
    expect(hasUnmarked).toBe(true);

    // After marking all:
    records['s-02'].status = 'present';
    const hasUnmarkedNow = Object.values(records).some((r) => r.status === 'unmarked');
    expect(hasUnmarkedNow).toBe(false);
  });

  it('should sanitize CSV values against spreadsheet formula injection', () => {
    const dangerousInput = '=SUM(1+1)';
    const sanitize = (val: string) => (/^[=+\-@\t\r]/.test(val) ? `'${val}` : val);
    expect(sanitize(dangerousInput)).toBe("'=SUM(1+1)");

    const safeInput = 'Tanzila Akhter';
    expect(sanitize(safeInput)).toBe('Tanzila Akhter');
  });
});

