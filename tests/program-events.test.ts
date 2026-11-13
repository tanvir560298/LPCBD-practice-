// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/portal/events/route';
import { SYNTHETIC_USERS } from '@/lib/mockData';
import { getDhakaDateString } from '@/lib/timeUtils';
import { validateProgram, createProgramRoster } from '@/lib/programEvents';
const teacher=SYNTHETIC_USERS.find(u=>u.id==='t-01')!;
const input={title:'Debate practice',type:'Debate',date:getDhakaDateString(),start:'14:00',end:'15:00',venue:'Program test hall',instructions:'Prepare both sides.',batchIds:['batch-se-44']};
async function post(body:unknown,actor='t-01') {return POST(new NextRequest('http://localhost/api/portal/events',{method:'POST',headers:{'Content-Type':'application/json','x-lpc-actor-id':actor},body:JSON.stringify(body)}));}
describe('program scheduling boundaries',()=>{
 it('validates date/time and assigned batches',()=>{
  expect(()=>validateProgram({...input,end:'13:00'},teacher)).toThrow('End time');
  expect(()=>validateProgram({...input,date:'2027-02-30'},teacher)).toThrow('valid date');
  expect(()=>validateProgram({...input,batchIds:['batch-ielts-28']},teacher)).toThrow('assigned batches');
  expect(()=>validateProgram({...input,batchIds:[]},teacher)).toThrow('at least one');
 });
 it('deduplicates participants across selected batches',()=>{
  const roster=createProgramRoster(['batch-se-44','batch-se-44']);
  expect(roster.length).toBe(10);expect(new Set(roster.map(s=>s.id)).size).toBe(10);
 });
 it('creates, edits, detects overlap, saves and locks attendance with scope and version enforcement',async()=>{
  const created=await post({action:'create',program:input});expect(created.status).toBe(201);
  let event=(await created.json()).event;
  expect(event.ownerId).toBe('t-01');expect(event.roster.length).toBe(10);
  const overlap=await post({action:'create',program:{...input,title:'Conflicting debate'}});expect(overlap.status).toBe(409);
  const list=await GET(new NextRequest('http://localhost/api/portal/events',{headers:{'x-lpc-actor-id':'t-03'}}));expect((await list.json()).events.some((e:{id:string})=>e.id===event.id)).toBe(false);
  expect((await post({action:'cancel',id:event.id,version:event.version,reason:'Not authorised'},'t-03')).status).toBe(403);
  expect((await post({action:'edit',id:event.id,version:0,program:input})).status).toBe(409);
  const edited=await post({action:'edit',id:event.id,version:event.version,program:{...input,title:'Updated debate'}});expect(edited.status).toBe(200);event=(await edited.json()).event;
  const payload={action:'attendance',id:event.id,version:event.version};
  expect((await post({...payload,records:{},submit:true})).status).toBe(422);
  expect((await post({...payload,records:event.attendance,submit:true})).status).toBe(422);
  const records={...event.attendance,[event.roster[0].id]:'absent'};
  const draft=await post({...payload,records,submit:false});expect(draft.status).toBe(200);event=(await draft.json()).event;
  expect((await post({action:'edit',id:event.id,version:event.version,program:input})).status).toBe(422);
  const full=Object.fromEntries(event.roster.map((s:{id:string},i:number)=>[s.id,i===0?'absent':'present']));
  expect((await post({action:'attendance',id:event.id,version:event.version,records:{...full,injected:'present'},submit:true})).status).toBe(422);
  const submitted=await post({action:'attendance',id:event.id,version:event.version,records:full,submit:true});expect(submitted.status).toBe(200);event=(await submitted.json()).event;
  expect(event.submitted).toBe(true);
  expect((await post({action:'attendance',id:event.id,version:event.version,records:full,submit:false})).status).toBe(409);
 });
 it('cancels without deletion and blocks further writes',async()=>{
  const response=await post({action:'create',program:{...input,start:'16:00',end:'17:00'}});expect(response.status).toBe(201);let event=(await response.json()).event;
  const cancelled=await post({action:'cancel',id:event.id,version:event.version,reason:'Venue unavailable'});expect(cancelled.status).toBe(200);event=(await cancelled.json()).event;expect(event.cancelled).toBe(true);
  expect((await post({action:'attendance',id:event.id,version:event.version,records:event.attendance,submit:false})).status).toBe(422);
 });
 it('rejects disabled accounts',async()=>{expect((await post({action:'create',program:input},'t-disabled')).status).toBe(403);});
});
