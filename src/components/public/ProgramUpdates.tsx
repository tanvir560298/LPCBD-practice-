'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, CalendarDays, ArrowRight } from 'lucide-react';
import { PublicProgram, formatProgramWhen } from '@/lib/publicPrograms';
type Updates={events:PublicProgram[];myPrograms:PublicProgram[];student:{fullName:string}|null;loading:boolean;error:string;refresh:()=>Promise<void>};
const Context=createContext<Updates|null>(null);
export function ProgramUpdatesProvider({children}:{children:React.ReactNode}){
 const [data,setData]=useState({events:[] as PublicProgram[],myPrograms:[] as PublicProgram[],student:null as {fullName:string}|null}),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const refresh=useCallback(async()=>{try{const res=await fetch('/api/events',{cache:'no-store'});if(!res.ok)throw new Error();setData(await res.json());setError('');}catch{setError('Program updates are temporarily unavailable.');setData({events:[],myPrograms:[],student:null});}finally{setLoading(false);}},[]);
 useEffect(()=>{refresh();const timer=setInterval(refresh,60000);const focus=()=>{if(document.visibilityState==='visible')refresh();};window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',focus);return()=>{clearInterval(timer);window.removeEventListener('focus',refresh);document.removeEventListener('visibilitychange',focus);};},[refresh]);
 return <Context.Provider value={{...data,loading,error,refresh}}>{children}</Context.Provider>;
}
export function useProgramUpdates(){const value=useContext(Context);if(!value)throw new Error('Program updates provider missing');return value;}
export function ProgramNavLink(){
 const {events,myPrograms,student}=useProgramUpdates(),count=student?myPrograms.length:events.length;
 return <Link href="/events" className="inline-flex items-center gap-2 px-3 py-2 min-h-[44px] rounded-lg text-sm font-semibold text-lpc-navy-950 hover:bg-slate-100" aria-label={`Programs & Events${count?`, ${count} upcoming${student?' for you':''}`:''}`}><Bell size={17} aria-hidden="true"/><span>Programs & Events</span>{count>0&&<span className="inline-flex min-w-[22px] h-[22px] items-center justify-center rounded-full bg-amber-300 px-1.5 text-xs font-bold text-slate-950">{count}</span>}</Link>;
}
export function StudentNav(){
 const {student,refresh}=useProgramUpdates(),[busy,setBusy]=useState(false),[failed,setFailed]=useState(false);
 const logout=async()=>{setBusy(true);setFailed(false);try{const res=await fetch('/api/student/session',{method:'DELETE'});if(!res.ok)throw new Error();await refresh();}catch{setFailed(true);}finally{setBusy(false);}};
 return student?<span className="flex flex-wrap items-center gap-2 text-xs"><span>Hi, {student.fullName.split(' ')[0]}</span><button type="button" disabled={busy} onClick={logout} className="underline min-h-[44px] px-2">{busy?'Signing out…':'Sign out'}</button>{failed&&<span role="alert">Try again</span>}</span>:<Link className="text-xs font-semibold underline min-h-[44px] inline-flex items-center px-2" href="/student/login">Student sign in</Link>;
}
export function HomeProgramBanner(){
 const {student,myPrograms,loading,error}=useProgramUpdates();
 if(!student||loading||error)return null;
 const next=myPrograms[0];
 return <aside aria-label="Your upcoming programs" className="mt-6 rounded-xl border border-white/25 bg-white/10 p-5 text-white"><div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-wide"><CalendarDays size={18}/> Your next program</div>{next?<><h2 className="mt-3 text-xl font-bold">{next.title}</h2><p className="mt-2 text-sm text-slate-200">{formatProgramWhen(next)}</p><p className="mt-1 text-sm text-slate-200 break-words">{next.venue}</p><Link href={`/events#program-${next.id}`} className="mt-3 inline-flex gap-2 items-center min-h-[44px] font-semibold text-amber-200">View your {myPrograms.length>1?`${myPrograms.length} programs`:'program'} <ArrowRight size={17}/></Link></>:<p className="mt-3 text-sm text-slate-200">You have no upcoming programs for your batch yet.</p>}<p className="mt-2 text-xs text-slate-300">Student demo · {student.fullName}</p></aside>;
}
