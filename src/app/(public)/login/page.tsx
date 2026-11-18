'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Lock,
  Shield,
  Code2,
  Building,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Users,
} from 'lucide-react';
import { useProgramUpdates } from '@/components/public/ProgramUpdates';
import {
  SYNTHETIC_USERS,
  SYNTHETIC_STUDENTS,
} from '@/lib/mockData';

type LoginRole = 'teacher' | 'student' | 'admin' | 'developer';

export default function UnifiedLoginPage() {
  const router = useRouter();
  const { refresh } = useProgramUpdates();

  const [activeTab, setActiveTab] = useState<LoginRole>('teacher');
  const [selectedStaffId, setSelectedStaffId] = useState('t-01');
  const [selectedStudentId, setSelectedStudentId] = useState(SYNTHETIC_STUDENTS[0]?.id || 's-01');
  const [password, setPassword] = useState('demo-password');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Filter staff by category
  const teachers = SYNTHETIC_USERS.filter((u) => u.role === 'teacher' && u.accountStatus === 'active');
  const administrators = SYNTHETIC_USERS.filter((u) => u.role === 'admin' || u.role === 'coordinator');
  const developers = SYNTHETIC_USERS.filter((u) => u.role === 'developer');

  const handleStaffLogin = (actorId: string, destination: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    // Set cookie
    if (typeof document !== 'undefined') {
      document.cookie = `lpc_demo_user=${actorId}; path=/; SameSite=Lax`;
    }

    setTimeout(() => {
      router.push(destination);
    }, 300);
  };

  const handleStudentLogin = async (studentId: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/student/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      });
      if (!res.ok) throw new Error('Student session creation failed.');
      await refresh();
      router.push('/student/dashboard');
    } catch {
      setErrorMessage('Could not sign in as demo student. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 sm:my-16 px-4">
      {/* Header */}
      <div className="text-center space-y-3 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-white p-2 border border-slate-200 shadow-md mx-auto flex items-center justify-center relative">
          <img
            src="/assets/images/lpc-emblem.png"
            alt="Language Proficiency Center"
            className="w-full h-full object-contain"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-lpc-navy-900 border-2 border-white flex items-center justify-center text-lpc-gold-400">
            <Lock className="w-3 h-3" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Institutional Portal Sign In
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Language Proficiency Center (LPC) • Faculty, Student, Admin &amp; Developer Access
          </p>
        </div>
      </div>

      {/* Demo Guidance Callout */}
      <div className="mb-6 p-4 bg-amber-50/90 border border-amber-200/90 rounded-2xl text-xs text-amber-950 space-y-1 shadow-xs">
        <div className="flex items-center gap-1.5 font-bold text-amber-900">
          <Sparkles className="w-4 h-4 text-lpc-gold-600" />
          <span>Interactive Prototype &amp; Exploration Mode</span>
        </div>
        <p className="text-[11px] text-amber-900/90 leading-relaxed">
          Select any of the 4 roles below to instantly test and explore each persona&apos;s live workstation, attendance workflows, and dashboards.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-200 bg-slate-50/60 p-1.5 gap-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('teacher');
              setSelectedStaffId(teachers[0]?.id || 't-01');
            }}
            className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'teacher'
                ? 'bg-white text-lpc-navy-950 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Users className="w-4 h-4 text-blue-600" />
            <span>Teachers</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
            }}
            className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'student'
                ? 'bg-white text-lpc-navy-950 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>Students</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setSelectedStaffId(administrators[0]?.id || 'admin-01');
            }}
            className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'admin'
                ? 'bg-white text-lpc-navy-950 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Shield className="w-4 h-4 text-purple-600" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('developer');
              setSelectedStaffId(developers[0]?.id || 'dev-01');
            }}
            className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'developer'
                ? 'bg-white text-lpc-navy-950 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Code2 className="w-4 h-4 text-indigo-600" />
            <span>Developer</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
              {errorMessage}
            </div>
          )}

          {/* 1. TEACHER TAB */}
          {activeTab === 'teacher' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-slate-900">Faculty &amp; Instructor Login</h2>
                <p className="text-xs text-slate-500">
                  Record session attendance, grade speaking evaluations, and manage batch homework.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Faculty Profile
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-lpc-navy-600 min-h-[44px]"
                >
                  {teachers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} — {u.email} ({u.assignedBranchIds.join(', ')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password (Demo password)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-lpc-navy-600 min-h-[44px]"
                />
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleStaffLogin(selectedStaffId, '/portal')}
                className="w-full py-3 px-4 bg-lpc-navy-900 hover:bg-lpc-navy-950 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm min-h-[46px]"
              >
                <span>Enter Faculty Attendance Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 2. STUDENT TAB */}
          {activeTab === 'student' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-slate-900">Student Portal Sign In</h2>
                <p className="text-xs text-slate-500">
                  Track course attendance records, view class schedules, and review batch notices.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Student Demo Profile
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-600 min-h-[44px]"
                >
                  {SYNTHETIC_STUDENTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.studentCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                Student authentication operates with instantaneous session tokens in demo mode. No password entry required.
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleStudentLogin(selectedStudentId)}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm min-h-[46px]"
              >
                <span>Enter Student Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 3. ADMINISTRATOR & COORDINATOR TAB */}
          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-slate-900">Administrator &amp; Coordinator Portal</h2>
                <p className="text-xs text-slate-500">
                  Global cohort batch creation, session scheduling, student enrollment, and branch oversight.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Administrative Persona
                </label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-purple-600 min-h-[44px]"
                >
                  {administrators.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} — {u.role.toUpperCase()} ({u.assignedBranchIds.join(', ')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 min-h-[44px]"
                />
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleStaffLogin(selectedStaffId, '/portal/admin')}
                className="w-full py-3 px-4 bg-purple-900 hover:bg-purple-950 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm min-h-[46px]"
              >
                <span>Enter Administrator Workstation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 4. WEB DEVELOPER TAB */}
          {activeTab === 'developer' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-slate-900">Web Developer Console (Superuser)</h2>
                <p className="text-xs text-slate-500">
                  Full system diagnostics, live API telemetry, fail-closed security boundary audit, and persona switcher.
                </p>
              </div>

              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
                <div className="text-xs font-bold text-indigo-950 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-700" />
                  <span>Lead Developer Persona: Tanvir Ahmad</span>
                </div>
                <p className="text-[11px] text-indigo-800">
                  Instant developer authorization. Bypasses restricted scopes for system verification, schema inspection, and automated test checks.
                </p>
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleStaffLogin('dev-01', '/portal/developer')}
                className="w-full py-3 px-4 bg-indigo-900 hover:bg-indigo-950 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm min-h-[46px]"
              >
                <span>Launch Developer Workstation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Return to website */}
      <div className="text-center mt-6">
        <Link
          href="/"
          className="text-xs text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1"
        >
          <span>&larr; Return to Language Proficiency Center Homepage</span>
        </Link>
      </div>
    </div>
  );
}
