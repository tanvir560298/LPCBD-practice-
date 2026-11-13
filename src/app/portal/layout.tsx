'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  GraduationCap,
  LayoutDashboard,
  Lock,
  LogOut,
  ShieldAlert,
  UserCheck,
  Users,
  Shield,
  Layers,
} from 'lucide-react';
import { SYNTHETIC_USERS } from '@/lib/mockData';
import { INSTITUTION_TIMEZONE, formatDhakaDateTime } from '@/lib/timeUtils';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeActorId, setActiveActorId] = useState<string>('t-01');
  const [currentDhakaTime, setCurrentDhakaTime] = useState<string>('');

  const activeActor =
    SYNTHETIC_USERS.find((u) => u.id === activeActorId) || SYNTHETIC_USERS[0];

  useEffect(() => {
    // Synchronize demo session cookie so server route handlers can identify the actor
    if (typeof document !== 'undefined') {
      document.cookie = `lpc_demo_user=${activeActorId}; path=/; SameSite=Lax`;
      window.dispatchEvent(new CustomEvent('lpc_actor_change', { detail: activeActorId }));
    }
  }, [activeActorId]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat('en-US', {
        timeZone: INSTITUTION_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(now);
      setCurrentDhakaTime(timeStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* 1. Mandatory Isolated Synthetic Demo Mode Banner */}
      <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-semibold border-b border-amber-600 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-slate-950" />
            <span>
              <strong>PROVISIONAL SYNTHETIC DEMO MODE:</strong> Role-Scoped Attendance System (Asia/Dhaka GMT+6). No real student records or production secrets used.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-600/40 px-2 py-0.5 rounded text-[11px] font-mono font-bold">
              Dhaka Time: {currentDhakaTime || '10:00:00 AM'} BST
            </span>
          </div>
        </div>
      </div>

      {/* 2. Full-Size Dedicated Portal Header */}
      <header className="bg-lpc-navy-950 text-white border-b border-lpc-navy-900 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Brand & Portal Label */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white p-1 border border-slate-700/60 shadow-xs flex items-center justify-center shrink-0">
              <img
                src="/assets/images/lpc-emblem.png"
                alt="LPC Official Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                <span>LPC Faculty & Staff Portal</span>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                  activeActor.role === 'admin'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    : activeActor.role === 'coordinator'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  {activeActor.role === 'admin' ? 'Administrator' : activeActor.role === 'coordinator' ? 'Campus Coordinator' : 'Authorized Faculty'}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Language Proficiency Center, Bangladesh
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2 text-xs font-semibold">
            <Link
              href="/portal"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname === '/portal'
                  ? 'bg-lpc-navy-800 text-white border border-lpc-navy-700'
                  : 'text-slate-300 hover:text-white hover:bg-lpc-navy-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Today&apos;s Sessions</span>
            </Link>

            <Link
              href="/portal/batches"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname === '/portal/batches'
                  ? 'bg-lpc-navy-800 text-white border border-lpc-navy-700'
                  : 'text-slate-300 hover:text-white hover:bg-lpc-navy-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>My Batches</span>
            </Link>

            <Link
              href="/portal/reports"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname === '/portal/reports'
                  ? 'bg-lpc-navy-800 text-white border border-lpc-navy-700'
                  : 'text-slate-300 hover:text-white hover:bg-lpc-navy-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Reports</span>
            </Link>

            <Link
              href="/portal/admin"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname === '/portal/admin' || pathname === '/portal/admin/import'
                  ? 'bg-purple-900/60 text-purple-200 border border-purple-700'
                  : 'text-slate-300 hover:text-white hover:bg-lpc-navy-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>Administration</span>
            </Link>
          </nav>

          {/* Identity Switcher (For Demo & Verification) & Exit */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-lpc-navy-900 border border-lpc-navy-800 rounded-lg p-1.5 text-xs">
              <span className="text-slate-400 text-[11px] hidden sm:inline">Actor:</span>
              <select
                value={activeActorId}
                onChange={(e) => setActiveActorId(e.target.value)}
                className="bg-lpc-navy-950 text-white text-xs rounded border border-slate-700 px-2 py-1 font-medium focus:ring-1 focus:ring-lpc-gold-400"
                aria-label="Switch Actor Identity"
              >
                {SYNTHETIC_USERS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName} — {u.role.toUpperCase()} ({u.assignedBranchIds.join(', ')})
                  </option>
                ))}
              </select>
            </div>

            <Link
              href="/"
              className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-lpc-navy-900 hover:bg-lpc-navy-800 border border-lpc-navy-800 transition-colors flex items-center gap-1 min-h-[36px]"
              title="Return to Public Website"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Public Site</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Full-Size Portal Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Minimalist Portal Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 px-4 sm:px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Active User: <strong className="text-slate-800">{activeActor.fullName}</strong> • Role: <span className="capitalize font-semibold text-slate-700">{activeActor.role}</span> • Scope: <span className="text-slate-600">{activeActor.assignedBranchIds.join(', ') || 'Global'}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-500 text-[11px]">
            <span>System Designed &amp; Engineered by <strong className="text-slate-800 font-semibold">TANVIR AHMAD</strong></span>
            <span className="text-slate-300">•</span>
            <span>Asia/Dhaka (BST)</span>
            <span className="text-slate-300">•</span>
            <span>Audit Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
