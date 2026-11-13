'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Lock,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  CheckCircle,
  KeyRound,
  AlertCircle,
  Loader2,
  Shield,
} from 'lucide-react';
import { SYNTHETIC_USERS } from '@/lib/mockData';

export default function PortalLoginPage() {
  const router = useRouter();
  const [selectedActorId, setSelectedActorId] = useState('t-01');
  const [password, setPassword] = useState('demo-password');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedUser = SYNTHETIC_USERS.find((u) => u.id === selectedActorId) || SYNTHETIC_USERS[0];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (selectedUser.accountStatus === 'disabled') {
      setErrorMessage('This faculty profile has been deactivated by administrator. Access denied.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Password is required.');
      return;
    }

    if (password !== 'demo-password' && password !== 'lpc2026') {
      setErrorMessage('Invalid credentials. For this demo, use password "demo-password" or "lpc2026".');
      return;
    }

    setIsSubmitting(true);

    // Save demo user in cookie for server route verification
    if (typeof document !== 'undefined') {
      document.cookie = `lpc_demo_user=${selectedActorId}; path=/; SameSite=Lax`;
    }

    setTimeout(() => {
      if (selectedUser.role === 'admin') {
        router.push('/portal/admin');
      } else {
        router.push('/portal');
      }
    }, 400);
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white rounded-2xl border border-slate-200 shadow-xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
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
        <h1 className="text-2xl font-bold text-slate-900">Faculty & Staff Login</h1>
        <p className="text-xs text-slate-500">
          Secure attendance entry and academic cohort administration
        </p>
      </div>

      {/* Demo Warning */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
        <div className="flex items-center gap-1.5 font-bold">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Demo Authentication Mode Active</span>
        </div>
        <p className="text-[11px] text-amber-800 leading-normal">
          Select an authorized profile below to simulate role-scoped attendance. In production mode (<code className="font-mono bg-amber-100 px-1 py-0.5 rounded">NEXT_PUBLIC_DEMO_MODE=false</code>), access fails closed without authenticated Supabase server tokens.
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="login-identity">
            Select Staff Profile & Role
          </label>
          <select
            id="login-identity"
            value={selectedActorId}
            onChange={(e) => setSelectedActorId(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-lpc-gold-500 min-h-[44px]"
          >
            {SYNTHETIC_USERS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.fullName} — {u.role.toUpperCase()} ({u.assignedBranchIds.join(', ')})
                {u.accountStatus === 'disabled' ? ' [DEACTIVATED]' : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="login-pwd">
            Password (Demo password: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">demo-password</code>)
          </label>
          <input
            id="login-pwd"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-lpc-gold-500 min-h-[44px]"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-lpc-navy-800 hover:bg-lpc-navy-900 text-white font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-sm min-h-[44px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying authorization...</span>
            </>
          ) : (
            <>
              <span>Enter Portal</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center pt-2 border-t border-slate-100">
        <Link href="/" className="text-xs text-slate-500 hover:text-slate-800">
          &larr; Return to LPC Public Website
        </Link>
      </div>
    </div>
  );
}
