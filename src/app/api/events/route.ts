import { NextRequest, NextResponse } from 'next/server';
import { programEventStore } from '@/lib/programEventStore';
import { getStudentSession } from '@/lib/studentSession';
import { SYNTHETIC_ENROLLMENTS } from '@/lib/mockData';
import { upcomingPrograms, publicProgram } from '@/lib/publicPrograms';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
 const student=getStudentSession(req),events=upcomingPrograms(Array.from(programEventStore.values()));
 const myPrograms=student?events.filter(e=>e.roster.some(s=>s.id===student.id)&&SYNTHETIC_ENROLLMENTS.some(en=>en.studentId===student.id&&en.status==='active'&&e.batchIds.includes(en.batchId))).map(publicProgram):[];
 return NextResponse.json({events:events.filter(e=>e.public===true).map(publicProgram),myPrograms,student:student?{fullName:student.fullName}:null},{headers:{'Cache-Control':'private, no-store','Vary':'Cookie'}});
}
