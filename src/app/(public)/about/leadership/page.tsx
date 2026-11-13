'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  Building,
  ArrowRight,
  Info,
  Award,
} from 'lucide-react';

export default function LeadershipPage() {
  const leadershipTrustees = [
    {
      title: 'Academic Directorate & Governance',
      role: 'Board of Directors / Executive Trustees',
      description: 'The Governing Board of Language Proficiency Center (LPC) provides strategic oversight, curriculum alignment, financial audit governance, and bilateral partnership coordination across all regional branches and laboratory schools in Bangladesh.',
    },
    {
      title: 'Pedagogical Advisory Committee',
      role: 'Curriculum Standards & Teacher Accreditation',
      description: 'Oversees continuous syllabus revision, CEFR benchmarking, teacher training certification, and diagnostic assessment standards.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-lpc-navy-50 text-lpc-navy-800 rounded-full text-xs font-semibold">
          <Users className="w-3.5 h-3.5" />
          <span>Institutional Governance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-lpc-navy-900 tracking-tight">
          Board of Directors & Executive Governance
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          The governing leadership responsible for LPC’s academic integrity, public-interest initiatives, and educational expansion in Bangladesh.
        </p>
      </div>

      {/* Governance Framework Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {leadershipTrustees.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-lpc-navy-100 text-lpc-navy-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-lpc-gold-600">
                {item.role}
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {item.title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Owner Verification Notice */}
      <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3.5 text-xs text-amber-900">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-sm block">Content Verification Notice: Board Member Roster</span>
          <p className="text-amber-800 leading-relaxed">
            Per the project brief requirements, individual names, biographies, and portraits of Board Trustees from the legacy website (https://lpcbd.org/board-of-directors/) are undergoing formal identity re-verification with LPC administration. This ensures only current, active trustees with verified permissions are published.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 flex items-center gap-4">
        <Link
          href="/teachers"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-lpc-navy-800 text-white rounded-xl text-xs font-bold hover:bg-lpc-navy-900 transition-colors"
        >
          <span>View Academic Faculty & Teachers</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/about"
          className="text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          Back to Overview
        </Link>
      </div>
    </div>
  );
}
