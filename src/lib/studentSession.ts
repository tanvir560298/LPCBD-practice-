import { randomUUID } from 'crypto';
import { NextRequest } from 'next/server';
import { isDemoMode } from './authAdapter';
import { SYNTHETIC_STUDENTS } from './mockData';
const state=globalThis as typeof globalThis & {lpcStudentSessions?:Map<string,{id:string;expires:number}>};
const sessions=state.lpcStudentSessions??(state.lpcStudentSessions=new Map());
export const studentCookie='lpc_student_demo_session';
export function createStudentSession(id:string) {
 for(const [token,session] of Array.from(sessions.entries()))if(session.expires<=Date.now())sessions.delete(token);
 const token=randomUUID();sessions.set(token,{id,expires:Date.now()+8*60*60*1000});return token;
}
export function endStudentSession(req:NextRequest){const token=req.cookies.get(studentCookie)?.value;if(token)sessions.delete(token);}
export function getStudentSession(req:NextRequest) {
 if(!isDemoMode())return null;
 const token=req.cookies.get(studentCookie)?.value,session=token?sessions.get(token):null;
 if(!session||session.expires<=Date.now()){if(token)sessions.delete(token);return null;}
 return SYNTHETIC_STUDENTS.find(s=>s.id===session.id&&s.active)||null;
}
