import { NextRequest, NextResponse } from 'next/server';
import {
  getOrCreateSessionSheet,
  saveDraftSheet,
  submitFinalSheet,
  requestAttendanceCorrection,
} from '@/lib/attendanceStore';
import { SYNTHETIC_CLASS_SESSIONS, SYNTHETIC_STUDENTS, SYNTHETIC_ENROLLMENTS } from '@/lib/mockData';

interface RouteContext {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const sessionId = params.id;
  const session = SYNTHETIC_CLASS_SESSIONS.find((s) => s.id === sessionId);

  if (!session) {
    return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
  }

  // Load roster
  const enrollments = SYNTHETIC_ENROLLMENTS.filter((e) => e.batchId === session.batchId && e.status === 'active');
  const eligibleStudents = SYNTHETIC_STUDENTS.filter((s) => enrollments.some((e) => e.studentId === s.id));

  try {
    const sheet = getOrCreateSessionSheet(sessionId);
    return NextResponse.json({
      success: true,
      session,
      sheet,
      students: eligibleStudents,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Save draft
export async function POST(request: NextRequest, { params }: RouteContext) {
  const sessionId = params.id;
  try {
    const body = await request.json();
    const { records, version, actorId = 't-01' } = body;

    const result = saveDraftSheet(sessionId, records, version, actorId);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: result.code || 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Draft saved successfully on server.',
      sheet: result.sheet,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Malformed JSON payload' }, { status: 400 });
  }
}

// PUT: Final submission (blocks if unmarked)
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const sessionId = params.id;
  try {
    const body = await request.json();
    const { records, version, actorId = 't-01', teacherName = 'Dr. Anisur Rahman' } = body;

    const result = submitFinalSheet(sessionId, records, version, actorId, teacherName);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          unmarkedCount: result.unmarkedCount,
        },
        { status: result.code || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Attendance finalized and locked. Audit record created.',
      sheet: result.sheet,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Malformed JSON payload' }, { status: 400 });
  }
}

// PATCH: Correction request
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const sessionId = params.id;
  try {
    const body = await request.json();
    const { studentId, previousStatus, requestedStatus, reason, teacherId = 't-01' } = body;

    const result = requestAttendanceCorrection(
      sessionId,
      studentId,
      previousStatus,
      requestedStatus,
      reason,
      teacherId
    );

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Correction request submitted for coordinator audit review.',
      request: result.request,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Malformed JSON payload' }, { status: 400 });
  }
}
