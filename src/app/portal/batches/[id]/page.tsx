'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Users } from 'lucide-react';
import { usePortal } from '@/components/portal/PortalContext';
import { visibleSessions, initials } from '@/lib/portalView';
import { AttendanceSheet } from '@/lib/attendanceTypes';
import { SYNTHETIC_BATCHES as batches, SYNTHETIC_CLASS_SESSIONS as sessions, SYNTHETIC_STUDENTS as students, SYNTHETIC_ENROLLMENTS as enrollments, SYNTHETIC_COURSES as courses } from '@/lib/mockData';
import { formatDhakaTimeOnly } from '@/lib/timeUtils';
export default function BatchDetail(){const {id}=useParams();const {actor}=usePortal();return <Batch key={`${id}:${actor.id}`} id={String(id)}/>;}
function Batch({id}:{id:string}){
 const {actor}=usePortal();const batch=batches.find(b=>b.id===id),allowed=visibleSessions(actor,sessions,batches).filter(s=>s.batchId===id);
 const [sheets,setSheets]=useState<Record<string,AttendanceSheet>>({}),[error,setError]=useState('');
 useEffect(()=>{let cancelled=false;Promise.all(visibleSessions(actor,sessions,batches).filter(s=>s.batchId===id&&s.status!=='cancelled').map(async s=>{const res=await fetch(`/api/portal/sessions/${s.id}/attendance`,{cache:'no-store'});if(!res.ok)throw new Error('Attendance status could not be loaded. Open a class to retry.');const data=await res.json();return [s.id,data.sheet] as const;})).then(data=>{if(!cancelled)setSheets(Object.fromEntries(data));}).catch(e=>{if(!cancelled)setError(e.message);});return()=>{cancelled=true;};},[actor,id]);
 if(!batch||!allowed.length)return <div className="pt-empty"><Users size={28}/><h1>This batch is not available</h1><p>Choose one of the batches assigned to your profile.</p><Link className="pt-button" href="/portal/batches">My batches</Link></div>;
 const roster=students.filter(s=>enrollments.some(e=>e.batchId===id&&e.studentId===s.id&&e.status==='active'));
 return <div className="pt-page"><div className="pt-breadcrumb"><Link href="/portal/batches"><ArrowLeft size={16}/> My batches</Link></div><header className="pt-page-heading"><div><p className="pt-eyebrow">{batch.code}</p><h1>{batch.name}</h1><p>{courses.find(c=>c.id===batch.courseId)?.title}</p></div><span className="pt-badge pt-badge-muted">{roster.length} students</span></header><section className="pt-panel"><header className="pt-section-heading"><div><h2>Class sessions</h2><p>Choose a class to take or review attendance. All times are in Dhaka.</p></div></header>{error&&<p className="pt-notice pt-error" role="alert">{error}</p>}{allowed.map(s=><div className="pt-session" key={s.id}><div className="pt-session-time"><strong>{formatDhakaTimeOnly(s.startTime)}</strong><span>{s.sessionDate}</span></div><div className="pt-session-info"><span className="pt-class-meta">Session {s.sessionNumber}</span><h3>{s.title}</h3><p>{s.room}</p></div><span className="pt-badge pt-badge-muted">{s.status==='cancelled'?'Cancelled':sheets[s.id]?.status==='submitted'?'Submitted':sheets[s.id]?'Draft':'Loading'}</span>{s.status!=='cancelled'&&<Link className="pt-button" href={`/portal/sessions/${s.id}/attendance`}>{sheets[s.id]?.status==='submitted'?'View sheet':'Take attendance'} <ArrowRight size={16}/></Link>}</div>)}</section><section className="pt-panel"><header className="pt-section-heading"><h2>Students in this batch</h2></header>{roster.map(s=><div className="pt-report-row" key={s.id}><div className="pt-inline"><span className="pt-student-avatar">{initials(s.fullName)}</span><strong>{s.fullName}</strong></div><span className="pt-field-hint">{s.studentCode}</span></div>)}</section></div>;
}
