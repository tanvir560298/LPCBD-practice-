import { NextRequest, NextResponse } from 'next/server';
import { isDemoMode } from '@/lib/authAdapter';
import { SYNTHETIC_STUDENTS } from '@/lib/mockData';
import { createStudentSession, endStudentSession, getStudentSession, studentCookie } from '@/lib/studentSession';
import { checkRateLimit } from '@/lib/rateLimit';
export const dynamic='force-dynamic';
export async function GET(req:NextRequest){
 const student=getStudentSession(req);
 return NextResponse.json({demo:isDemoMode(),student:student?{fullName:student.fullName}:null,profiles:isDemoMode()?SYNTHETIC_STUDENTS.filter(s=>s.active).map(s=>({id:s.id,fullName:s.fullName,studentCode:s.studentCode})):[]},{headers:{'Cache-Control':'no-store'}});
}
export async function POST(req:NextRequest){
 if(!isDemoMode())return NextResponse.json({error:'Student sign-in requires the production authentication integration.'},{status:503});
 if(!checkRateLimit(`student-demo:${req.headers.get('x-forwarded-for')||'local'}`,30,60000).allowed)return NextResponse.json({error:'Please wait a minute before trying again.'},{status:429});
 try{
  const {studentId}=await req.json(),student=SYNTHETIC_STUDENTS.find(s=>s.id===studentId&&s.active);
  if(!student)return NextResponse.json({error:'Choose an active demo student.'},{status:422});
  endStudentSession(req);const token=createStudentSession(student.id),res=NextResponse.json({success:true});
  res.cookies.set(studentCookie,token,{httpOnly:true,sameSite:'lax',secure:req.nextUrl.protocol==='https:',path:'/',maxAge:8*60*60});return res;
 }catch{return NextResponse.json({error:'Could not sign in. Try again.'},{status:400});}
}
export async function DELETE(req:NextRequest){endStudentSession(req);const res=NextResponse.json({success:true});res.cookies.set(studentCookie,'',{httpOnly:true,sameSite:'lax',path:'/',maxAge:0});return res;}
