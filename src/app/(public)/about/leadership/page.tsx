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

      {/* Chairman Featured Profile */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-md">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative shrink-0 mx-auto md:mx-0">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden ring-4 ring-lpc-gold-400 ring-offset-4 ring-offset-white shadow-xl bg-slate-100 p-1">
              <img
                src="/assets/images/leadership/javed-hyder-kareem.jpg"
                alt="Javed Hyder Kareem, Chairman of LPC Board of Directors"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-lpc-navy-950 text-lpc-gold-400 text-[11px] font-bold rounded-full border border-lpc-gold-500/60 shadow-md uppercase tracking-wider whitespace-nowrap">
              Chairman
            </div>
          </div>

          <div className="space-y-4 text-center md:text-left flex-1">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-lpc-gold-50 text-lpc-gold-900 border border-lpc-gold-200 rounded-full text-xs font-bold mb-2">
                <Award className="w-3.5 h-3.5 text-lpc-gold-600" />
                <span>Executive Leadership</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Javed Hyder Kareem
              </h2>
              <div className="text-sm font-semibold text-lpc-navy-800 mt-0.5">
                Chairman, Board of Directors • Language Proficiency Center Ltd.
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              Providing visionary stewardship and executive oversight for Language Proficiency Center (LPC) Bangladesh. Under the guidance of Chairman Javed Hyder Kareem, the Board of Directors steers institutional expansion, curriculum modernization, and strategic capacity-building initiatives across Dhaka, Chattogram, Rajshahi, and Cox&apos;s Bazar.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Executive Governance</span>
              </span>
              <span>•</span>
              <span>Institutional Policy Oversight</span>
              <span>•</span>
              <span>Bilateral Partnerships</span>
            </div>
          </div>
        </div>
      </section>

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
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3.5 text-xs text-slate-700">
        <Info className="w-5 h-5 text-lpc-navy-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-sm text-slate-900 block">Governance Register Status</span>
          <p className="text-slate-600 leading-relaxed">
            Chairman profile verified with official LPC assets. Additional trustee and advisory committee appointments are updated periodically following board resolutions.
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

