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
} from 'lucide-react';
import { SYNTHETIC_TEACHERS } from '@/lib/mockData';
import { INSTITUTION_TIMEZONE, formatDhakaDateTime } from '@/lib/timeUtils';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeTeacherId, setActiveTeacherId] = useState<string>('t-01');
  const [currentDhakaTime, setCurrentDhakaTime] = useState<string>('');

  const activeTeacher =
    SYNTHETIC_TEACHERS.find((t) => t.id === activeTeacherId) || SYNTHETIC_TEACHERS[0];

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
              <strong>PROVISIONAL SYNTHETIC DEMO MODE:</strong> Session-based Attendance System (Asia/Dhaka GMT+6). No real student records or secrets used.
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
            <div className="w-9 h-9 rounded-lg bg-lpc-navy-800 border border-lpc-navy-700 flex items-center justify-center font-serif font-black text-white text-base">
              LPC
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                <span>Teacher Attendance Workstation</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Authorized Faculty
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
          </nav>

          {/* Teacher Profile Switcher (For Demo Inspection) & Exit */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-lpc-navy-900 border border-lpc-navy-800 rounded-lg p-1.5 text-xs">
              <span className="text-slate-400 text-[11px] hidden sm:inline">Simulate Teacher:</span>
              <select
                value={activeTeacherId}
                onChange={(e) => setActiveTeacherId(e.target.value)}
                className="bg-lpc-navy-950 text-white text-xs rounded border border-slate-700 px-2 py-1 font-medium focus:ring-1 focus:ring-lpc-gold-400"
                aria-label="Switch Teacher Identity"
              >
                {SYNTHETIC_TEACHERS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName} ({t.id === 't-03' ? 'CTG' : 'Dhaka'})
                  </option>
                ))}
              </select>
            </div>

            <Link
              href="/"
              className="text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-lpc-navy-900 hover:bg-lpc-navy-800 border border-lpc-navy-800 transition-colors flex items-center gap-1"
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
            Logged in as <strong className="text-slate-800">{activeTeacher.fullName}</strong> • Role: Faculty Teacher
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Class Timings: Asia/Dhaka (BST)</span>
            <span>•</span>
            <span>Audit Logging: Active (UTC Stored)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

