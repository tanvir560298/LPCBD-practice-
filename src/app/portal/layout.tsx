'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Users, BarChart3, Home, Shield, ChevronDown, FlaskConical } from 'lucide-react';
import { SYNTHETIC_USERS } from '@/lib/mockData';
import { PortalProvider, usePortal } from '@/components/portal/PortalContext';
import { initials } from '@/lib/portalView';
import './portal.css';
export default function PortalLayout({children}:{children:React.ReactNode}) {return <PortalProvider><PortalFrame>{children}</PortalFrame></PortalProvider>;}
function PortalFrame({children}:{children:React.ReactNode}) {
 const path=usePathname();const {actor,ready,setActor,dirty,setDirty}=usePortal();
 const login=path==='/portal/login';
 const demo=process.env.NEXT_PUBLIC_DEMO_MODE!=='false';
 const links=[{href:'/portal',label:'Today',icon:CalendarDays},{href:'/portal/batches',label:'My batches',icon:Users},{href:'/portal/reports',label:'Reports',icon:BarChart3},...(actor.role!=='teacher'?[{href:'/portal/admin',label:'Administration',icon:Shield}]:[])];
 return <div className="pt-app" onClickCapture={e=>{
  const anchor=(e.target as HTMLElement).closest('a');
  if(dirty&&anchor?.getAttribute('href')&&!anchor.getAttribute('href')?.startsWith('#')&&anchor.pathname!==window.location.pathname){if(!window.confirm('Leave this page and discard unsaved attendance changes?')){e.preventDefault();e.stopPropagation();}else{setDirty(false);}}
 }}>
 <a className="pt-skip" href="#portal-workspace">Skip to workspace</a>
 <header className="pt-header"><div className="pt-header-inner"><Link href="/portal" className="pt-brand"><span><img src="/assets/images/lpc-emblem.png" alt="LPC"/></span><div>LPC <strong>Teacher Portal</strong><small>Language Proficiency Center</small></div></Link>{!login&&<nav aria-label="Teacher portal">{links.map(({href,label,icon:Icon})=><Link key={href} href={href} aria-current={(href==='/portal'?path===href:path.startsWith(href))?'page':undefined}><Icon size={17}/>{label}</Link>)}</nav>}<Link href="/" className="pt-public-link"><Home size={18}/> Home</Link></div></header>
 <div className="pt-account-bar"><div>{demo?<span className="pt-demo-label"><FlaskConical size={14}/> Demo workspace <span className="pt-demo-detail">· Sample students; attendance resets if server restarts</span></span>:<span>Teacher workspace</span>}{!login&&ready&&demo&&<label className="pt-profile"><span className="pt-avatar">{initials(actor.fullName)}</span><span className="sr-only">Demo profile</span><select aria-label="Demo profile" value={actor.id} onChange={e=>setActor(e.target.value)}>{SYNTHETIC_USERS.map(u=><option key={u.id} value={u.id}>{u.fullName} · {u.role}</option>)}</select><ChevronDown size={14}/></label>}</div></div>
 <main id="portal-workspace" className="pt-workspace">{ready?children:<div className="pt-empty" role="status">Opening your workspace…</div>}</main>
 <footer className="pt-footer"><span>LPC · Teacher workspace</span><span>Class times in Asia/Dhaka · {actor.role}</span></footer>
 </div>;
}
