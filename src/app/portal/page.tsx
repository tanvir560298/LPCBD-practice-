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
  GraduationCap,
  ClipboardList,
  CheckCircle2,
  FileSpreadsheet,
  PlusCircle,
  X,
  Send,
  Award,
  ListTodo,
} from 'lucide-react';
import {
  SYNTHETIC_CLASS_SESSIONS,
  SYNTHETIC_BATCHES,
  SYNTHETIC_COURSES,
  SYNTHETIC_BRANCHES,
  SYNTHETIC_TEACHERS,
  SYNTHETIC_STUDENTS,
  SYNTHETIC_ENROLLMENTS,
  INITIAL_ATTENDANCE_SHEETS,
} from '@/lib/mockData';
import { getDhakaDateString, formatDhakaTimeOnly } from '@/lib/timeUtils';

export default function PortalDashboard() {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('t-01');
  
  // Interactive Modals
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  // Exam Modal State
  const [examStudentId, setExamStudentId] = useState(SYNTHETIC_STUDENTS[0].id);
  const [fluencyScore, setFluencyScore] = useState<number>(8);
  const [pronunciationScore, setPronunciationScore] = useState<number>(7);
  const [vocabScore, setVocabScore] = useState<number>(8);
  const [examSubmitted, setExamSubmitted] = useState(false);

  // Task Modal State
  const [taskBatchId, setTaskBatchId] = useState('batch-se-44');
  const [taskTitle, setTaskTitle] = useState('Audio Recording: 2-Minute Personal Introduction');
  const [taskType, setTaskType] = useState('Audio Drill');
  const [taskDueDate, setTaskDueDate] = useState('2026-11-18');
  const [taskSubmitted, setTaskSubmitted] = useState(false);

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
      {/* 1. Welcoming Teacher Identity Header */}
      <div className="bg-gradient-to-r from-lpc-navy-950 via-lpc-navy-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-lpc-navy-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lpc-gold-400/20 border border-lpc-gold-400/30 text-lpc-gold-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-lpc-gold-400" />
            <span>Faculty Command Center • Asia/Dhaka BST</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {activeTeacher.fullName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {activeTeacher.department} • Today: <strong className="text-lpc-gold-300 font-semibold">{todayDhaka}</strong>
          </p>
        </div>

        {/* Quick Session Status Pill */}
        <div className="bg-white/10 backdrop-blur-xs border border-white/15 px-4 py-3 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-lpc-gold-400 text-slate-950 flex items-center justify-center font-bold">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-300 font-medium">Classes Today</div>
            <div className="text-lg font-black text-white">
              {teacherTodaySessions.length} {teacherTodaySessions.length === 1 ? 'Session' : 'Sessions'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Primary Teacher Action Hub (4 Clear Action Tiles) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Teacher Action Hub</span>
            <span className="text-xs font-normal text-slate-500">(All daily teaching tools in one place)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Take Attendance */}
          <a
            href="#todays-sessions"
            className="p-5 bg-white rounded-2xl border-2 border-lpc-navy-600/30 hover:border-lpc-navy-600 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-lpc-navy-50 text-lpc-navy-900 border border-lpc-navy-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-lpc-navy-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-lpc-navy-900 transition-colors">
                  Take Attendance
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Mark real-time student presence, lateness, or excused absence for today.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-lpc-navy-800">
              <span>{teacherTodaySessions.length} Ready to Mark</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

          {/* Card 2: Take Exam / Viva Assessment */}
          <button
            type="button"
            onClick={() => {
              setExamSubmitted(false);
              setIsExamModalOpen(true);
            }}
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-lpc-gold-400 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4 text-left"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6 text-lpc-gold-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                  Exams &amp; Viva
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Evaluate CEFR speaking fluency, pronunciation clarity, and record marks.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
              <span>Assess Student</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 3: Give Tasks / Homework */}
          <button
            type="button"
            onClick={() => {
              setTaskSubmitted(false);
              setIsTaskModalOpen(true);
            }}
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-lpc-crimson-400 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4 text-left"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-900 border border-rose-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ListTodo className="w-6 h-6 text-lpc-crimson-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-800 transition-colors">
                  Assign Tasks
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Give audio recording drills, extempore debate topics, and homework.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-rose-800">
              <span>Give New Task</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 4: My Batch Students */}
          <Link
            href="/portal/batches"
            className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  Batch Students
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  View full cohort rosters, student contact info, and syllabus timeline.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>View Roster</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* 3. Today's Scheduled Sessions List */}
      <div id="todays-sessions" className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-lpc-navy-700" />
            <span>Today&apos;s Class Schedule ({todayDhaka})</span>
          </h2>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
            {teacherTodaySessions.length} {teacherTodaySessions.length === 1 ? 'Session Scheduled' : 'Sessions Scheduled'}
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

      {/* 4. Past Class Sessions & Attendance Audit Logs */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-lpc-navy-700" />
          <span>Past Sessions &amp; Records</span>
        </h2>

        {teacherPastSessions.length === 0 ? (
          <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No past sessions logged for this instructor profile.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Session</th>
                    <th className="py-3 px-4">Batch &amp; Course</th>
                    <th className="py-3 px-4">Class Date (Dhaka)</th>
                    <th className="py-3 px-4">Timings</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Workstation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teacherPastSessions.map((sess) => {
                    const batch = SYNTHETIC_BATCHES.find((b) => b.id === sess.batchId);
                    const sheet = INITIAL_ATTENDANCE_SHEETS[sess.id];
                    const isSubmitted = Boolean(sheet?.submittedAt);

                    return (
                      <tr key={sess.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          Session #{sess.sessionNumber}: {sess.title}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {batch?.code}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">
                          {sess.sessionDate}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {formatDhakaTimeOnly(sess.startTime)} – {formatDhakaTimeOnly(sess.endTime)}
                        </td>
                        <td className="py-3 px-4">
                          {isSubmitted ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle className="w-3 h-3 text-emerald-500" />
                              <span>Submitted &amp; Locked</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <FileEdit className="w-3 h-3 text-amber-500" />
                              <span>Draft Pending</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/portal/sessions/${sess.id}/attendance`}
                            className="text-xs font-bold text-lpc-navy-800 hover:text-lpc-navy-950 underline"
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

      {/* MODAL 1: Exam & Viva Assessment */}
      {isExamModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5 text-lpc-gold-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Conduct Viva Voce &amp; Exam</h3>
                  <div className="text-xs text-slate-500">CEFR Communicative Assessment Framework</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsExamModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {examSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-950">Assessment Recorded Successfully!</h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Student viva score has been recorded into the academic evaluation register.
                </p>
                <button
                  type="button"
                  onClick={() => setIsExamModalOpen(false)}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setExamSubmitted(true);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Select Student:</label>
                  <select
                    value={examStudentId}
                    onChange={(e) => setExamStudentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                  >
                    {SYNTHETIC_STUDENTS.slice(0, 8).map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.fullName} ({st.studentCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="font-bold text-slate-800">Scoring Rubric (1 to 10 Scale):</div>
                  
                  <div className="flex items-center justify-between">
                    <span>Spoken Fluency &amp; Spontaneity:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={fluencyScore}
                        onChange={(e) => setFluencyScore(Number(e.target.value))}
                        className="w-24 accent-lpc-gold-500"
                      />
                      <span className="font-bold text-slate-900 w-6">{fluencyScore}/10</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Phonetics &amp; Sentence Stress:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={pronunciationScore}
                        onChange={(e) => setPronunciationScore(Number(e.target.value))}
                        className="w-24 accent-lpc-gold-500"
                      />
                      <span className="font-bold text-slate-900 w-6">{pronunciationScore}/10</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Lexical Precision / Vocabulary:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={vocabScore}
                        onChange={(e) => setVocabScore(Number(e.target.value))}
                        className="w-24 accent-lpc-gold-500"
                      />
                      <span className="font-bold text-slate-900 w-6">{vocabScore}/10</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsExamModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-lpc-navy-900 text-white font-bold hover:bg-lpc-navy-800"
                  >
                    Save Evaluation Score
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Assign Tasks & Homework */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                  <ListTodo className="w-5 h-5 text-lpc-crimson-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Assign Class Homework / Task</h3>
                  <div className="text-xs text-slate-500">Distribute tasks to your cohort batch</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTaskModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {taskSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-base font-bold text-emerald-950">Task Assigned Successfully!</h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Students in the batch have been notified of the task &amp; deadline.
                </p>
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setTaskSubmitted(true);
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Batch:</label>
                  <select
                    value={taskBatchId}
                    onChange={(e) => setTaskBatchId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                  >
                    {SYNTHETIC_BATCHES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Task Category:</label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                  >
                    <option value="Audio Drill">Audio Recording (WhatsApp / Lab Submission)</option>
                    <option value="Extempore Speech">Extempore Speech Preparation (3 Mins)</option>
                    <option value="Writing Practice">Writing &amp; Grammar Practice Sheet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Task Title / Prompt:</label>
                  <input
                    type="text"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Due Date (Dhaka Time):</label>
                  <input
                    type="date"
                    required
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsTaskModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-lpc-navy-900 text-white font-bold hover:bg-lpc-navy-800"
                  >
                    Publish Task to Batch
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
