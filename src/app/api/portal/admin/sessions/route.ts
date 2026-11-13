import { NextRequest, NextResponse } from 'next/server';
import { adminSessions, createAdminSession, cancelAdminSession } from '@/lib/adminStore';
import { getAuthenticatedActor, verifyAdminAccess, verifyCoordinatorOrAdminAccess } from '@/lib/authAdapter';

export async function GET(request: NextRequest) {
  const authResult = await getAuthenticatedActor(request);
  if (!authResult.actor) {
    return NextResponse.json(
      { success: false, error: authResult.error || 'Unauthorized' },
      { status: authResult.statusCode || 401 }
    );
  }

  const check = verifyCoordinatorOrAdminAccess(authResult.actor);
  if (!check.authorized) {
    return NextResponse.json({ success: false, error: check.reason }, { status: 403 });
  }

  return NextResponse.json({ success: true, sessions: adminSessions });
}

export async function POST(request: NextRequest) {
  const authResult = await getAuthenticatedActor(request);
  if (!authResult.actor) {
    return NextResponse.json(
      { success: false, error: authResult.error || 'Unauthorized' },
      { status: authResult.statusCode || 401 }
    );
  }

  const check = verifyAdminAccess(authResult.actor);
  if (!check.authorized) {
    return NextResponse.json({ success: false, error: check.reason }, { status: 403 });
  }

  try {
    const body = await request.json();

    // Check if cancellation action or creation
    if (body.action === 'cancel') {
      const result = cancelAdminSession(body.sessionId, body.reason);
      if (!result.success) {
        return NextResponse.json({ success: false, error: result.error }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        message: 'Session status updated to cancelled. Audit recorded.',
        session: result.session,
      });
    }

    const result = createAdminSession(body);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Class session scheduled successfully in Asia/Dhaka timetable.',
        session: result.session,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ success: false, error: 'Malformed JSON payload' }, { status: 400 });
  }
}

