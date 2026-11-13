'use client';
import Link from 'next/link';
import { Users, ArrowRight, Clock3, BookOpen } from 'lucide-react';
import { usePortal } from '@/components/portal/PortalContext';
import { visibleSessions } from '@/lib/portalView';
import { SYNTHETIC_BATCHES as batches, SYNTHETIC_COURSES as courses, SYNTHETIC_CLASS_SESSIONS as sessions, SYNTHETIC_ENROLLMENTS as enrollments, SYNTHETIC_BRANCHES as branches } from '@/lib/mockData';
export default function BatchesPage(){
 const {actor}=usePortal();const allowed=visibleSessions(actor,sessions,batches),ids=new Set(allowed.map(s=>s.batchId));
 return <div className="pt-page"><section className="pt-page-heading"><div><p className="pt-eyebrow">YOUR CLASSES & STUDENTS</p><h1>My batches</h1><p>Choose a batch to view its students and class sessions.</p></div></section><div className="pt-action-grid">{batches.filter(b=>ids.has(b.id)).map(b=>{const course=courses.find(c=>c.id===b.courseId);return <Link className="pt-action" href={`/portal/batches/${b.id}`} key={b.id}><span className="pt-tool-icon"><BookOpen size={23}/></span><h3>{b.name}</h3><p>{course?.category} · {branches.find(br=>br.id===b.branchId)?.city}<br/>{enrollments.filter(e=>e.batchId===b.id&&e.status==='active').length} students<br/>{b.schedulePattern}</p><span className="pt-action-footer">View batch <ArrowRight size={17}/></span></Link>;})}</div>{!ids.size&&<section className="pt-panel pt-empty"><Users size={28}/><h2>No batches assigned</h2><p>Your coordinator can assign your classes.</p></section>}</div>;
}
