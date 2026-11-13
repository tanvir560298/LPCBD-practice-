'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { SYNTHETIC_USERS } from '@/lib/mockData';
import { AuthenticatedActor } from '@/lib/attendanceTypes';
type PortalState = {actor:AuthenticatedActor; ready:boolean; setActor:(id:string)=>void; dirty:boolean; setDirty:(value:boolean)=>void};
const Context = createContext<PortalState | null>(null);
export function PortalProvider({children}:{children:React.ReactNode}) {
 const [actorId,setActorId] = useState('t-01'), [ready,setReady] = useState(false), [dirty,setDirty] = useState(false);
 useEffect(() => {
  const id = document.cookie.split('; ').find(v=>v.startsWith('lpc_demo_user='))?.split('=')[1];
  if (id && SYNTHETIC_USERS.some(u=>u.id===id)) setActorId(id);
  setReady(true);
 },[]);
 const actor = SYNTHETIC_USERS.find(u=>u.id===actorId) || SYNTHETIC_USERS[0];
 useEffect(()=>{
  if (!ready) return;
  document.cookie = `lpc_demo_user=${actorId}; path=/; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent('lpc_actor_change',{detail:actorId}));
 },[actorId,ready]);
 const setActor=(id:string)=>{
  if (!SYNTHETIC_USERS.some(u=>u.id===id)) return;
  if(dirty && !window.confirm('You have unsaved attendance changes. Discard them and switch demo profile?'))return;
  // Update cookie synchronously before any child starts a request for the new actor.
  document.cookie=`lpc_demo_user=${id}; path=/; SameSite=Lax`;
  setDirty(false);setActorId(id);
 };
 return <Context.Provider value={{actor,ready,setActor,dirty,setDirty}}>{children}</Context.Provider>;
}
export function usePortal(){const state=useContext(Context);if(!state)throw new Error('PortalProvider is required');return state;}
