// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as publicEvents } from '@/app/api/events/route';
import { POST as signIn, DELETE as signOut } from '@/app/api/student/session/route';
import { POST as schedule } from '@/app/api/portal/events/route';
import { upcomingPrograms } from '@/lib/publicPrograms';
const url='http://localhost';
const futureDate='2099-01-01';
async function create(isPublic:boolean,title:string){const res=await schedule(new NextRequest(`${url}/api/portal/events`,{method:'POST',headers:{'content-type':'application/json','x-lpc-actor-id':'t-01'},body:JSON.stringify({action:'create',program:{title,type:'Debate',date:futureDate,start:isPublic?'10:00':'12:00',end:isPublic?'11:00':'13:00',venue:title,instructions:'Prepare a short speech',batchIds:['batch-se-44'],public:isPublic}})}));expect(res.status).toBe(201);return (await res.json()).event;}
async function login(studentId:string){const res=await signIn(new NextRequest(`${url}/api/student/session`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({studentId})}));expect(res.status).toBe(200);return `lpc_student_demo_session=${res.cookies.get('lpc_student_demo_session')!.value}`;}
describe('public announcements and student program privacy',()=>{
 it('excludes cancelled and ended events using Dhaka end time',()=>{const base={date:'2026-11-13',start:'14:00',end:'15:00',cancelled:false};expect(upcomingPrograms([base as any],new Date('2026-11-13T08:59:00Z')).length).toBe(1);expect(upcomingPrograms([base as any],new Date('2026-11-13T09:00:00Z')).length).toBe(0);expect(upcomingPrograms([{...base,cancelled:true} as any],new Date('2026-11-13T08:00:00Z')).length).toBe(0);});
 it('publishes only opted-in summaries and personalises through a server session',async()=>{
  const published=await create(true,'Public debate'),privateEvent=await create(false,'Private batch activity');
  const guest=await publicEvents(new NextRequest(`${url}/api/events?studentId=s-01`)),body=await guest.json();
  expect(guest.headers.get('cache-control')).toContain('no-store');
  expect(body.events.some((e:any)=>e.id===published.id)).toBe(true);expect(body.events.some((e:any)=>e.id===privateEvent.id)).toBe(false);expect(body.myPrograms).toEqual([]);
  const summary=body.events.find((e:any)=>e.id===published.id);expect(summary.roster).toBeUndefined();expect(summary.attendance).toBeUndefined();expect(summary.batchIds).toBeUndefined();expect(summary.ownerId).toBeUndefined();
  const cookie=await login('s-01');
  const mine=await (await publicEvents(new NextRequest(`${url}/api/events`,{headers:{cookie}}))).json();expect(mine.student.fullName).toBeTruthy();expect(mine.myPrograms.some((e:any)=>e.id===privateEvent.id)).toBe(true);
  const otherCookie=await login('s-11');const other=await (await publicEvents(new NextRequest(`${url}/api/events`,{headers:{cookie:otherCookie}}))).json();expect(other.myPrograms.some((e:any)=>e.id===privateEvent.id)).toBe(false);
  await signOut(new NextRequest(`${url}/api/student/session`,{method:'DELETE',headers:{cookie}}));expect((await (await publicEvents(new NextRequest(`${url}/api/events`,{headers:{cookie}}))).json()).student).toBeNull();
 });
 it('fails closed for student demo sign-in in production mode',async()=>{vi.stubEnv('NEXT_PUBLIC_DEMO_MODE','false');try{const res=await signIn(new NextRequest(`${url}/api/student/session`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({studentId:'s-01'})}));expect(res.status).toBe(503);}finally{vi.unstubAllEnvs();}});
});
