import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { getAuthenticatedActor } from '@/lib/authAdapter';
import { ProgramEvent, ProgramError, validateProgram, canReadProgram, canManageProgram, checkProgramConflict, createProgramRoster, validateProgramAttendance, allowedProgramBatches } from '@/lib/programEvents';
export const dynamic='force-dynamic';
// Isolated demo storage. A database adapter is required before real institutional use.
import { programEventStore as events } from '@/lib/programEventStore';
export async function GET(req:NextRequest){
 const auth=await getAuthenticatedActor(req);
 if(!auth.actor)return NextResponse.json({error:auth.error},{status:auth.statusCode||401});
 return NextResponse.json({events:Array.from(events.values()).filter(e=>canReadProgram(auth.actor!,e)),batches:allowedProgramBatches(auth.actor)});
}
export async function POST(req:NextRequest){
 const auth=await getAuthenticatedActor(req);
 if(!auth.actor)return NextResponse.json({error:auth.error},{status:auth.statusCode||401});
 try{
  const body=await req.json(),actor=auth.actor;
  if(body.action==='create'){
   const input=validateProgram(body.program,actor);
   checkProgramConflict(input,actor.id,Array.from(events.values()));
   const roster=createProgramRoster(input.batchIds);
   if(!roster.length)throw new ProgramError('The selected batches have no active students. Add the students before scheduling.');
   const event:ProgramEvent={...input,id:randomUUID(),ownerId:actor.id,ownerName:actor.fullName,version:1,cancelled:false,roster,attendance:Object.fromEntries(roster.map(s=>[s.id,'unmarked'])),submitted:false,updatedAt:new Date().toISOString()};
   events.set(event.id,event);return NextResponse.json({event},{status:201});
  }
  const current=events.get(body.id);
  if(!current)throw new ProgramError('Program not found.',404);
  if(!canManageProgram(actor,current))throw new ProgramError('Only the organiser or an authorised coordinator can change this program.',403);
  if(body.version!==current.version)throw new ProgramError('This program changed in another window. Close and reopen it to load the latest version.',409);
  if(current.cancelled)throw new ProgramError('This program is cancelled and cannot be changed.');
  let next={...current};
  if(body.action==='edit'){
   if(current.submitted||Object.values(current.attendance).some(s=>s!=='unmarked'))throw new ProgramError('Program details are locked after attendance begins.');
   const input=validateProgram(body.program,actor);checkProgramConflict(input,current.ownerId,Array.from(events.values()),current.id);
   const roster=createProgramRoster(input.batchIds);if(!roster.length)throw new ProgramError('Choose a batch with active students.');
   next={...next,...input,roster,attendance:Object.fromEntries(roster.map(s=>[s.id,'unmarked']))};
  }else if(body.action==='cancel'){
   if(current.submitted)throw new ProgramError('A program with submitted attendance cannot be cancelled.');
   if(typeof body.reason!=='string'||body.reason.trim().length<5||body.reason.length>500)throw new ProgramError('Add a cancellation reason (5–500 characters).');
   next.cancelled=true;next.cancellationReason=body.reason.trim();
  }else if(body.action==='attendance'){
   if(current.submitted)throw new ProgramError('Submitted program attendance is locked.',409);
   if(typeof body.submit!=='boolean')throw new ProgramError('Choose save draft or submit.');
   next.attendance=validateProgramAttendance(current,body.records,body.submit);next.submitted=body.submit;
  }else throw new ProgramError('Unknown action.');
  next.version++;next.updatedAt=new Date().toISOString();events.set(next.id,next);return NextResponse.json({event:next});
 }catch(err){return NextResponse.json({error:err instanceof ProgramError?err.message:'Could not save this program. Check your input and try again.'},{status:err instanceof ProgramError?err.status:400});}
}
