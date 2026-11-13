import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SYNTHETIC_USERS, SYNTHETIC_BATCHES, SYNTHETIC_CLASS_SESSIONS } from '@/lib/mockData';
import { attendanceCounts, markRemainingPresent, visibleSessions } from '@/lib/portalView';
import { PortalProvider, usePortal } from '@/components/portal/PortalContext';
import { AttendanceRecord } from '@/lib/attendanceTypes';
afterEach(()=>{cleanup();document.cookie='lpc_demo_user=; Max-Age=0; path=/';vi.restoreAllMocks();});
describe('Teacher workspace scope and marking helpers',()=>{
 it('supports every teacher, coordinator and disabled profile without falling back to a different teacher',()=>{
  for(const user of SYNTHETIC_USERS){
   const sessions=visibleSessions(user,SYNTHETIC_CLASS_SESSIONS,SYNTHETIC_BATCHES);
   if(user.accountStatus==='disabled')expect(sessions).toHaveLength(0);
   else if(user.role==='teacher')expect(sessions.every(s=>s.assignedTeacherId===user.id)).toBe(true);
   else if(user.role==='coordinator')expect(sessions.every(s=>user.assignedBranchIds.includes(SYNTHETIC_BATCHES.find(b=>b.id===s.batchId)!.branchId))).toBe(true);
  }
 });
 it('counts missing roster marks as unmarked and ignores records outside the roster',()=>{
  const records:Record<string,AttendanceRecord>={a:{id:'a',sessionId:'s',studentId:'a',status:'present',updatedAt:''},outside:{id:'x',sessionId:'s',studentId:'x',status:'absent',updatedAt:''}};
  expect(attendanceCounts(['a','b'],records)).toEqual({present:1,absent:0,late:0,excused:0,unmarked:1});
 });
 it('bulk present keeps the original absent/late/excused choices and leaves undo snapshot intact',()=>{
  const records=Object.fromEntries((['unmarked','absent','late','excused'] as const).map((status,i)=>[String(i),{id:String(i),sessionId:'s',studentId:String(i),status,updatedAt:''}]));
  const next=markRemainingPresent(records,['0','1','2','3']);
  expect(next['0'].status).toBe('present');expect(records['0'].status).toBe('unmarked');
  expect(next['1'].status).toBe('absent');expect(next['2'].status).toBe('late');expect(next['3'].status).toBe('excused');
 });
});
function ProfileProbe(){const {actor,ready,setActor,setDirty}=usePortal();return <div><p>{ready?actor.fullName:'Loading'}</p><button onClick={()=>setActor('t-02')}>Switch profile</button><button onClick={()=>setDirty(true)}>Edit attendance</button></div>;}
it('keeps the selected demo identity on reload and asks before discarding unsaved attendance',async()=>{
 document.cookie='lpc_demo_user=t-03; path=/';
 render(<PortalProvider><ProfileProbe/></PortalProvider>);
 await screen.findByText('Mahmudul Hasan');
 fireEvent.click(screen.getByText('Edit attendance'));
 const confirm=vi.spyOn(window,'confirm').mockReturnValue(false);
 fireEvent.click(screen.getByText('Switch profile'));
 expect(screen.getByText('Mahmudul Hasan')).toBeTruthy();expect(document.cookie).toContain('t-03');
 confirm.mockReturnValue(true);fireEvent.click(screen.getByText('Switch profile'));
 await waitFor(()=>expect(screen.getByText('Shahana Parveen')).toBeTruthy());expect(document.cookie).toContain('t-02');
});
