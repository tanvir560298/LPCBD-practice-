'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Save,
  Send,
  AlertCircle,
  Search,
  Filter,
  ShieldAlert,
  UserCheck,
  UserX,
  HelpCircle,
  Lock,
  RotateCcw,
  MessageSquare,
  Sparkles,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import {
  AttendanceStatus,
  AttendanceRecord,
  AttendanceSheet,
} from '@/lib/attendanceTypes';
import {
  SYNTHETIC_CLASS_SESSIONS,
  SYNTHETIC_BATCHES,
  SYNTHETIC_COURSES,
  SYNTHETIC_BRANCHES,
  SYNTHETIC_STUDENTS,
  SYNTHETIC_ENROLLMENTS,
  INITIAL_ATTENDANCE_SHEETS,
} from '@/lib/mockData';
import { formatDhakaTimeOnly } from '@/lib/timeUtils';

export default function AttendanceWorkstationPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.id as string;

  const session = SYNTHETIC_CLASS_SESSIONS.find((s) => s.id === sessionId);
  const batch = SYNTHETIC_BATCHES.find((b) => b.id === session?.batchId);
  const course = SYNTHETIC_COURSES.find((c) => c.id === batch?.courseId);
  const branch = SYNTHETIC_BRANCHES.find((b) => b.id === batch?.branchId);

  // Eligible students for this batch
  const eligibleEnrollments = SYNTHETIC_ENROLLMENTS.filter(
    (e) => e.batchId === batch?.id && e.status === 'active'
  );
  const eligibleStudents = SYNTHETIC_STUDENTS.filter((s) =>
    eligibleEnrollments.some((e) => e.studentId === s.id)
  );

  // Initial state from mock or fresh
  const preExistingSheet = INITIAL_ATTENDANCE_SHEETS[sessionId];

  const [sheetStatus, setSheetStatus] = useState<'draft' | 'submitted'>(
    preExistingSheet?.status || 'draft'
  );
  const [version, setVersion] = useState<number>(preExistingSheet?.version || 1);
  const [records, setRecords] = useState<Record<string, AttendanceRecord>>(() => {
    if (preExistingSheet) {
      return { ...preExistingSheet.records };
    }
    // New sheet: all students default to UNMARKED
    const initial: Record<string, AttendanceRecord> = {};
    eligibleStudents.forEach((student) => {
      initial[student.id] = {
        id: `rec-${sessionId}-${student.id}`,
        sessionId,
        studentId: student.id,
        status: 'unmarked',
        updatedAt: new Date().toISOString(),
      };
    });
    return initial;
  });

  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(
    preExistingSheet?.lastSavedAt ? new Date(preExistingSheet.lastSavedAt).toLocaleTimeString() : null
  );
  const [conflictError, setConflictError] = useState<string | null>(null);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AttendanceStatus>('all');

  // Modals
  const [showMarkAllModal, setShowMarkAllModal] = useState(false);
  const [showReviewSubmitModal, setShowReviewSubmitModal] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionStudentId, setCorrectionStudentId] = useState<string | null>(null);
  const [correctionReason, setCorrectionReason] = useState('');
  const [correctionSuccessMessage, setCorrectionSuccessMessage] = useState<string | null>(null);

  // Warn before browser unload if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  if (!session || !batch) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-slate-900">Class Session Not Found</h1>
        <p className="text-xs text-slate-500">The requested session ID does not exist in the faculty schedule.</p>
        <Link href="/portal" className="px-4 py-2 bg-lpc-navy-800 text-white rounded-lg text-xs font-semibold">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Count calculations
  const totalStudents = eligibleStudents.length;
  const unmarkedCount = Object.values(records).filter((r) => r.status === 'unmarked').length;
  const presentCount = Object.values(records).filter((r) => r.status === 'present').length;
  const absentCount = Object.values(records).filter((r) => r.status === 'absent').length;
  const lateCount = Object.values(records).filter((r) => r.status === 'late').length;
  const excusedCount = Object.values(records).filter((r) => r.status === 'excused').length;

  const isSubmitted = sheetStatus === 'submitted';

  // Mark single student
  const handleSetStatus = (studentId: string, status: AttendanceStatus) => {
    if (isSubmitted) return;
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        updatedAt: new Date().toISOString(),
      },
    }));
    setIsDirty(true);
    setConflictError(null);
  };

  const handleSetNote = (studentId: string, note: string) => {
    if (isSubmitted) return;
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note,
        updatedAt: new Date().toISOString(),
      },
    }));
    setIsDirty(true);
  };

  // Mark all present handler
  const handleMarkAllPresent = (replaceExisting: boolean) => {
    setRecords((prev) => {
      const next = { ...prev };
      eligibleStudents.forEach((st) => {
        const current = next[st.id]?.status;
        if (replaceExisting || current === 'unmarked') {
          next[st.id] = {
            ...next[st.id],
            status: 'present',
            updatedAt: new Date().toISOString(),
          };
        }
      });
      return next;
    });
    setIsDirty(true);
    setShowMarkAllModal(false);
  };

  // Save draft
  const handleSaveDraft = async () => {
    setIsSaving(true);
    setConflictError(null);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setLastSavedTime(new Date().toLocaleTimeString() + ' BST');
      setIsDirty(false);
    } catch {
      setConflictError('Network error while saving draft. In-memory edits remain preserved.');
    } finally {
      setIsSaving(false);
    }
  };

  // Submit Final
  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      setSheetStatus('submitted');
      setIsDirty(false);
      setVersion((v) => v + 1);
      setShowReviewSubmitModal(false);
      setLastSavedTime(new Date().toLocaleTimeString() + ' BST');
    } catch {
      setConflictError('Submission conflict. Please review roster and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Correction Request
  const handleSendCorrectionRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionReason.trim()) return;
    setCorrectionSuccessMessage('Correction request submitted to Branch Academic Coordinator for audit review.');
    setTimeout(() => {
      setShowCorrectionModal(false);
      setCorrectionSuccessMessage(null);
      setCorrectionReason('');
      setCorrectionStudentId(null);
    }, 1800);
  };

  // Filtered student list
  const filteredStudents = eligibleStudents.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentCode.toLowerCase().includes(searchQuery.toLowerCase());

    const recordStatus = records[student.id]?.status || 'unmarked';
    const matchesStatus =
      statusFilter === 'all' || recordStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/portal"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Today&apos;s Sessions</span>
        </Link>

        {/* Saved Status Indicator */}
        <div className="flex items-center gap-2">
          {isSaving ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-lpc-navy-800 bg-lpc-navy-50 px-3 py-1 rounded-full border border-lpc-navy-200">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving draft to server...</span>
            </span>
          ) : isDirty ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Unsaved Changes</span>
            </span>
          ) : lastSavedTime ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Saved at {lastSavedTime}</span>
            </span>
          ) : null}
        </div>
      </div>

      {/* Conflict Error Notice if any */}
      {conflictError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between gap-3 text-xs text-rose-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{conflictError}</span>
          </div>
          <button
            type="button"
            onClick={() => setConflictError(null)}
            className="text-xs font-bold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Session Details Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 bg-lpc-navy-900 text-white font-mono font-bold text-xs rounded-lg">
              Session #{session.sessionNumber}
            </span>
            <span className="text-xs font-semibold text-lpc-navy-800 bg-lpc-navy-50 border border-lpc-navy-200 px-2.5 py-1 rounded-lg">
              {batch.name}
            </span>
            {isSubmitted ? (
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Submitted & Locked</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-100 text-amber-900 border border-amber-200">
                Draft Workstation (Rev {version})
              </span>
            )}
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">
              {session.sessionDate} • {formatDhakaTimeOnly(session.startTime)} - {formatDhakaTimeOnly(session.endTime)} BST
            </span>
          </div>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {session.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Course: <strong>{course?.title}</strong> • Room: <strong>{session.room}</strong> ({branch?.name})
          </p>
        </div>
      </div>

      {/* Status Metrics Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-3 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xl font-black text-slate-900">{totalStudents}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Roster</div>
          </div>

          <div className={`p-2.5 rounded-xl border ${
            unmarkedCount > 0 ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <div className={`text-xl font-black ${unmarkedCount > 0 ? 'text-amber-700 font-bold' : 'text-slate-400'}`}>
              {unmarkedCount}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider">Unmarked</div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            <div className="text-xl font-black text-emerald-700">{presentCount}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Present</div>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
            <div className="text-xl font-black text-rose-700">{absentCount}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-rose-800">Absent</div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
            <div className="text-xl font-black text-amber-700">{lateCount}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Late</div>
          </div>

          <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900">
            <div className="text-xl font-black text-sky-700">{excusedCount}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-sky-800">Excused</div>
          </div>
        </div>

        {/* Unmarked Warning Banner */}
        {unmarkedCount > 0 && !isSubmitted && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>{unmarkedCount} students</strong> remain unmarked. Every enrolled student must have an assigned status before final submission.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setStatusFilter('unmarked')}
              className="text-xs font-bold text-amber-800 underline shrink-0 hover:text-amber-950"
            >
              Filter Unmarked Rows &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Toolbar: Search, Filters & Bulk Actions */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student by name or ID (e.g. LPC-26-0101)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-lpc-gold-500"
            />
          </div>

          {/* Action Buttons */}
          {!isSubmitted && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowMarkAllModal(true)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 min-h-[44px]"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mark All Present</span>
              </button>

              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs min-h-[44px] disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>{isSaving ? 'Saving...' : 'Save Draft'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowReviewSubmitModal(true)}
                disabled={unmarkedCount > 0 || isSubmitting}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs min-h-[44px]"
                title={unmarkedCount > 0 ? 'All students must be marked before submitting' : 'Submit final attendance'}
              >
                {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Submit Final Sheet</span>
              </button>
            </div>
          )}

          {isSubmitted && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 italic">
                Sheet locked against direct edits.
              </span>
            </div>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Filter View:</span>
          {(['all', 'unmarked', 'present', 'absent', 'late', 'excused'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg font-bold capitalize transition-all min-h-[36px] ${
                statusFilter === st
                  ? 'bg-lpc-navy-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Student Roster List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
          <div>Enrolled Student Roster ({filteredStudents.length} of {totalStudents})</div>
          <div className="hidden sm:block text-slate-400 font-normal">
            Touch / click status buttons to update record
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-700">No students match your search or filter</p>
            <p className="text-xs text-slate-400">Try clearing the search query or status filter to view all enrolled students.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="mt-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredStudents.map((student) => {
              const currentRecord = records[student.id];
              const currentStatus = currentRecord?.status || 'unmarked';

              return (
                <div
                  key={student.id}
                  className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                    currentStatus === 'unmarked' ? 'bg-amber-50/20' : 'hover:bg-slate-50/60'
                  }`}
                >
                  {/* Student Info */}
                  <div className="flex items-center gap-3 min-w-[240px]">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      currentStatus === 'present' ? 'bg-emerald-100 text-emerald-800' :
                      currentStatus === 'absent' ? 'bg-rose-100 text-rose-800' :
                      currentStatus === 'late' ? 'bg-amber-100 text-amber-800' :
                      currentStatus === 'excused' ? 'bg-sky-100 text-sky-800' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {student.fullName.slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {student.fullName}
                      </div>
                      <div className="text-xs font-mono text-slate-500">
                        {student.studentCode}
                      </div>
                    </div>
                  </div>

                  {/* Status Marking Control Buttons (Mobile friendly >= 44px) */}
                  <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={`Attendance status for ${student.fullName}`}>
                    {(['present', 'absent', 'late', 'excused'] as AttendanceStatus[]).map((statusOption) => {
                      const isSelected = currentStatus === statusOption;

                      return (
                        <button
                          key={statusOption}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => handleSetStatus(student.id, statusOption)}
                          aria-pressed={isSelected}
                          className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold capitalize transition-all border flex items-center gap-1.5 ${
                            isSelected
                              ? statusOption === 'present'
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : statusOption === 'absent'
                                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                : statusOption === 'late'
                                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                                : 'bg-sky-600 text-white border-sky-600 shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          } disabled:opacity-60 disabled:cursor-not-allowed`}
                        >
                          {statusOption === 'present' && <CheckCircle className="w-3.5 h-3.5" />}
                          {statusOption === 'absent' && <UserX className="w-3.5 h-3.5" />}
                          {statusOption === 'late' && <Clock className="w-3.5 h-3.5" />}
                          {statusOption === 'excused' && <ShieldAlert className="w-3.5 h-3.5" />}
                          <span>{statusOption}</span>
                        </button>
                      );
                    })}

                    {!isSubmitted && currentStatus !== 'unmarked' && (
                      <button
                        type="button"
                        onClick={() => handleSetStatus(student.id, 'unmarked')}
                        className="min-h-[44px] px-2.5 py-1 text-slate-400 hover:text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-100"
                        title="Reset to unmarked"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  {/* Optional Note / Correction Button */}
                  <div className="flex items-center gap-2">
                    {!isSubmitted ? (
                      <input
                        type="text"
                        value={currentRecord?.note || ''}
                        onChange={(e) => handleSetNote(student.id, e.target.value)}
                        placeholder="Add note (optional)..."
                        aria-label={`Note for ${student.fullName}`}
                        className="w-full sm:w-44 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-lpc-gold-500 min-h-[44px]"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        {currentRecord?.note && (
                          <span className="text-xs text-slate-500 italic max-w-xs truncate">
                            Note: {currentRecord.note}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setCorrectionStudentId(student.id);
                            setShowCorrectionModal(true);
                          }}
                          className="px-3 py-2 text-xs font-semibold text-lpc-navy-800 hover:bg-lpc-navy-50 border border-lpc-navy-200 rounded-lg transition-colors flex items-center gap-1 min-h-[44px]"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Request Correction</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Mark All Present */}
      {showMarkAllModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Mark All Present</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              How would you like to apply the bulk Present status to this session&apos;s roster?
            </p>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => handleMarkAllPresent(false)}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors text-left flex items-center justify-between"
              >
                <span>Only mark currently UNMARKED students</span>
                <CheckCircle className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleMarkAllPresent(true)}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs sm:text-sm transition-colors text-left flex items-center justify-between"
              >
                <span>Overwrite ALL records (including existing Absent/Late)</span>
                <RotateCcw className="w-4 h-4 text-slate-500" />
              </button>

              <button
                type="button"
                onClick={() => setShowMarkAllModal(false)}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Summary Before Submission Modal */}
      {showReviewSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Confirm Attendance Submission</h3>
                <p className="text-xs text-slate-500">Please review session counts before locking the sheet.</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Batch & Session:</span>
                <strong className="text-slate-800">{batch.name} • #{session.sessionNumber}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Scheduled Time:</span>
                <span className="font-semibold">{formatDhakaTimeOnly(session.startTime)} BST</span>
              </div>
              <div className="grid grid-cols-4 gap-2 pt-2 text-center">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg font-bold">
                  <div>{presentCount}</div>
                  <div className="text-[10px] uppercase">Present</div>
                </div>
                <div className="p-2 bg-rose-100 text-rose-800 rounded-lg font-bold">
                  <div>{absentCount}</div>
                  <div className="text-[10px] uppercase">Absent</div>
                </div>
                <div className="p-2 bg-amber-100 text-amber-800 rounded-lg font-bold">
                  <div>{lateCount}</div>
                  <div className="text-[10px] uppercase">Late</div>
                </div>
                <div className="p-2 bg-sky-100 text-sky-800 rounded-lg font-bold">
                  <div>{excusedCount}</div>
                  <div className="text-[10px] uppercase">Excused</div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-normal">
              <strong>Locking Policy:</strong> Once submitted, the attendance sheet is finalized. Any retrospective corrections require Branch Academic Coordinator approval with an immutable audit entry.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowReviewSubmitModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Return to Sheet
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center gap-1.5"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm & Lock Attendance</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Correction Request Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Request Attendance Correction</h3>
            <p className="text-xs text-slate-600">
              Submit a correction request for student <strong>{SYNTHETIC_STUDENTS.find(s => s.id === correctionStudentId)?.fullName}</strong>.
            </p>

            {correctionSuccessMessage ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold text-center">
                {correctionSuccessMessage}
              </div>
            ) : (
              <form onSubmit={handleSendCorrectionRequest} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="corr-reason">
                    Mandatory Reason for Correction
                  </label>
                  <textarea
                    id="corr-reason"
                    required
                    rows={3}
                    value={correctionReason}
                    onChange={(e) => setCorrectionReason(e.target.value)}
                    placeholder="e.g. Student arrived at 10:15 AM due to verified transport delay; mark should be changed to Late."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-lpc-gold-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCorrectionModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-lpc-navy-800 hover:bg-lpc-navy-900 text-white font-bold text-xs rounded-lg"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
