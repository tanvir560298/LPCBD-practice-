export type AttendanceStatus = 'unmarked' | 'present' | 'absent' | 'late' | 'excused';

export type UserRole = 'teacher' | 'coordinator' | 'admin' | 'developer';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  assignedBranchIds: string[];
  branchId?: string; // Specific authorized branch for coordinators
  department?: string;
  accountStatus?: 'active' | 'disabled';
}

export interface AuthenticatedActor {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  branchId?: string; // Authorized branch for coordinators
  assignedBranchIds: string[];
  accountStatus: 'active' | 'disabled';
  isSyntheticDemo: boolean;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  isMainCampus?: boolean;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  category: 'Spoken English' | 'Test Preparation' | 'Professional Skills' | 'Young Learners' | 'Teacher Training';
  targetAudience: string;
  level: string;
  durationWeeks: number;
  totalHours: number;
  scheduleOptions: string[];
  summary: string;
  description: string;
  syllabus: { week: number; topic: string; details: string }[];
  learningOutcomes: string[];
  prerequisites: string;
  branchIds: string[];
  feeProvisionalNote: string;
  provisionalFeeBdt?: number;
}

export interface Batch {
  id: string;
  courseId: string;
  branchId: string;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  schedulePattern: string; // e.g. "Sun, Tue, Thu 10:00 - 11:30 AM"
}

export interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  email: string;
  phone: string;
  guardianName?: string;
  avatarSeed?: string;
  active: boolean;
}

export interface Enrollment {
  id: string;
  studentId: string;
  batchId: string;
  enrolledAt: string;
  status: 'active' | 'transferred' | 'dropped';
}

export interface ClassSession {
  id: string;
  batchId: string;
  sessionNumber: number;
  title: string;
  room: string;
  sessionDate: string; // YYYY-MM-DD in Asia/Dhaka
  startTime: string;   // HH:mm in Asia/Dhaka (e.g. 10:00)
  endTime: string;     // HH:mm in Asia/Dhaka (e.g. 11:30)
  timezone: string;    // 'Asia/Dhaka'
  assignedTeacherId: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  cancellationReason?: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
  note?: string;
  updatedAt: string;
}

export interface AttendanceSheet {
  id: string;
  sessionId: string;
  status: 'draft' | 'submitted';
  version: number;
  lastSavedAt: string;
  submittedAt?: string;
  submittedByTeacherId?: string;
  notes?: string;
  records: Record<string, AttendanceRecord>; // studentId -> record
}

export interface AttendanceAuditLog {
  id: string;
  sessionId: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: 'draft_saved' | 'submitted' | 'correction_requested' | 'correction_approved';
  timestamp: string; // UTC ISO string
  details: string;
}

export interface CorrectionRequest {
  id: string;
  sessionId: string;
  studentId: string;
  previousStatus: AttendanceStatus;
  requestedStatus: AttendanceStatus;
  reason: string;
  requestedByTeacherId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

