'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  Award,
  Globe,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function AlumniPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-lpc-navy-50 text-lpc-navy-800 rounded-full text-xs font-semibold">
          <Globe className="w-3.5 h-3.5" />
          <span>LPC Community</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-lpc-navy-900 tracking-tight">
          LPC Alumni & Professional Network
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Connecting graduates of LPC courses, Access Program scholars, and laboratory school alumni across universities, corporate sectors, and global graduate institutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-lpc-navy-100 text-lpc-navy-800 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Mentorship Circles</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Senior alumni in academia and industry provide peer mentorship to current LPC batches preparing for study abroad and competitive viva examinations.
          </p>
        </div>

        <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-lpc-gold-100 text-lpc-gold-800 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Annual Alumni Colloquium</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Reconnecting former classmates and educators in Dhaka and Chattogram to share professional insights and celebrate educational milestones.
          </p>
        </div>

        <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Career & Higher Ed Links</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Facilitating scholarship recommendation letters, IELTS score benchmarking tips, and corporate workplace references.
          </p>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          The official LPC Alumni Directory and registration portal are being prepared in consultation with the LPC Board of Trustees.
        </span>
      </div>

      <div className="pt-2">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-lpc-navy-800 text-white rounded-xl text-xs font-bold hover:bg-lpc-navy-900 transition-colors"
        >
          <span>Connect with Alumni Relations</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

