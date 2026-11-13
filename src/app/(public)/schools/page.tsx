'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Building,
  MapPin,
  ArrowRight,
  ShieldAlert,
  BookOpen,
  Users,
} from 'lucide-react';

export default function SchoolsOverviewPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-lpc-navy-50 text-lpc-navy-800 rounded-full text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Institutional Education</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-lpc-navy-900 tracking-tight">
          LPC Laboratory Schools & Colleges
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Integrated primary and secondary educational institutions providing national curriculum excellence integrated with modern communicative English fluency and science laboratories.
        </p>
      </div>

      {/* School Campuses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Dhaka Campus */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-7 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-lpc-navy-50 text-lpc-navy-800 border border-lpc-navy-200">
              Dhaka Division Campus
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              LPC Laboratory School & College, Dhaka
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Located in the central educational hub of Dhanmondi, providing co-educational schooling from kindergarten through higher secondary certification with state-of-the-art multimedia language labs.
            </p>

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-lpc-navy-600" />
                <span>House 42, Road 9/A, Dhanmondi R/A, Dhaka-1209</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Curriculum: NCTB (English & Bangla Medium Versions)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              href="/schools/dhaka"
              className="inline-flex items-center gap-2 text-xs font-bold text-lpc-navy-800 hover:text-lpc-navy-950"
            >
              <span>Explore Dhaka Campus Curriculum & Admissions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Rajshahi Campus */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-7 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Rajshahi Division Campus
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              LPC Laboratory School & College, Rajshahi
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Serving northern Bangladesh with balanced academic foundations, rigorous STEM facilities, and intensive communicative English training for primary and secondary students.
            </p>

            <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Ghoramara, Boalia, Rajshahi-6100</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Curriculum: NCTB National Curriculum</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <Link
              href="/schools/rajshahi"
              className="inline-flex items-center gap-2 text-xs font-bold text-lpc-navy-800 hover:text-lpc-navy-950"
            >
              <span>Explore Rajshahi Campus Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          Laboratory school admission cycles, academic fees, and faculty rolls are currently undergoing administrative confirmation with the central LPC Directorate.
        </span>
      </div>
    </div>
  );
}
