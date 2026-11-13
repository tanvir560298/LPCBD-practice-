// Admin Store & Academic Cohort Management Engine
// Handles Administrative Operations: Batches, Sessions, Teacher Assignments, Student Enrollments

import { Batch, ClassSession, Enrollment } from './attendanceTypes';
import {
  SYNTHETIC_BATCHES,
  SYNTHETIC_CLASS_SESSIONS,
  SYNTHETIC_ENROLLMENTS,
  SYNTHETIC_STUDENTS,
  SYNTHETIC_COURSES,
  SYNTHETIC_BRANCHES,
  SYNTHETIC_USERS,
} from './mockData';

// Maintain runtime lists initialized from synthetic seeds
export const adminBatches: Batch[] = [...SYNTHETIC_BATCHES];
export const adminSessions: ClassSession[] = [...SYNTHETIC_CLASS_SESSIONS];
export const adminEnrollments: Enrollment[] = [...SYNTHETIC_ENROLLMENTS];

export interface CreateBatchInput {
  courseId: string;
  branchId: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  schedulePattern: string;
}

export function createAdminBatch(input: CreateBatchInput): {
  success: boolean;
  batch?: Batch;
  error?: string;
} {
  if (!input.name || !input.code || !input.courseId || !input.branchId) {
    return { success: false, error: 'Name, code, course, and branch are mandatory fields.' };
  }

  // Check code uniqueness
  const exists = adminBatches.some((b) => b.code.toLowerCase() === input.code.toLowerCase());
  if (exists) {
    return { success: false, error: `Batch with code "${input.code}" already exists.` };
  }

  const courseExists = SYNTHETIC_COURSES.some((c) => c.id === input.courseId);
  if (!courseExists) {
    return { success: false, error: `Referenced course ID "${input.courseId}" not found.` };
  }

  const branchExists = SYNTHETIC_BRANCHES.some((br) => br.id === input.branchId);
  if (!branchExists) {
    return { success: false, error: `Referenced branch ID "${input.branchId}" not found.` };
  }

  const newBatch: Batch = {
    id: `batch-${Date.now().toString().slice(-6)}`,
    courseId: input.courseId,
    branchId: input.branchId,
    name: input.name.trim(),
    code: input.code.trim().toUpperCase(),
    startDate: input.startDate,
    endDate: input.endDate,
    status: 'scheduled',
    schedulePattern: input.schedulePattern || 'TBD',
  };

  adminBatches.unshift(newBatch);
  return { success: true, batch: newBatch };
}

export interface CreateSessionInput {
  batchId: string;
  sessionNumber: number;
  title: string;
  room: string;
  sessionDate: string; // YYYY-MM-DD
  startTime: string;   // HH:mm
  endTime: string;     // HH:mm
  assignedTeacherId: string;
}

export function createAdminSession(input: CreateSessionInput): {
  success: boolean;
  session?: ClassSession;
  error?: string;
} {
  const batch = adminBatches.find((b) => b.id === input.batchId);
  if (!batch) {
    return { success: false, error: `Batch ID "${input.batchId}" not found.` };
  }

  // Enforce sessionNumber uniqueness within batch
  const duplicateNum = adminSessions.some(
    (s) => s.batchId === input.batchId && s.sessionNumber === Number(input.sessionNumber)
  );
  if (duplicateNum) {
    return {
      success: false,
      error: `Session #${input.sessionNumber} already exists for batch ${batch.code}.`,
    };
  }

  const teacher = SYNTHETIC_USERS.find(
    (u) => u.id === input.assignedTeacherId && u.role === 'teacher'
  );
  if (!teacher) {
    return { success: false, error: `Assigned teacher ID "${input.assignedTeacherId}" not found.` };
  }

  const newSession: ClassSession = {
    id: `sess-${Date.now().toString().slice(-6)}`,
    batchId: input.batchId,
    sessionNumber: Number(input.sessionNumber),
    title: input.title.trim(),
    room: input.room.trim(),
    sessionDate: input.sessionDate,
    startTime: input.startTime,
    endTime: input.endTime,
    timezone: 'Asia/Dhaka',
    assignedTeacherId: input.assignedTeacherId,
    status: 'scheduled',
  };

  adminSessions.unshift(newSession);
  return { success: true, session: newSession };
}

export function cancelAdminSession(sessionId: string, reason: string): {
  success: boolean;
  session?: ClassSession;
  error?: string;
} {
  if (!reason || !reason.trim()) {
    return { success: false, error: 'A cancellation reason is required for administrative audit.' };
  }

  const session = adminSessions.find((s) => s.id === sessionId);
  if (!session) {
    return { success: false, error: `Session ID "${sessionId}" not found.` };
  }

  if (session.status === 'completed') {
    return { success: false, error: 'Cannot cancel an already completed and submitted session.' };
  }

  session.status = 'cancelled';
  session.cancellationReason = reason.trim();

  return { success: true, session };
}

export function enrollAdminStudent(studentId: string, batchId: string): {
  success: boolean;
  enrollment?: Enrollment;
  error?: string;
} {
  const student = SYNTHETIC_STUDENTS.find((s) => s.id === studentId);
  if (!student) {
    return { success: false, error: `Student ID "${studentId}" not found.` };
  }

  const batch = adminBatches.find((b) => b.id === batchId);
  if (!batch) {
    return { success: false, error: `Batch ID "${batchId}" not found.` };
  }

  const alreadyEnrolled = adminEnrollments.some(
    (e) => e.studentId === studentId && e.batchId === batchId && e.status === 'active'
  );
  if (alreadyEnrolled) {
    return { success: false, error: `Student ${student.studentCode} is already actively enrolled in this batch.` };
  }

  const newEnrollment: Enrollment = {
    id: `enr-${Date.now().toString().slice(-6)}`,
    studentId,
    batchId,
    enrolledAt: new Date().toISOString().split('T')[0],
    status: 'active',
  };

  adminEnrollments.unshift(newEnrollment);
  return { success: true, enrollment: newEnrollment };
}

