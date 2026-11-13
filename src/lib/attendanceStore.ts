/**
 * Server-side Attendance Domain Store & Concurrency Engine for LPC Bangladesh
 * Handles in-memory session sheets, atomic submissions, optimistic concurrency versioning,
 * and immutable audit logging.
 */

import {
  AttendanceRecord,
  AttendanceSheet,
  AttendanceAuditLog,
  AttendanceStatus,
  CorrectionRequest,
} from './attendanceTypes';
import {
  SYNTHETIC_CLASS_SESSIONS,
  SYNTHETIC_STUDENTS,
  SYNTHETIC_ENROLLMENTS,
  SYNTHETIC_BATCHES,
  INITIAL_ATTENDANCE_SHEETS,
} from './mockData';

// In-memory sheet store initialized from mock data
export const serverAttendanceSheets: Record<string, AttendanceSheet> = {
  ...INITIAL_ATTENDANCE_SHEETS,
};

// In-memory immutable audit log
export const serverAuditLogs: AttendanceAuditLog[] = [
  {
    id: 'audit-001',
    sessionId: 'sess-prev-01',
    actorId: 't-01',
    actorName: 'Dr. Anisur Rahman',
    actorRole: 'teacher',
    action: 'submitted',
    timestamp: '2026-11-11T05:35:00.000Z',
    details: 'Initial final attendance submitted with 8 present, 1 late, 1 excused.',
  },
];

// In-memory correction requests
export const serverCorrectionRequests: CorrectionRequest[] = [];

/**
 * Loads or initializes an attendance sheet for a session.
 * Brand new sheets default all active enrolled students to 'unmarked'.
 */
export function getOrCreateSessionSheet(sessionId: string): AttendanceSheet {
  if (serverAttendanceSheets[sessionId]) {
    return serverAttendanceSheets[sessionId];
  }

  const session = SYNTHETIC_CLASS_SESSIONS.find((s) => s.id === sessionId);
  if (!session) {
    throw new Error(`Session ${sessionId} not found`);
  }

  // Find eligible enrolled students
  const enrollments = SYNTHETIC_ENROLLMENTS.filter(
    (e) => e.batchId === session.batchId && e.status === 'active'
  );
  const eligibleStudents = SYNTHETIC_STUDENTS.filter((s) =>
    enrollments.some((e) => e.studentId === s.id)
  );

  const initialRecords: Record<string, AttendanceRecord> = {};
  eligibleStudents.forEach((st) => {
    initialRecords[st.id] = {
      id: `rec-${sessionId}-${st.id}`,
      sessionId,
      studentId: st.id,
      status: 'unmarked',
      updatedAt: new Date().toISOString(),
    };
  });

  const newSheet: AttendanceSheet = {
    id: `sheet-${sessionId}`,
    sessionId,
    status: 'draft',
    version: 1,
    lastSavedAt: new Date().toISOString(),
    records: initialRecords,
  };

  serverAttendanceSheets[sessionId] = newSheet;
  return newSheet;
}

/**
 * Saves a draft with optimistic concurrency checking.
 */
export function saveDraftSheet(
  sessionId: string,
  records: Record<string, AttendanceRecord>,
  clientVersion: number,
  actorId: string
): { success: boolean; sheet?: AttendanceSheet; error?: string; code?: number } {
  const session = SYNTHETIC_CLASS_SESSIONS.find((s) => s.id === sessionId);
  if (!session) {
    return { success: false, error: 'Session not found', code: 404 };
  }

  if (session.status === 'cancelled') {
    return { success: false, error: 'Cannot take or update attendance for a cancelled session.', code: 400 };
  }

  const currentSheet = getOrCreateSessionSheet(sessionId);

  if (currentSheet.status === 'submitted') {
    return { success: false, error: 'Cannot modify a submitted and locked attendance sheet. Submit a correction request instead.', code: 403 };
  }

  // Optimistic concurrency check
  if (clientVersion !== currentSheet.version) {
    return {
      success: false,
      error: `Concurrency conflict: Sheet was updated in another session (Server Version: ${currentSheet.version}, Client Version: ${clientVersion}). Please reload before saving.`,
      code: 409,
    };
  }

  // Update records and increment version
  currentSheet.records = { ...records };
  currentSheet.version += 1;
  currentSheet.lastSavedAt = new Date().toISOString();

  // Record audit
  serverAuditLogs.push({
    id: `audit-${Date.now()}`,
    sessionId,
    actorId,
    actorName: 'Faculty Teacher',
    actorRole: 'teacher',
    action: 'draft_saved',
    timestamp: new Date().toISOString(),
    details: `Draft saved with revision ${currentSheet.version}.`,
  });

  return { success: true, sheet: currentSheet };
}

/**
 * Atomically submits an attendance sheet.
 * Blocks if any enrolled students remain unmarked.
 */
export function submitFinalSheet(
  sessionId: string,
  records: Record<string, AttendanceRecord>,
  clientVersion: number,
  actorId: string,
  teacherName: string
): { success: boolean; sheet?: AttendanceSheet; error?: string; code?: number; unmarkedCount?: number } {
  const session = SYNTHETIC_CLASS_SESSIONS.find((s) => s.id === sessionId);
  if (!session) {
    return { success: false, error: 'Session not found', code: 404 };
  }

  if (session.status === 'cancelled') {
    return { success: false, error: 'Cannot submit attendance for a cancelled session.', code: 400 };
  }

  const currentSheet = getOrCreateSessionSheet(sessionId);

  if (currentSheet.status === 'submitted') {
    return { success: false, error: 'Attendance sheet is already finalized and locked.', code: 409 };
  }

  // Concurrency check
  if (clientVersion !== currentSheet.version) {
    return {
      success: false,
      error: `Concurrency conflict: Server version (${currentSheet.version}) does not match your draft (${clientVersion}).`,
      code: 409,
    };
  }

  // Validation: Check for unmarked students
  const unmarkedStudents = Object.values(records).filter((r) => r.status === 'unmarked');
  if (unmarkedStudents.length > 0) {
    return {
      success: false,
      error: `Final submission blocked: ${unmarkedStudents.length} student(s) remain UNMARKED. Every student must be assigned Present, Absent, Late, or Excused.`,
      code: 422,
      unmarkedCount: unmarkedStudents.length,
    };
  }

  // Atomic lock
  currentSheet.records = { ...records };
  currentSheet.status = 'submitted';
  currentSheet.version += 1;
  currentSheet.submittedAt = new Date().toISOString();
  currentSheet.submittedByTeacherId = actorId;
  currentSheet.lastSavedAt = currentSheet.submittedAt;

  // Immutable audit entry
  const counts = {
    present: Object.values(records).filter((r) => r.status === 'present').length,
    absent: Object.values(records).filter((r) => r.status === 'absent').length,
    late: Object.values(records).filter((r) => r.status === 'late').length,
    excused: Object.values(records).filter((r) => r.status === 'excused').length,
  };

  serverAuditLogs.push({
    id: `audit-${Date.now()}`,
    sessionId,
    actorId,
    actorName: teacherName,
    actorRole: 'teacher',
    action: 'submitted',
    timestamp: currentSheet.submittedAt,
    details: `Attendance locked by ${teacherName}. Roster summary: ${counts.present} Present, ${counts.absent} Absent, ${counts.late} Late, ${counts.excused} Excused.`,
  });

  return { success: true, sheet: currentSheet };
}

/**
 * File a correction request for a locked sheet.
 */
export function requestAttendanceCorrection(
  sessionId: string,
  studentId: string,
  previousStatus: AttendanceStatus,
  requestedStatus: AttendanceStatus,
  reason: string,
  teacherId: string
): { success: boolean; request?: CorrectionRequest; error?: string } {
  if (!reason || reason.trim().length < 5) {
    return { success: false, error: 'A substantive explanation (reason) is required for attendance correction.' };
  }

  const req: CorrectionRequest = {
    id: `corr-${Date.now()}`,
    sessionId,
    studentId,
    previousStatus,
    requestedStatus,
    reason: reason.trim(),
    requestedByTeacherId: teacherId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  serverCorrectionRequests.push(req);

  serverAuditLogs.push({
    id: `audit-${Date.now()}`,
    sessionId,
    actorId: teacherId,
    actorName: 'Faculty Teacher',
    actorRole: 'teacher',
    action: 'correction_requested',
    timestamp: req.createdAt,
    details: `Correction requested for Student ${studentId}: change from ${previousStatus} to ${requestedStatus}. Reason: "${req.reason}"`,
  });

  return { success: true, request: req };
}

