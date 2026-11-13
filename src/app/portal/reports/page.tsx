'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  Download,
  Filter,
  ShieldAlert,
  Info,
  Calendar,
  BarChart3,
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import {
  SYNTHETIC_BATCHES,
  SYNTHETIC_STUDENTS,
  SYNTHETIC_ENROLLMENTS,
  SYNTHETIC_CLASS_SESSIONS,
  INITIAL_ATTENDANCE_SHEETS,
} from '@/lib/mockData';
import { formatDhakaTimeOnly } from '@/lib/timeUtils';

export default function PortalReportsPage() {
  const [activeTab, setActiveTab] = useState<'roster' | 'missing' | 'student'>('roster');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('batch-se-44');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('s-01');

  const selectedBatch = SYNTHETIC_BATCHES.find((b) => b.id === selectedBatchId);
  const enrolledStudentIds = SYNTHETIC_ENROLLMENTS.filter(
    (e) => e.batchId === selectedBatchId && e.status === 'active'
  ).map((e) => e.studentId);

  const students = SYNTHETIC_STUDENTS.filter((s) =>
    enrolledStudentIds.includes(s.id)
  );

  // Missing Attendance Sessions across the institution/batch
  const missingAttendanceSessions = SYNTHETIC_CLASS_SESSIONS.filter((sess) => {
    const sheet = INITIAL_ATTENDANCE_SHEETS[sess.id];
    // Past or scheduled session with no submitted sheet
    return !sheet || sheet.status !== 'submitted';
  });

  // Aggregated attendance metrics
  const studentMetrics = students.map((st, index) => {
    const totalCompleted = 4;
    const present = index === 2 ? 3 : index === 4 ? 2 : index === 7 ? 3 : 4;
    const absent = index === 4 ? 2 : 0;
    const late = index === 2 ? 1 : 0;
    const excused = index === 7 ? 1 : 0;

    // Documented provisional formula: (Present + Late*0.5) / (Total - Excused)
    const effectiveAttended = present + late * 0.5;
    const eligibleTotal = Math.max(1, totalCompleted - excused);
    const provisionalPercentage = Math.round((effectiveAttended / eligibleTotal) * 100);

    return {
      student: st,
      totalCompleted,
      present,
      absent,
      late,
      excused,
      provisionalPercentage,
    };
  });

  // CSV Export with formula injection defense
  const handleExportCsv = () => {
    const sanitize = (val: string) => {
      if (/^[=+\-@\t\r]/.test(val)) {
        return `'${val}`;
      }
      return `"${val.replace(/"/g, '""')}"`;
    };

    const headers = ['Student Code', 'Full Name', 'Completed Sessions', 'Present', 'Absent', 'Late', 'Excused', 'Provisional Rate %'];
    const rows = studentMetrics.map((m) => [
      sanitize(m.student.studentCode),
      sanitize(m.student.fullName),
      m.totalCompleted,
      m.present,
      m.absent,
      m.late,
      m.excused,
      `${m.provisionalPercentage}%`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `lpc-attendance-report-${selectedBatchId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance Reports & Analysis</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Scoped institutional reports, missing attendance logs, and student performance histories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {activeTab === 'roster' && (
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white font-medium focus:ring-2 focus:ring-lpc-gold-500 min-h-[44px]"
            >
              {SYNTHETIC_BATCHES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.code} ({b.name})
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs min-h-[44px]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Formula-Safe CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('roster')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'roster'
              ? 'border-lpc-navy-900 text-lpc-navy-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Batch Roster Summary
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('missing')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'missing'
              ? 'border-lpc-navy-900 text-lpc-navy-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Missing Attendance Sessions</span>
          {missingAttendanceSessions.length > 0 && (
            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full text-[10px]">
              {missingAttendanceSessions.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('student')}
          className={`pb-3 px-4 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'student'
              ? 'border-lpc-navy-900 text-lpc-navy-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Individual Student History
        </button>
      </div>

      {/* Tab 1: Batch Roster Report */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block">Documented Provisional Formula Notice:</span>
              <p className="text-amber-800 leading-relaxed">
                Attendance rate is computed as: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">(Present + Late * 0.5) / (Completed Sessions - Excused)</code>. Cancelled and future sessions are strictly excluded from denominators.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Batch: {selectedBatch?.name}</span>
              <span className="text-slate-500 font-normal">{students.length} Active Enrolled Students</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Student ID</th>
                    <th className="px-5 py-3">Full Name</th>
                    <th className="px-4 py-3 text-center">Completed</th>
                    <th className="px-4 py-3 text-center text-emerald-700">Present</th>
                    <th className="px-4 py-3 text-center text-rose-700">Absent</th>
                    <th className="px-4 py-3 text-center text-amber-700">Late</th>
                    <th className="px-4 py-3 text-center text-sky-700">Excused</th>
                    <th className="px-5 py-3 text-right">Provisional Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentMetrics.map((row) => (
                    <tr key={row.student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-slate-500">
                        {row.student.studentCode}
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {row.student.fullName}
                      </td>
                      <td className="px-4 py-3.5 text-center font-medium">
                        {row.totalCompleted}
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-emerald-700">
                        {row.present}
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-rose-700">
                        {row.absent}
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-amber-700">
                        {row.late}
                      </td>
                      <td className="px-4 py-3.5 text-center font-bold text-sky-700">
                        {row.excused}
                      </td>
                      <td className="px-5 py-3.5 text-right font-black text-slate-900">
                        <span className={`px-2 py-0.5 rounded ${
                          row.provisionalPercentage >= 80 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {row.provisionalPercentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Missing Attendance Sessions */}
      {activeTab === 'missing' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold block">Compliance Monitoring:</span>
              <span>Identifies class sessions that are pending draft submission or have unresolved attendance entries.</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Session #</th>
                    <th className="px-5 py-3">Topic / Title</th>
                    <th className="px-5 py-3">Class Date (Dhaka)</th>
                    <th className="px-5 py-3">Timings</th>
                    <th className="px-5 py-3">Compliance State</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {missingAttendanceSessions.map((sess) => {
                    const batch = SYNTHETIC_BATCHES.find((b) => b.id === sess.batchId);
                    return (
                      <tr key={sess.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3.5 font-bold font-mono text-slate-900">
                          #{sess.sessionNumber}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-900">{sess.title}</div>
                          <div className="text-[11px] text-slate-500">{batch?.name}</div>
                        </td>
                        <td className="px-5 py-3.5 font-medium">{sess.sessionDate}</td>
                        <td className="px-5 py-3.5">{formatDhakaTimeOnly(sess.startTime)} – {formatDhakaTimeOnly(sess.endTime)}</td>
                        <td className="px-5 py-3.5">
                          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                            Missing Final Submission
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link
                            href={`/portal/sessions/${sess.id}/attendance`}
                            className="px-3 py-1.5 bg-lpc-navy-800 hover:bg-lpc-navy-900 text-white rounded-lg font-bold text-[11px]"
                          >
                            Mark Now &rarr;
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
      )}

      {/* Tab 3: Individual Student History */}
      {activeTab === 'student' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700">Select Student:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-medium"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.fullName} ({st.studentCode})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Attendance Timeline for {students.find(s => s.id === selectedStudentId)?.fullName}
              </h3>
              <p className="text-xs text-slate-500">Student Code: {students.find(s => s.id === selectedStudentId)?.studentCode}</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Session #4: Describing Situations & Spatial Vocabulary</span>
                  <div className="text-[11px] text-slate-500">2026-11-11 • 10:00 AM BST</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Present
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">Session #3: Expressing Opinions & Polite Disagreement</span>
                  <div className="text-[11px] text-slate-500">2026-11-08 • 10:00 AM BST</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Present
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
