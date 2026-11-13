'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Award,
  BookOpen,
  Users,
  CheckCircle,
  ShieldAlert,
  ArrowRight,
  GraduationCap,
  HeartHandshake,
} from 'lucide-react';

export default function AccessProgramPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-lpc-gold-100 text-lpc-gold-900 border border-lpc-gold-300 rounded-full text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Microscholarship Initiative</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-lpc-navy-900 tracking-tight">
          English Access Microscholarship Program
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          The English Access Microscholarship Program provides a foundation of English language skills to bright, economically disadvantaged teenagers through after-school classes and intensive summer learning sessions.
        </p>
      </div>

      {/* Distinction Alert: Scholarship vs Paid Courses */}
      <div className="p-5 bg-lpc-navy-50 border border-lpc-navy-200 rounded-2xl flex items-start gap-3.5 text-xs text-lpc-navy-900">
        <HeartHandshake className="w-5 h-5 text-lpc-navy-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-sm block text-lpc-navy-950">Important Eligibility Information</span>
          <p className="text-slate-600 leading-relaxed">
            The Access Program is a merit- and need-based scholarship initiative. It is completely distinct from LPC’s standard tuition-based public courses. Selection is conducted through dedicated regional school nominations and diagnostic interviews, and no admission fee is charged to enrolled scholarship recipients.
          </p>
        </div>
      </div>

      {/* Program Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-lpc-navy-100 text-lpc-navy-800 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">360+ Hours of Instruction</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Delivering two full academic years of communicative English classes, phonological training, and practical grammar exercises.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-lpc-gold-100 text-lpc-gold-800 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Leadership & Civic Projects</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Students engage in community service initiatives, tree plantation drives, and youth symposiums to build civic responsibility.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Digital & Tech Literacy</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Hands-on multimedia lab sessions fostering computer literacy, online research ethics, and slide presentation design.
          </p>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          Current intake schedules, partner funding attribution, and regional eligibility quotas require formal verification with LPC program coordinators before open publication.
        </span>
      </div>

      {/* Return Links */}
      <div className="pt-2 flex items-center gap-4">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-lpc-navy-800 text-white rounded-xl text-xs font-bold hover:bg-lpc-navy-900 transition-colors"
        >
          <span>View Regular Public Courses</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/schools"
          className="text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          Discover LPC Laboratory Schools &rarr;
        </Link>
      </div>
    </div>
  );
}
