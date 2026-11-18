'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  ArrowRight,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useProgramUpdates } from '@/components/public/ProgramUpdates';
import {
  SYNTHETIC_USERS,
  SYNTHETIC_STUDENTS,
} from '@/lib/mockData';

// Combined unified user directory
interface UnifiedUser {
  id: string;
  name: string;
  identifier: string; // email or student code
  role: 'teacher' | 'student' | 'admin' | 'coordinator' | 'developer';
  roleDisplay: string;
  targetDashboard: string;
  isStudent: boolean;
}

const ALL_ACCOUNTS: UnifiedUser[] = [
  ...SYNTHETIC_USERS.filter((u) => u.accountStatus === 'active').map((u) => ({
    id: u.id,
    name: u.fullName,
    identifier: u.email,
    role: u.role as UnifiedUser['role'],
    roleDisplay:
      u.role === 'admin'
        ? 'Institutional Administrator'
        : u.role === 'coordinator'
        ? 'Branch Coordinator'
        : u.role === 'developer'
        ? 'Lead Web Developer'
        : 'Faculty Instructor',
    targetDashboard:
      u.role === 'admin'
        ? '/portal/admin'
        : u.role === 'developer'
        ? '/portal/developer'
        : '/portal',
    isStudent: false,
  })),
  ...SYNTHETIC_STUDENTS.slice(0, 3).map((s) => ({
    id: s.id,
    name: s.fullName,
    identifier: s.studentCode,
    role: 'student' as const,
    roleDisplay: 'Enrolled Student',
    targetDashboard: '/student/dashboard',
    isStudent: true,
  })),
];

export default function UnifiedLoginPage() {
  const router = useRouter();
  const { refresh } = useProgramUpdates();

  const [selectedAccountId, setSelectedAccountId] = useState(ALL_ACCOUNTS[0].id);
  const [password, setPassword] = useState('demo-password');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedAccount =
    ALL_ACCOUNTS.find((a) => a.id === selectedAccountId) || ALL_ACCOUNTS[0];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (selectedAccount.isStudent) {
        // Authenticate student session
        const res = await fetch('/api/student/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId: selectedAccount.id }),
        });
        if (!res.ok) throw new Error('Student login failed.');
        await refresh();
      } else {
        // Authenticate staff session (Teacher, Coordinator, Admin, Developer)
        if (typeof document !== 'undefined') {
          document.cookie = `lpc_demo_user=${selectedAccount.id}; path=/; SameSite=Lax`;
        }
      }

      // Automatically route user to their assigned role dashboard
      setTimeout(() => {
        router.push(selectedAccount.targetDashboard);
      }, 400);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Login failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 sm:my-16 px-4">
      {/* Brand & Title */}
      <div className="text-center space-y-2 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-white p-2 border border-slate-200 shadow-md mx-auto flex items-center justify-center relative">
          <img
            src="/assets/images/lpc-emblem.png"
            alt="LPC Official Emblem"
            className="w-full h-full object-contain"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-lpc-navy-900 border-2 border-white flex items-center justify-center text-lpc-gold-400">
            <Lock className="w-3 h-3" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Sign In to LPC Portal
        </h1>
        <p className="text-xs text-slate-500">
          Sign in with your institutional ID. You will be automatically redirected to your assigned dashboard.
        </p>
      </div>

      {/* Main Single Login Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-5">
        {/* Automatic Role Notice */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 text-xs text-slate-700">
          <Sparkles className="w-4 h-4 text-lpc-gold-500 shrink-0 mt-0.5" />
          <div>
            <strong>Single Sign-On (SSO):</strong> Your role and permissions are bound to your account ID. Logging in automatically opens your respective dashboard.
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Single Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="login-account"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Account ID / Email
            </label>
            <select
              id="login-account"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-lpc-navy-600 min-h-[44px]"
            >
              {ALL_ACCOUNTS.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} — {acc.roleDisplay} ({acc.identifier})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Password (Demo Password)
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-lpc-navy-600 min-h-[44px]"
              required
            />
          </div>

          {/* Assigned Destination Preview */}
          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 flex items-center justify-between">
            <span>Assigned Role: <strong className="text-slate-800">{selectedAccount.roleDisplay}</strong></span>
            <span className="font-mono text-slate-400">{selectedAccount.targetDashboard}</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-lpc-navy-900 hover:bg-lpc-navy-950 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm min-h-[46px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecting to your dashboard...</span>
              </>
            ) : (
              <>
                <span>Sign In &amp; Enter Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-3 border-t border-slate-100">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1"
          >
            <span>&larr; Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
