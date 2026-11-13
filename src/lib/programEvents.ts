import { AuthenticatedActor, AttendanceStatus } from './attendanceTypes';
import { SYNTHETIC_BATCHES, SYNTHETIC_CLASS_SESSIONS, SYNTHETIC_ENROLLMENTS, SYNTHETIC_STUDENTS } from './mockData';
import { visibleSessions } from './portalView';
import { getDhakaDateString } from './timeUtils';

export const programTypes = ['Debate', 'Impromptu Speech', 'Presentation', 'Quiz', 'Other'] as const;
export type ProgramInput = { title: string; type: string; date: string; start: string; end: string; venue: string; instructions: string; batchIds: string[] };
export type ProgramEvent = ProgramInput & { id: string; ownerId: string; ownerName: string; version: number; cancelled: boolean; cancellationReason?: string; roster: {id:string; fullName:string; studentCode:string}[]; attendance: Record<string, AttendanceStatus>; submitted: boolean; updatedAt: string };
export class ProgramError extends Error { constructor(message:string, public status=422){super(message);} }
export function allowedProgramBatches(actor:AuthenticatedActor) {
  const sessions = visibleSessions(actor,SYNTHETIC_CLASS_SESSIONS,SYNTHETIC_BATCHES);
  return SYNTHETIC_BATCHES.filter(b=>b.status!=='cancelled' && b.status!=='completed' && (actor.role==='admin'||(actor.role==='coordinator'?actor.assignedBranchIds.includes(b.branchId):sessions.some(s=>s.batchId===b.id))));
}
export function canReadProgram(actor:AuthenticatedActor,event:ProgramEvent) {
  const allowed = allowedProgramBatches(actor).map(b=>b.id);
  return actor.accountStatus==='active' && (actor.role==='admin'||event.ownerId===actor.id||event.batchIds.some(id=>allowed.includes(id)));
}
export function canManageProgram(actor:AuthenticatedActor,event:ProgramEvent) {
  const allowed = allowedProgramBatches(actor).map(b=>b.id);
  return actor.accountStatus==='active' && (actor.role==='admin'||(event.ownerId===actor.id&&event.batchIds.every(id=>allowed.includes(id)))||(actor.role==='coordinator'&&event.batchIds.every(id=>allowed.includes(id))));
}
export function validateProgram(input:unknown,actor:AuthenticatedActor):ProgramInput {
  if (!input || typeof input!=='object') throw new ProgramError('Enter the program details.');
  const data=input as Record<string,unknown>;
  const str=(key:string,max:number)=>{if(typeof data[key]!=='string'||(data[key] as string).length>max)throw new ProgramError(`Check the ${key} field.`);return (data[key] as string).trim();};
  const title=str('title',120),type=str('type',40),date=str('date',10),start=str('start',5),end=str('end',5),venue=str('venue',200),instructions=str('instructions',2000);
  if(!title||!venue||!programTypes.includes(type as typeof programTypes[number]))throw new ProgramError('Add a title, program type and venue or meeting link.');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date||date<getDhakaDateString())throw new ProgramError('Choose today or a future valid date (Dhaka time).');
  if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(start)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(end)||end<=start)throw new ProgramError('End time must be later than start time on the same day.');
  if(!Array.isArray(data.batchIds)||!data.batchIds.length||data.batchIds.some(id=>typeof id!=='string'))throw new ProgramError('Choose at least one batch.');
  const batchIds=Array.from(new Set(data.batchIds as string[])),allowed=allowedProgramBatches(actor).map(b=>b.id);
  if(actor.accountStatus!=='active'||batchIds.some(id=>!allowed.includes(id)))throw new ProgramError('You can only schedule programs for your assigned batches.',403);
  return {title,type,date,start,end,venue,instructions,batchIds};
}
export function createProgramRoster(batchIds:string[]) {
  return SYNTHETIC_STUDENTS.filter(s=>s.active&&SYNTHETIC_ENROLLMENTS.some(e=>e.studentId===s.id&&e.status==='active'&&batchIds.includes(e.batchId))).map(({id,fullName,studentCode})=>({id,fullName,studentCode}));
}
export function checkProgramConflict(input:ProgramInput,ownerId:string,events:ProgramEvent[],excludeId?:string) {
  const hit=events.some(e=>e.id!==excludeId&&!e.cancelled&&e.date===input.date&&input.start<e.end&&input.end>e.start&&(e.ownerId===ownerId||e.venue.toLowerCase()===input.venue.toLowerCase()||e.batchIds.some(id=>input.batchIds.includes(id))));
  if(hit)throw new ProgramError('This time overlaps another program for the teacher, batch or venue. Choose another time.',409);
}
export function validateProgramAttendance(event:ProgramEvent,raw:unknown,submit:boolean):Record<string,AttendanceStatus> {
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new ProgramError('Attendance is missing.');
  const records=raw as Record<string,AttendanceStatus>,ids=event.roster.map(s=>s.id);
  if(Object.keys(records).some(id=>!ids.includes(id))||ids.some(id=>!['unmarked','present','absent','late','excused'].includes(records[id])))throw new ProgramError('Attendance must match the full program roster.');
  if(submit&&(!ids.length||ids.some(id=>records[id]==='unmarked')))throw new ProgramError('Mark every student before submitting attendance.');
  return Object.fromEntries(ids.map(id=>[id,records[id]]));
}
