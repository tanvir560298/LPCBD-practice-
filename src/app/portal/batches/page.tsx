'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  MapPin,
} from 'lucide-react';
import {
  SYNTHETIC_BATCHES,
  SYNTHETIC_COURSES,
  SYNTHETIC_BRANCHES,
  SYNTHETIC_ENROLLMENTS,
} from '@/lib/mockData';

export default function PortalBatchesPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Assigned Cohorts & Batches</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Batches currently assigned to your faculty profile. Teachers can only view and manage attendance for their authorized batches.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SYNTHETIC_BATCHES.map((batch) => {
          const course = SYNTHETIC_COURSES.find((c) => c.id === batch.courseId);
          const branch = SYNTHETIC_BRANCHES.find((b) => b.id === batch.branchId);
          const enrolledCount = SYNTHETIC_ENROLLMENTS.filter(
            (e) => e.batchId === batch.id && e.status === 'active'
          ).length;

          return (
            <div
              key={batch.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-lpc-navy-900 bg-lpc-navy-50 px-2 py-0.5 rounded">
                    {batch.code}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active Term
                  </span>
                </div>

                <h2 className="text-base font-bold text-slate-900">
                  {batch.name}
                </h2>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-medium text-slate-800">{course?.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{batch.schedulePattern}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{enrolledCount} Active Enrolled Students</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <Link
                  href="/portal"
                  className="text-xs font-bold text-lpc-navy-800 hover:text-lpc-navy-950 flex items-center gap-1"
                >
                  <span>View Scheduled Sessions &rarr;</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
