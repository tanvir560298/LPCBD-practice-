'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  Download,
  Filter,
  ShieldAlert,
  Info,
  Calendar,
  BarChart3,
} from 'lucide-react';
import {
  SYNTHETIC_BATCHES,
  SYNTHETIC_STUDENTS,
  SYNTHETIC_ENROLLMENTS,
  INITIAL_ATTENDANCE_SHEETS,
} from '@/lib/mockData';

export default function PortalReportsPage() {
  const [selectedBatchId, setSelectedBatchId] = useState<string>('batch-se-44');

  const selectedBatch = SYNTHETIC_BATCHES.find((b) => b.id === selectedBatchId);
  const enrolledStudentIds = SYNTHETIC_ENROLLMENTS.filter(
    (e) => e.batchId === selectedBatchId && e.status === 'active'
  ).map((e) => e.studentId);

  const students = SYNTHETIC_STUDENTS.filter((s) =>
    enrolledStudentIds.includes(s.id)
  );

  // Mock aggregated attendance metrics for demo
  const studentMetrics = students.map((st, index) => {
    // Generate realistic sample records for past completed sessions
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

  const handleExportCsv = () => {
    // Defend against CSV formula injection by prepending single quote if value starts with =, +, -, @
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
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance Summary Reports</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Batch-level roster metrics, raw counts, and provisional percentage breakdowns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedBatchId}
            onChange={(e) => setSelectedBatchId(e.target.value)}
            className="px-3.5 py-2 text-xs border border-slate-300 rounded-xl bg-white font-medium focus:ring-2 focus:ring-lpc-gold-500"
          >
            {SYNTHETIC_BATCHES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.code} ({b.name})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Provisional Formula Notice per Attendance Spec */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold block">Documented Provisional Formula Notice:</span>
          <p className="text-amber-800 leading-relaxed">
            Attendance percentage policy has NOT been finalized by LPC administration. For prototype review, the provisional rate is computed as: <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">(Present + Late * 0.5) / (Completed Sessions - Excused)</code>. Cancelled and future sessions are strictly excluded from denominators.
          </p>
        </div>
      </div>

      {/* Roster Report Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Batch: {selectedBatch?.name}</span>
          <span className="text-slate-500 font-normal">{students.length} Active Students</span>
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
  );
}

