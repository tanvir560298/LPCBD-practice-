'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Award,
  BookOpen,
  User,
  ArrowRight,
  Sparkles,
  LogOut,
  CalendarDays,
  FileCheck,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useProgramUpdates } from '@/components/public/ProgramUpdates';
import {
  SYNTHETIC_STUDENTS,
  SYNTHETIC_BATCHES,
  SYNTHETIC_COURSES,
  SYNTHETIC_BRANCHES,
  SYNTHETIC_ENROLLMENTS,
  SYNTHETIC_CLASS_SESSIONS,
} from '@/lib/mockData';
import { formatProgramWhen } from '@/lib/publicPrograms';

export default function StudentDashboardPage() {
  const router = useRouter();
  const { student, myPrograms, refresh } = useProgramUpdates();
  const [activeStudentId, setActiveStudentId] = useState<string>('s-01');
  const [isSigningOut, setIsSigningOut] = useState(false);

  // If a student is logged in via studentSession cookie, find matching synthetic student
  const currentStudent =
    SYNTHETIC_STUDENTS.find((s) => s.fullName === student?.fullName) ||
    SYNTHETIC_STUDENTS.find((s) => s.id === activeStudentId) ||
    SYNTHETIC_STUDENTS[0];

  const studentEnrollment =
    SYNTHETIC_ENROLLMENTS.find((e) => e.studentId === currentStudent.id) ||
    SYNTHETIC_ENROLLMENTS[0];

  const batch =
    SYNTHETIC_BATCHES.find((b) => b.id === studentEnrollment.batchId) ||
    SYNTHETIC_BATCHES[0];

  const course =
    SYNTHETIC_COURSES.find((c) => c.id === batch.courseId) ||
    SYNTHETIC_COURSES[0];

  const branch =
    SYNTHETIC_BRANCHES.find((b) => b.id === batch.branchId) ||
    SYNTHETIC_BRANCHES[0];

  const sessions = SYNTHETIC_CLASS_SESSIONS.filter(
    (s) => s.batchId === batch.id
  ).sort((a, b) => a.sessionDate.localeCompare(b.sessionDate));

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await fetch('/api/student/session', { method: 'DELETE' });
      await refresh();
      router.push('/login');
    } catch {
      router.push('/login');
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleSwitchStudent = async (studentId: string) => {
    setActiveStudentId(studentId);
    try {
      await fetch('/api/student/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      });
      await refresh();
    } catch {
      // Keep local state
    }
  };

  // Demo attendance stats
  const totalClasses = 12;
  const attendedClasses = 11;
  const attendanceRate = Math.round((attendedClasses / totalClasses) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Student Profile Top Banner */}
      <div className="bg-gradient-to-r from-lpc-navy-950 via-lpc-navy-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-lpc-gold-400/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-lpc-gold-400 shadow-inner">
              <GraduationCap className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-lpc-gold-400 text-slate-950">
                  Active Student
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  {currentStudent.studentCode}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {currentStudent.fullName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Batch: <strong className="text-white">{batch.name}</strong></span>
                <span>•</span>
                <span>Campus: <strong className="text-white">{branch.name}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Student Switcher for Demo Exploration */}
            <div className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs">
              <span className="text-slate-300 hidden sm:inline">Demo Switch:</span>
              <select
                value={currentStudent.id}
                onChange={(e) => handleSwitchStudent(e.target.value)}
                className="bg-slate-900 text-white rounded-lg px-2 py-1 text-xs border border-white/20 focus:outline-hidden focus:ring-1 focus:ring-lpc-gold-400"
              >
                {SYNTHETIC_STUDENTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.studentCode})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="px-3.5 py-2 text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 rounded-xl transition-colors flex items-center gap-1.5 min-h-[40px]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Attendance Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{attendanceRate}%</span>
            <span className="text-xs font-semibold text-emerald-600">Good Standing</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {attendedClasses} of {totalClasses} classes attended
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Current Course</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-lg font-bold text-slate-900 line-clamp-1">
            {course.title}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {course.level} • {course.totalHours} Academic Hours
          </div>
          <div className="mt-3 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md inline-block">
            {course.category}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Speaking Assessment</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">8.2</span>
            <span className="text-xs font-semibold text-amber-700">CEFR B2 Level</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Fluency: 8.5 • Pronunciation: 8.0 • Vocabulary: 8.0
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Evaluated by Faculty
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Upcoming Batch Events</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-slate-900">
            {myPrograms.length || 1}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Debates, Impromptu Speeches &amp; Quizzes
          </div>
          <Link
            href="/events"
            className="mt-3 text-[11px] font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
          >
            <span>View All Campus Events</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Main Grid: Schedule & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Class Schedule & Course Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Class Schedule Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Batch Class Sessions</h2>
                <p className="text-xs text-slate-500">
                  Schedule Pattern: {batch.schedulePattern}
                </p>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 text-slate-700">
                {sessions.length} Scheduled Sessions
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {sessions.map((sess, idx) => (
                <div key={sess.id} className="py-3.5 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        Session {sess.sessionNumber}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{sess.title}</h3>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {sess.sessionDate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {sess.startTime} - {sess.endTime} BST
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {sess.room}
                      </span>
                    </p>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      sess.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : sess.status === 'cancelled'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {sess.status === 'completed'
                      ? 'Completed'
                      : sess.status === 'cancelled'
                      ? 'Cancelled'
                      : 'Upcoming'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Syllabus Progress */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Curriculum &amp; Weekly Topics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.syllabus.map((s) => (
                <div
                  key={s.week}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1"
                >
                  <div className="text-xs font-bold text-lpc-navy-900">
                    Week {s.week}: {s.topic}
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">{s.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Events & Batch Notices */}
        <div className="space-y-6">
          {/* Batch Events */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-lpc-gold-500" />
                <span>Your Batch Activities</span>
              </h2>
            </div>

            {myPrograms.length > 0 ? (
              <div className="space-y-3">
                {myPrograms.map((prog) => (
                  <div
                    key={prog.id}
                    className="p-4 rounded-xl border border-lpc-gold-200 bg-amber-50/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-lpc-gold-400 text-slate-950">
                        {prog.type}
                      </span>
                      <span className="text-xs text-slate-500">{formatProgramWhen(prog)}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{prog.title}</h3>
                    <p className="text-xs text-slate-600">{prog.instructions}</p>
                    <div className="text-xs text-slate-500 flex items-center gap-1 pt-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{prog.venue}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                No active program notices assigned to your batch today. Check back weekly before classes!
              </div>
            )}
          </div>

          {/* Quick Support & Resources */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Academic Resources</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href={`/courses/${course.slug}`}
                  className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 flex items-center justify-between text-slate-700 transition-colors"
                >
                  <span className="font-semibold">Course Full Specification</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 flex items-center justify-between text-slate-700 transition-colors"
                >
                  <span className="font-semibold">All Campus Events Calendar</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 flex items-center justify-between text-slate-700 transition-colors"
                >
                  <span className="font-semibold">Admissions &amp; Academic Desk</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
