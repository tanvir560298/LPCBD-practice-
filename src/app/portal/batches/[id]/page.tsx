'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  BookOpen,
  MapPin,
  CheckCircle,
  ArrowRight,
  FileText,
} from 'lucide-react';
import {
  SYNTHETIC_BATCHES,
  SYNTHETIC_COURSES,
  SYNTHETIC_BRANCHES,
  SYNTHETIC_STUDENTS,
  SYNTHETIC_ENROLLMENTS,
  SYNTHETIC_CLASS_SESSIONS,
  INITIAL_ATTENDANCE_SHEETS,
} from '@/lib/mockData';
import { formatDhakaTimeOnly } from '@/lib/timeUtils';

export default function BatchDetailPage() {
  const params = useParams();
  const batchId = params?.id as string;

  const batch = SYNTHETIC_BATCHES.find((b) => b.id === batchId);
  const course = SYNTHETIC_COURSES.find((c) => c.id === batch?.courseId);
  const branch = SYNTHETIC_BRANCHES.find((b) => b.id === batch?.branchId);

  if (!batch) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-slate-900">Batch Not Found</h1>
        <p className="text-xs text-slate-500">The requested cohort does not exist or you lack assignment authorization.</p>
        <Link href="/portal/batches" className="px-4 py-2 bg-lpc-navy-800 text-white rounded-lg text-xs font-semibold">
          Back to Batches
        </Link>
      </div>
    );
  }

  // Enrolled students for this batch
  const enrollments = SYNTHETIC_ENROLLMENTS.filter((e) => e.batchId === batch.id);
  const enrolledStudents = SYNTHETIC_STUDENTS.filter((s) =>
    enrollments.some((e) => e.studentId === s.id)
  );

  // Sessions for this batch
  const batchSessions = SYNTHETIC_CLASS_SESSIONS.filter((s) => s.batchId === batch.id);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Navigation */}
      <div>
        <Link
          href="/portal/batches"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Assigned Batches</span>
        </Link>
      </div>

      {/* Batch Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-lpc-navy-900 bg-lpc-navy-50 border border-lpc-navy-200 px-2.5 py-1 rounded-lg">
              {batch.code}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              {batch.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <div className="text-xs text-slate-500">
            Term: <strong>{batch.startDate}</strong> to <strong>{batch.endDate}</strong>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">{batch.name}</h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Curriculum: <strong>{course?.title}</strong> ({course?.level})
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{batch.schedulePattern}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{branch?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span>{enrolledStudents.length} Active Enrolled Students</span>
          </div>
        </div>
      </div>

      {/* Class Sessions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-lpc-navy-700" />
            <span>Class Sessions (Asia/Dhaka BST)</span>
          </h2>
          <span className="text-xs text-slate-500">{batchSessions.length} Scheduled Sessions</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3">Session #</th>
                  <th className="px-5 py-3">Topic / Title</th>
                  <th className="px-5 py-3">Date (Dhaka)</th>
                  <th className="px-5 py-3">Timings</th>
                  <th className="px-5 py-3">Room</th>
                  <th className="px-5 py-3">Attendance Status</th>
                  <th className="px-5 py-3 text-right">Workstation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batchSessions.map((sess) => {
                  const sheet = INITIAL_ATTENDANCE_SHEETS[sess.id];
                  const isSubmitted = sheet?.status === 'submitted';

                  return (
                    <tr key={sess.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-bold font-mono text-slate-900">
                        #{sess.sessionNumber}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-900">
                        {sess.title}
                      </td>
                      <td className="px-5 py-3.5">
                        {sess.sessionDate}
                      </td>
                      <td className="px-5 py-3.5">
                        {formatDhakaTimeOnly(sess.startTime)} – {formatDhakaTimeOnly(sess.endTime)} BST
                      </td>
                      <td className="px-5 py-3.5">
                        {sess.room}
                      </td>
                      <td className="px-5 py-3.5">
                        {isSubmitted ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Submitted</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            Draft Pending
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/portal/sessions/${sess.id}/attendance`}
                          className="px-3 py-1.5 bg-lpc-navy-800 hover:bg-lpc-navy-900 text-white rounded-lg font-bold text-[11px] transition-colors inline-block"
                        >
                          {isSubmitted ? 'View Records' : 'Mark Attendance'}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Enrolled Students Roster Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-lpc-navy-700" />
          <span>Active Enrolled Roster</span>
        </h2>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3">Student Code</th>
                  <th className="px-5 py-3">Full Name</th>
                  <th className="px-5 py-3">Enrolled Since</th>
                  <th className="px-5 py-3">Enrollment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrolledStudents.map((st) => {
                  const enrollment = enrollments.find((e) => e.studentId === st.id);

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-slate-600">
                        {st.studentCode}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {st.fullName}
                      </td>
                      <td className="px-5 py-3.5">
                        {enrollment?.enrolledAt || '2026-10-25'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Active
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
