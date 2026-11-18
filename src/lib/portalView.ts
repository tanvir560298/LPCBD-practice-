import { AuthenticatedActor, Batch, ClassSession, AttendanceRecord, AttendanceStatus } from './attendanceTypes';
export const attendanceStatuses: AttendanceStatus[] = ['present','absent','late','excused','unmarked'];
export function visibleSessions(actor: AuthenticatedActor, sessions: ClassSession[], batches: Batch[]) {
  if (actor.accountStatus !== 'active') return [];
  return sessions.filter(s => actor.role === 'admin' || actor.role === 'developer' || (actor.role === 'teacher' ? s.assignedTeacherId === actor.id : actor.assignedBranchIds.includes(batches.find(b => b.id === s.batchId)?.branchId || '')));
}
export function attendanceCounts(studentIds: string[], records: Record<string, AttendanceRecord>) {
  const counts: Record<AttendanceStatus, number> = {present:0,absent:0,late:0,excused:0,unmarked:0};
  for (const id of studentIds) counts[records[id]?.status || 'unmarked']++;
  return counts;
}
export function markRemainingPresent(records: Record<string, AttendanceRecord>, ids: string[]) {
  const next = {...records};
  for (const id of ids) if (next[id]?.status === 'unmarked') next[id] = {...next[id], status:'present', updatedAt:new Date().toISOString()};
  return next;
}
export function initials(name: string) { return name.split(/\s+/).filter(Boolean).slice(0,2).map(s => s[0]).join('').toUpperCase(); }
