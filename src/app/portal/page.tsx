'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  CheckCircle,
  FileEdit,
  ArrowRight,
  Users,
  AlertCircle,
  BookOpen,
  MapPin,
  Sparkles,
  Inbox,
} from 'lucide-react';
import {
  SYNTHETIC_CLASS_SESSIONS,
  SYNTHETIC_BATCHES,
  SYNTHETIC_COURSES,
  SYNTHETIC_BRANCHES,
  SYNTHETIC_TEACHERS,
  INITIAL_ATTENDANCE_SHEETS,
} from '@/lib/mockData';
import { getDhakaDateString, formatDhakaTimeOnly } from '@/lib/timeUtils';

export default function PortalDashboard() {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('t-01');

  useEffect(() => {
    // Read from cookie on initial mount
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )lpc_demo_user=([^;]+)'));
      const cookieUser = match ? match[2] : null;
      if (cookieUser && (cookieUser === 't-01' || cookieUser === 't-02')) {
        setSelectedTeacherId(cookieUser);
      }
    }

    // Listen for live actor switch in portal header
    const handleActorChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail && (customEvent.detail === 't-01' || customEvent.detail === 't-02')) {
        setSelectedTeacherId(customEvent.detail);
      }
    };
    window.addEventListener('lpc_actor_change', handleActorChange);
    return () => window.removeEventListener('lpc_actor_change', handleActorChange);
  }, []);

  const todayDhaka = getDhakaDateString();

  const activeTeacher =
    SYNTHETIC_TEACHERS.find((t) => t.id === selectedTeacherId) || SYNTHETIC_TEACHERS[0];

  // Sessions for today assigned specifically to active teacher
  const teacherTodaySessions = SYNTHETIC_CLASS_SESSIONS.filter(
    (s) => s.sessionDate === todayDhaka && s.assignedTeacherId === activeTeacher.id
  );

  // Past sessions assigned to active teacher
  const teacherPastSessions = SYNTHETIC_CLASS_SESSIONS.filter(
    (s) => s.sessionDate !== todayDhaka && s.assignedTeacherId === activeTeacher.id
  );

  return (
    <div className="space-y-8">
      {/* Top Welcome Card with Teacher Selector */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-lpc-navy-50 text-lpc-navy-800 border border-lpc-navy-200 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-lpc-gold-500" />
            <span>Faculty Attendance Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Today&apos;s Assigned Class Sessions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Institutional Date: <strong className="text-slate-800">{todayDhaka} (Asia/Dhaka GMT+6)</strong>.
          </p>
        </div>

        {/* Teacher Profile Quick Switcher */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
          <label htmlFor="teacher-select" className="text-slate-500 font-semibold block text-[11px] uppercase">
            Viewing Profile:
          </label>
          <select
            id="teacher-select"
            value={selectedTeacherId}
            onChange={(e) => setSelectedTeacherId(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-slate-800 focus:ring-2 focus:ring-lpc-gold-500"
          >
            {SYNTHETIC_TEACHERS.map((t) => {
              const count = SYNTHETIC_CLASS_SESSIONS.filter(
                (s) => s.sessionDate === todayDhaka && s.assignedTeacherId === t.id
              ).length;
              return (
                <option key={t.id} value={t.id}>
                  {t.fullName} ({count} {count === 1 ? 'Session' : 'Sessions'} Today)
                </option>
              );
            })}
          </select>
          <div className="text-[11px] text-slate-400">
            {activeTeacher.department}
          </div>
        </div>
      </div>

      {/* Notice on Session-Based Attendance */}
      <div className="p-4 bg-lpc-navy-50 border border-lpc-navy-200 rounded-xl flex items-start gap-3 text-xs text-lpc-navy-900">
        <AlertCircle className="w-5 h-5 text-lpc-navy-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Session-Based Integrity Guarantee:</span>
          <span className="text-slate-600 leading-normal">
            Attendance is keyed strictly by unique class session. For teachers with multiple sessions on the same day, each class possesses its own separate roster sheet, version sequence, and audit log.
          </span>
        </div>
      </div>

      {/* Today's Scheduled Sessions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-lpc-navy-700" />
            <span>Today&apos;s Schedule for {activeTeacher.fullName}</span>
          </h2>
          <span className="text-xs text-slate-500">
            {teacherTodaySessions.length} Sessions Found
          </span>
        </div>

        {/* Empty State: No assigned classes today */}
        {teacherTodaySessions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Inbox className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Assigned Classes Today</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              You have no active class sessions scheduled on {todayDhaka} in the institutional timetable. Please check your assigned cohorts or upcoming dates below.
            </p>
            <div className="pt-2">
              <Link
                href="/portal/batches"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-lpc-navy-800 text-white text-xs font-bold rounded-lg hover:bg-lpc-navy-900 transition-colors"
              >
                <span>View My Assigned Batches</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {teacherTodaySessions.map((sess) => {
              const batch = SYNTHETIC_BATCHES.find((b) => b.id === sess.batchId);
              const course = SYNTHETIC_COURSES.find((c) => c.id === batch?.courseId);
              const branch = SYNTHETIC_BRANCHES.find((b) => b.id === batch?.branchId);

              return (
                <div
                  key={sess.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 bg-lpc-navy-100 text-lpc-navy-900 font-mono font-bold text-xs rounded-md">
                        Session #{sess.sessionNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Ready to Mark
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {sess.title}
                      </h3>
                      <div className="text-xs font-semibold text-lpc-navy-800 mt-1">
                        {batch?.name}
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-800">
                          {formatDhakaTimeOnly(sess.startTime)} – {formatDhakaTimeOnly(sess.endTime)} BST
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{sess.room} ({branch?.city})</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Roster: 10 eligible students
                    </span>
                    <Link
                      href={`/portal/sessions/${sess.id}/attendance`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-lpc-navy-800 hover:bg-lpc-navy-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      <span>Mark Attendance</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Historical Sessions & Submissions */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-600" />
          <span>Past Class Sessions for {activeTeacher.fullName}</span>
        </h2>

        {teacherPastSessions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-xs text-slate-500">
            No completed past sessions recorded yet for this profile.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Session</th>
                    <th className="px-5 py-3">Batch & Course</th>
                    <th className="px-5 py-3">Class Date (Dhaka)</th>
                    <th className="px-5 py-3">Timings</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Workstation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teacherPastSessions.map((sess) => {
                    const batch = SYNTHETIC_BATCHES.find((b) => b.id === sess.batchId);
                    const sheet = INITIAL_ATTENDANCE_SHEETS[sess.id];
                    const isSubmitted = sheet?.status === 'submitted';

                    return (
                      <tr key={sess.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-slate-900">
                          Session #{sess.sessionNumber}: {sess.title}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-slate-700">
                          {batch?.code}
                        </td>
                        <td className="px-5 py-3.5">
                          {sess.sessionDate}
                        </td>
                        <td className="px-5 py-3.5">
                          {formatDhakaTimeOnly(sess.startTime)} – {formatDhakaTimeOnly(sess.endTime)}
                        </td>
                        <td className="px-5 py-3.5">
                          {isSubmitted ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              <span>Submitted & Locked</span>
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              Draft Pending
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link
                            href={`/portal/sessions/${sess.id}/attendance`}
                            className="font-bold text-lpc-navy-800 hover:text-lpc-navy-950 underline"
                          >
                            {isSubmitted ? 'View Records' : 'Open Sheet'}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
