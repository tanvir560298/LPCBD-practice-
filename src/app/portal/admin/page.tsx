'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Plus,
  Calendar,
  Clock,
  Users,
  Layers,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Building,
  UserCheck,
  Ban,
  Filter,
} from 'lucide-react';
import {
  SYNTHETIC_USERS,
  SYNTHETIC_BRANCHES,
  SYNTHETIC_COURSES,
  SYNTHETIC_STUDENTS,
} from '@/lib/mockData';
import {
  adminBatches,
  adminSessions,
  adminEnrollments,
  createAdminBatch,
  createAdminSession,
  cancelAdminSession,
  enrollAdminStudent,
} from '@/lib/adminStore';

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState<'batches' | 'sessions' | 'enrollments'>('batches');
  const [currentActorId, setCurrentActorId] = useState<string>('admin-01');

  // Local state for re-rendering after mutations
  const [batches, setBatches] = useState(adminBatches);
  const [sessions, setSessions] = useState(adminSessions);
  const [enrollments, setEnrollments] = useState(adminEnrollments);

  // Status message
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  // New Batch Form State
  const [newBatchCourse, setNewBatchCourse] = useState(SYNTHETIC_COURSES[0].id);
  const [newBatchBranch, setNewBatchBranch] = useState(SYNTHETIC_BRANCHES[0].id);
  const [newBatchName, setNewBatchName] = useState('');
  const [newBatchCode, setNewBatchCode] = useState('');
  const [newBatchStart, setNewBatchStart] = useState('2026-12-01');
  const [newBatchEnd, setNewBatchEnd] = useState('2027-02-28');
  const [newBatchPattern, setNewBatchPattern] = useState('Sun, Tue, Thu 10:00 - 11:30 AM BST');

  // New Session Form State
  const [newSessBatch, setNewSessBatch] = useState(batches[0]?.id || '');
  const [newSessNumber, setNewSessNumber] = useState(1);
  const [newSessTitle, setNewSessTitle] = useState('');
  const [newSessRoom, setNewSessRoom] = useState('Room 301 (Academic Hall)');
  const [newSessDate, setNewSessDate] = useState('2026-11-25');
  const [newSessStart, setNewSessStart] = useState('10:00');
  const [newSessEnd, setNewSessEnd] = useState('11:30');
  const [newSessTeacher, setNewSessTeacher] = useState('t-01');

  // Cancel Session Modal/Prompt State
  const [cancellingSessionId, setCancellingSessionId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Enroll Student Form State
  const [enrollStudentId, setEnrollStudentId] = useState(SYNTHETIC_STUDENTS[0].id);
  const [enrollBatchId, setEnrollBatchId] = useState(batches[0]?.id || '');

  const currentActor = SYNTHETIC_USERS.find((u) => u.id === currentActorId) || SYNTHETIC_USERS[0];
  const isAdmin = currentActor.role === 'admin';

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!isAdmin) {
      setFeedback({
        type: 'error',
        message: 'Forbidden: Only Institutional Administrators can create cohort batches.',
      });
      return;
    }

    const result = createAdminBatch({
      courseId: newBatchCourse,
      branchId: newBatchBranch,
      name: newBatchName,
      code: newBatchCode,
      startDate: newBatchStart,
      endDate: newBatchEnd,
      schedulePattern: newBatchPattern,
    });

    if (!result.success) {
      setFeedback({ type: 'error', message: result.error || 'Failed to create batch.' });
      return;
    }

    setBatches([...adminBatches]);
    setFeedback({
      type: 'success',
      message: `Batch "${result.batch?.code}" created successfully.`,
    });
    setNewBatchName('');
    setNewBatchCode('');
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!isAdmin) {
      setFeedback({
        type: 'error',
        message: 'Forbidden: Only Administrators can schedule new academic sessions.',
      });
      return;
    }

    const result = createAdminSession({
      batchId: newSessBatch,
      sessionNumber: Number(newSessNumber),
      title: newSessTitle,
      room: newSessRoom,
      sessionDate: newSessDate,
      startTime: newSessStart,
      endTime: newSessEnd,
      assignedTeacherId: newSessTeacher,
    });

    if (!result.success) {
      setFeedback({ type: 'error', message: result.error || 'Failed to schedule session.' });
      return;
    }

    setSessions([...adminSessions]);
    setFeedback({
      type: 'success',
      message: `Session #${result.session?.sessionNumber} scheduled successfully in Asia/Dhaka timetable.`,
    });
    setNewSessTitle('');
    setNewSessNumber((prev) => prev + 1);
  };

  const handleCancelSession = (sessionId: string) => {
    if (!isAdmin) {
      setFeedback({
        type: 'error',
        message: 'Forbidden: Only Administrators can cancel class sessions.',
      });
      return;
    }

    if (!cancelReason.trim()) {
      setFeedback({
        type: 'error',
        message: 'Please provide an official cancellation reason for institutional audit.',
      });
      return;
    }

    const result = cancelAdminSession(sessionId, cancelReason);
    if (!result.success) {
      setFeedback({ type: 'error', message: result.error || 'Failed to cancel session.' });
      return;
    }

    setSessions([...adminSessions]);
    setFeedback({
      type: 'success',
      message: `Session has been cancelled. Attendance marking is permanently locked.`,
    });
    setCancellingSessionId(null);
    setCancelReason('');
  };

  const handleEnrollStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!isAdmin) {
      setFeedback({
        type: 'error',
        message: 'Forbidden: Only Administrators can enroll students.',
      });
      return;
    }

    const result = enrollAdminStudent(enrollStudentId, enrollBatchId);
    if (!result.success) {
      setFeedback({ type: 'error', message: result.error || 'Failed to enroll student.' });
      return;
    }

    setEnrollments([...adminEnrollments]);
    setFeedback({
      type: 'success',
      message: 'Student successfully enrolled into cohort.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Simulated Actor Switcher */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-lpc-navy-900 text-white">
                Admin Console
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Academic Operations & Administration
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Manage batches, class timetables, teacher assignments, and student rosters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/portal/admin/import"
              className="px-3.5 py-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5 min-h-[44px]"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>CSV Roster Import</span>
            </Link>
          </div>
        </div>

        {/* Identity & Scope Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span className="text-slate-700">Active Identity for Inspection:</span>
            <select
              value={currentActorId}
              onChange={(e) => setCurrentActorId(e.target.value)}
              className="px-2.5 py-1 text-xs font-semibold rounded border border-slate-300 bg-white min-h-[36px]"
              aria-label="Admin Identity Select"
            >
              {SYNTHETIC_USERS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} — {u.role.toUpperCase()} ({u.assignedBranchIds.join(', ')})
                </option>
              ))}
            </select>
          </div>

          <div className="text-slate-600">
            Current Role: <strong className="text-slate-900 capitalize">{currentActor.role}</strong>
            {!isAdmin && (
              <span className="ml-2 text-rose-600 font-semibold">
                (Read-only / Access restricted)
              </span>
            )}
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('batches')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'batches'
              ? 'border-lpc-navy-900 text-lpc-navy-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Cohort Batches ({batches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'sessions'
              ? 'border-lpc-navy-900 text-lpc-navy-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Class Sessions ({sessions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('enrollments')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'enrollments'
              ? 'border-lpc-navy-900 text-lpc-navy-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Enrollments ({enrollments.length})</span>
        </button>
      </div>

      {/* TAB 1: BATCHES */}
      {activeTab === 'batches' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Batch Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 lg:col-span-1">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-lpc-navy-800" />
              <span>Register New Cohort Batch</span>
            </h2>
            <p className="text-xs text-slate-500">
              Create an academic cohort mapped to an authorized branch campus and course.
            </p>

            <form onSubmit={handleCreateBatch} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1" htmlFor="nb-course">
                  Course
                </label>
                <select
                  id="nb-course"
                  value={newBatchCourse}
                  onChange={(e) => setNewBatchCourse(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {SYNTHETIC_COURSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1" htmlFor="nb-branch">
                  Branch Campus
                </label>
                <select
                  id="nb-branch"
                  value={newBatchBranch}
                  onChange={(e) => setNewBatchBranch(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {SYNTHETIC_BRANCHES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1" htmlFor="nb-name">
                  Batch Name
                </label>
                <input
                  id="nb-name"
                  type="text"
                  required
                  placeholder="e.g. Spoken English — Batch 46"
                  value={newBatchName}
                  onChange={(e) => setNewBatchName(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1" htmlFor="nb-code">
                  Batch Code (Unique)
                </label>
                <input
                  id="nb-code"
                  type="text"
                  required
                  placeholder="e.g. SE-DHK-46"
                  value={newBatchCode}
                  onChange={(e) => setNewBatchCode(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1" htmlFor="nb-start">
                    Start Date
                  </label>
                  <input
                    id="nb-start"
                    type="date"
                    required
                    value={newBatchStart}
                    onChange={(e) => setNewBatchStart(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1" htmlFor="nb-end">
                    End Date
                  </label>
                  <input
                    id="nb-end"
                    type="date"
                    required
                    value={newBatchEnd}
                    onChange={(e) => setNewBatchEnd(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1" htmlFor="nb-pattern">
                  Schedule Pattern
                </label>
                <input
                  id="nb-pattern"
                  type="text"
                  value={newBatchPattern}
                  onChange={(e) => setNewBatchPattern(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                disabled={!isAdmin}
                className="w-full py-2 px-3 bg-lpc-navy-900 hover:bg-lpc-navy-800 disabled:bg-slate-300 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Batch Cohort</span>
              </button>
            </form>
          </div>

          {/* Batches Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm lg:col-span-2">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Registered Cohort Batches</h2>
              <span className="text-xs text-slate-500 font-medium">{batches.length} total cohorts</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Batch Code</th>
                    <th className="py-2.5 px-3">Cohort Name</th>
                    <th className="py-2.5 px-3">Branch</th>
                    <th className="py-2.5 px-3">Schedule</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {batches.map((b) => {
                    const branch = SYNTHETIC_BRANCHES.find((br) => br.id === b.branchId);
                    return (
                      <tr key={b.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{b.code}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{b.name}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-semibold text-slate-700">
                            {branch?.city || b.branchId}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">{b.schedulePattern}</td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-500">
                          {b.startDate} to {b.endDate}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SESSIONS */}
      {activeTab === 'sessions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Schedule Session Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 lg:col-span-1">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-lpc-navy-800" />
              <span>Schedule Class Session</span>
            </h2>
            <p className="text-xs text-slate-500">
              Timetable session in Asia/Dhaka standard time with assigned faculty instructor.
            </p>

            <form onSubmit={handleCreateSession} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1" htmlFor="ns-batch">
                  Batch Cohort
                </label>
                <select
                  id="ns-batch"
                  value={newSessBatch}
                  onChange={(e) => setNewSessBatch(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.code} — {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1" htmlFor="ns-num">
                    Session #
                  </label>
                  <input
                    id="ns-num"
                    type="number"
                    min={1}
                    required
                    value={newSessNumber}
                    onChange={(e) => setNewSessNumber(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1" htmlFor="ns-date">
                    Session Date (Dhaka)
                  </label>
                  <input
                    id="ns-date"
                    type="date"
                    required
                    value={newSessDate}
                    onChange={(e) => setNewSessDate(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1" htmlFor="ns-title">
                  Session Topic / Title
                </label>
                <input
                  id="ns-title"
                  type="text"
                  required
                  placeholder="e.g. Dialogue Practice: Inquiries & Fluency"
                  value={newSessTitle}
                  onChange={(e) => setNewSessTitle(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1" htmlFor="ns-room">
                  Classroom / Studio
                </label>
                <input
                  id="ns-room"
                  type="text"
                  required
                  value={newSessRoom}
                  onChange={(e) => setNewSessRoom(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1" htmlFor="ns-start">
                    Start Time (BST)
                  </label>
                  <input
                    id="ns-start"
                    type="time"
                    required
                    value={newSessStart}
                    onChange={(e) => setNewSessStart(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1" htmlFor="ns-end">
                    End Time (BST)
                  </label>
                  <input
                    id="ns-end"
                    type="time"
                    required
                    value={newSessEnd}
                    onChange={(e) => setNewSessEnd(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1" htmlFor="ns-teacher">
                  Assigned Teacher
                </label>
                <select
                  id="ns-teacher"
                  value={newSessTeacher}
                  onChange={(e) => setNewSessTeacher(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {SYNTHETIC_USERS.filter((u) => u.role === 'teacher').map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.assignedBranchIds.join(', ')})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={!isAdmin}
                className="w-full py-2 px-3 bg-lpc-navy-900 hover:bg-lpc-navy-800 disabled:bg-slate-300 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule Session</span>
              </button>
            </form>
          </div>

          {/* Sessions List */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm lg:col-span-2">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">All Scheduled Class Sessions</h2>
              <span className="text-xs text-slate-500 font-medium">Asia/Dhaka Standard Timetable</span>
            </div>

            <div className="divide-y divide-slate-100">
              {sessions.map((sess) => {
                const batch = batches.find((b) => b.id === sess.batchId);
                const teacher = SYNTHETIC_USERS.find((u) => u.id === sess.assignedTeacherId);
                const isCancelled = sess.status === 'cancelled';
                const isCompleted = sess.status === 'completed';

                return (
                  <div key={sess.id} className="p-4 hover:bg-slate-50 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 text-slate-700">
                          #{sess.sessionNumber}
                        </span>
                        <h3 className="text-xs font-bold text-slate-900">{sess.title}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isCancelled
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : isCompleted
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {sess.status}
                        </span>
                      </div>

                      {/* Cancel Action */}
                      {!isCancelled && !isCompleted && isAdmin && (
                        <div>
                          {cancellingSessionId === sess.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                placeholder="Cancellation reason..."
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                className="text-[11px] px-2 py-1 border border-rose-300 rounded"
                              />
                              <button
                                onClick={() => handleCancelSession(sess.id)}
                                className="px-2 py-1 bg-rose-600 text-white rounded text-[11px] font-bold"
                              >
                                Confirm Cancel
                              </button>
                              <button
                                onClick={() => {
                                  setCancellingSessionId(null);
                                  setCancelReason('');
                                }}
                                className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[11px]"
                              >
                                Abort
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setCancellingSessionId(sess.id)}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[11px] font-bold flex items-center gap-1"
                            >
                              <Ban className="w-3 h-3 text-rose-600" />
                              <span>Cancel Session</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                      <span>Batch: <strong className="text-slate-700">{batch?.code}</strong></span>
                      <span>Date: <strong className="text-slate-700">{sess.sessionDate}</strong></span>
                      <span>Time: <strong className="text-slate-700">{sess.startTime} - {sess.endTime} BST</strong></span>
                      <span>Room: <strong className="text-slate-700">{sess.room}</strong></span>
                      <span>Instructor: <strong className="text-slate-700">{teacher?.fullName}</strong></span>
                    </div>

                    {sess.cancellationReason && (
                      <div className="text-[11px] text-rose-600 italic bg-rose-50/50 p-2 rounded border border-rose-100">
                        Cancellation Note: {sess.cancellationReason}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ENROLLMENTS */}
      {activeTab === 'enrollments' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enroll Student Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 lg:col-span-1">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-lpc-navy-800" />
              <span>Enroll Student into Cohort</span>
            </h2>
            <p className="text-xs text-slate-500">
              Assign an admitted student to an active batch cohort.
            </p>

            <form onSubmit={handleEnrollStudent} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1" htmlFor="enr-student">
                  Student
                </label>
                <select
                  id="enr-student"
                  value={enrollStudentId}
                  onChange={(e) => setEnrollStudentId(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {SYNTHETIC_STUDENTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.studentCode} — {s.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1" htmlFor="enr-batch">
                  Cohort Batch
                </label>
                <select
                  id="enr-batch"
                  value={enrollBatchId}
                  onChange={(e) => setEnrollBatchId(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.code} — {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={!isAdmin}
                className="w-full py-2 px-3 bg-lpc-navy-900 hover:bg-lpc-navy-800 disabled:bg-slate-300 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Confirm Student Enrollment</span>
              </button>
            </form>
          </div>

          {/* Enrollments Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm lg:col-span-2">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Current Cohort Enrollments</h2>
              <span className="text-xs text-slate-500 font-medium">{enrollments.length} active records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Student Code</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Batch Code</th>
                    <th className="py-2.5 px-3">Enrolled Date</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {enrollments.map((enr) => {
                    const student = SYNTHETIC_STUDENTS.find((s) => s.id === enr.studentId);
                    const batch = batches.find((b) => b.id === enr.batchId);
                    return (
                      <tr key={enr.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          {student?.studentCode || enr.studentId}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">
                          {student?.fullName || 'Unknown Student'}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700">{batch?.code}</td>
                        <td className="py-2.5 px-3 text-slate-500">{enr.enrolledAt}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {enr.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

