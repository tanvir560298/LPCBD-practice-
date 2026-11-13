import { NextRequest, NextResponse } from 'next/server';
import {
  getOrCreateSessionSheet,
  saveDraftSheet,
  submitFinalSheet,
  requestAttendanceCorrection,
} from '@/lib/attendanceStore';
import { getAuthenticatedActor, verifySessionAttendanceAccess } from '@/lib/authAdapter';
import { checkRateLimit } from '@/lib/rateLimit';
import { SYNTHETIC_CLASS_SESSIONS, SYNTHETIC_STUDENTS, SYNTHETIC_ENROLLMENTS } from '@/lib/mockData';

interface RouteContext {
  params: { id: string };
}

// GET: Load attendance sheet & eligible roster
export async function GET(request: NextRequest, { params }: RouteContext) {
  // 1. Authenticate Actor
  const authResult = await getAuthenticatedActor(request);
  if (!authResult.actor) {
    return NextResponse.json(
      { success: false, error: authResult.error || 'Unauthorized' },
      { status: authResult.statusCode || 401 }
    );
  }

  // 2. Locate Session
  const sessionId = params.id;
  const session = SYNTHETIC_CLASS_SESSIONS.find((s) => s.id === sessionId);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
  }

  // 3. Verify Role/Scope Permission
  const authCheck = verifySessionAttendanceAccess(authResult.actor, session, false);
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, error: authCheck.reason },
      { status: authCheck.statusCode || 403 }
    );
  }

  // 4. Load Roster
  const enrollments = SYNTHETIC_ENROLLMENTS.filter(
    (e) => e.batchId === session.batchId && e.status === 'active'
  );
  const eligibleStudents = SYNTHETIC_STUDENTS.filter((s) =>
    enrollments.some((e) => e.studentId === s.id)
  );

  try {
    const sheet = getOrCreateSessionSheet(sessionId);
    return NextResponse.json({
      success: true,
      session,
      sheet,
      students: eligibleStudents,
      actor: {
        id: authResult.actor.id,
        fullName: authResult.actor.fullName,
        role: authResult.actor.role,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Save draft attendance
export async function POST(request: NextRequest, { params }: RouteContext) {
  // 1. Rate Limiting Check
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimit = checkRateLimit(`att-draft:${clientIp}`, 60, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Rate limit exceeded. Please slow down.' },
      { status: 429 }
    );
  }

  // 2. Authenticate Actor
  const authResult = await getAuthenticatedActor(request);
  if (!authResult.actor) {
    return NextResponse.json(
      { success: false, error: authResult.error || 'Unauthorized' },
      { status: authResult.statusCode || 401 }
    );
  }

  // 3. Locate Session
  const sessionId = params.id;
  const session = SYNTHETIC_CLASS_SESSIONS.find((s) => s.id === sessionId);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
  }

  // 4. Verify Scope & Cancelled State (Write Operation)
  const authCheck = verifySessionAttendanceAccess(authResult.actor, session, true);
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, error: authCheck.reason },
      { status: authCheck.statusCode || 403 }
    );
  }

  try {
    const body = await request.json();
    const { records, version } = body;

    // Use the authenticated actor's ID directly, completely ignoring any client-injected actorId
    const result = saveDraftSheet(sessionId, records, version, authResult.actor.id);
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

// PUT: Final submission (blocks if unmarked rows remain or session cancelled)
export async function PUT(request: NextRequest, { params }: RouteContext) {
  // 1. Rate Limiting Check
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const rateLimit = checkRateLimit(`att-submit:${clientIp}`, 30, 60_000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Rate limit exceeded. Please wait a moment.' },
      { status: 429 }
    );
  }

  // 2. Authenticate Actor
  const authResult = await getAuthenticatedActor(request);
  if (!authResult.actor) {
    return NextResponse.json(
      { success: false, error: authResult.error || 'Unauthorized' },
      { status: authResult.statusCode || 401 }
    );
  }

  // 3. Locate Session
  const sessionId = params.id;
  const session = SYNTHETIC_CLASS_SESSIONS.find((s) => s.id === sessionId);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
  }

  // 4. Verify Scope & Cancelled State (Write Operation)
  const authCheck = verifySessionAttendanceAccess(authResult.actor, session, true);
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, error: authCheck.reason },
      { status: authCheck.statusCode || 403 }
    );
  }

  try {
    const body = await request.json();
    const { records, version } = body;

    // Server-enforced identity: actor ID and name are taken exclusively from the verified session
    const result = submitFinalSheet(
      sessionId,
      records,
      version,
      authResult.actor.id,
      authResult.actor.fullName
    );

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
      message: 'Attendance finalized and locked. Immutable audit record created.',
      sheet: result.sheet,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Malformed JSON payload' }, { status: 400 });
  }
}

// PATCH: Attendance Correction request
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  // 1. Authenticate Actor
  const authResult = await getAuthenticatedActor(request);
  if (!authResult.actor) {
    return NextResponse.json(
      { success: false, error: authResult.error || 'Unauthorized' },
      { status: authResult.statusCode || 401 }
    );
  }

  // 2. Locate Session
  const sessionId = params.id;
  const session = SYNTHETIC_CLASS_SESSIONS.find((s) => s.id === sessionId);
  if (!session) {
    return NextResponse.json({ success: false, error: 'Session not found' }, { status: 404 });
  }

  // 3. Verify Scope
  const authCheck = verifySessionAttendanceAccess(authResult.actor, session, true);
  if (!authCheck.authorized) {
    return NextResponse.json(
      { success: false, error: authCheck.reason },
      { status: authCheck.statusCode || 403 }
    );
  }

  try {
    const body = await request.json();
    const { studentId, previousStatus, requestedStatus, reason } = body;

    const result = requestAttendanceCorrection(
      sessionId,
      studentId,
      previousStatus,
      requestedStatus,
      reason,
      authResult.actor.id
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
