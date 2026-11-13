import { NextRequest, NextResponse } from 'next/server';
import { adminBatches, createAdminBatch } from '@/lib/adminStore';
import { getAuthenticatedActor, verifyAdminAccess, verifyCoordinatorOrAdminAccess } from '@/lib/authAdapter';

export async function GET(request: NextRequest) {
  const authResult = await getAuthenticatedActor(request);
  if (!authResult.actor) {
    return NextResponse.json(
      { success: false, error: authResult.error || 'Unauthorized' },
      { status: authResult.statusCode || 401 }
    );
  }

  // Scoped read: coordinator or admin
  const check = verifyCoordinatorOrAdminAccess(authResult.actor);
  if (!check.authorized) {
    return NextResponse.json({ success: false, error: check.reason }, { status: 403 });
  }

  // Filter by branch if coordinator
  let batches = adminBatches;
  if (authResult.actor.role === 'coordinator' && authResult.actor.branchId) {
    batches = adminBatches.filter((b) => b.branchId === authResult.actor!.branchId);
  }

  return NextResponse.json({ success: true, batches });
}

export async function POST(request: NextRequest) {
  const authResult = await getAuthenticatedActor(request);
  if (!authResult.actor) {
    return NextResponse.json(
      { success: false, error: authResult.error || 'Unauthorized' },
      { status: authResult.statusCode || 401 }
    );
  }

  // Administrative mutation requires admin role
  const check = verifyAdminAccess(authResult.actor);
  if (!check.authorized) {
    return NextResponse.json({ success: false, error: check.reason }, { status: 403 });
  }

  try {
    const body = await request.json();
    const result = createAdminBatch(body);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'New academic cohort batch registered successfully.',
        batch: result.batch,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ success: false, error: 'Malformed JSON payload' }, { status: 400 });
  }
}

