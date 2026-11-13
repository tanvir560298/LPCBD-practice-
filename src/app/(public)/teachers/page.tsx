'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Award,
  BookOpen,
  MapPin,
  Mail,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { SYNTHETIC_TEACHERS, SYNTHETIC_BRANCHES } from '@/lib/mockData';

export default function TeachersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-lpc-navy-50 text-lpc-navy-800 rounded-full text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Faculty & Instructors</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-lpc-navy-900 tracking-tight">
          LPC Academic Faculty & Language Trainers
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Our certified ELT instructors bring decades of collective communicative teaching experience, academic writing mentorship, and test-taking pedagogy across our regional centers.
        </p>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SYNTHETIC_TEACHERS.map((teacher) => {
          const branch = SYNTHETIC_BRANCHES.find(b => teacher.assignedBranchIds.includes(b.id));

          return (
            <div
              key={teacher.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-lpc-navy-800 text-white font-serif font-black text-xl flex items-center justify-center shadow-xs">
                    {teacher.fullName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      {teacher.fullName}
                    </h2>
                    <div className="text-xs font-semibold text-lpc-gold-600">
                      {teacher.department}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Campus: {branch?.city || 'Dhaka Main Campus'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>Senior ELT Pedagogy & Curriculum Design</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400 italic">
                  Synthetic faculty profile
                </span>
                <Link
                  href="/portal"
                  className="text-xs font-bold text-lpc-navy-800 hover:text-lpc-navy-950 flex items-center gap-1"
                >
                  <span>Teacher Portal &rarr;</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Faculty Notice */}
      <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3.5 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-sm block">Faculty Verification Notice:</span>
          <p className="text-amber-800 leading-relaxed">
            These educator profiles represent realistic synthetic models for prototype evaluation. Official teacher photographs, bios, and academic qualifications from https://lpcbd.org/teachers/ are being collected and verified with written consent before production launch.
          </p>
        </div>
      </div>
    </div>
  );
}
