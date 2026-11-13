import { NextRequest, NextResponse } from 'next/server';
import { adminEnrollments, enrollAdminStudent } from '@/lib/adminStore';
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

  return NextResponse.json({ success: true, enrollments: adminEnrollments });
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
    const { studentId, batchId } = body;

    const result = enrollAdminStudent(studentId, batchId);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Student successfully enrolled into batch cohort.',
        enrollment: result.enrollment,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ success: false, error: 'Malformed JSON payload' }, { status: 400 });
  }
}
