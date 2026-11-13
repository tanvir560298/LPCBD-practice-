import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { getAuthenticatedActor, verifySessionAttendanceAccess, verifyAdminAccess } from '../src/lib/authAdapter';
import { checkRateLimit, resetRateLimits } from '../src/lib/rateLimit';
import { createAdminBatch, createAdminSession, cancelAdminSession, adminBatches, adminSessions } from '../src/lib/adminStore';
import { SYNTHETIC_CLASS_SESSIONS, SYNTHETIC_USERS } from '../src/lib/mockData';
import { GET as getAttendanceHandler, POST as postDraftHandler, PUT as putSubmitHandler } from '../src/app/api/portal/sessions/[id]/attendance/route';
import { POST as postBatchHandler } from '../src/app/api/portal/admin/batches/route';

describe('Security Policies, Authorization Scopes & Fail-Closed Boundaries', () => {
  beforeEach(() => {
    resetRateLimits();
    // Default to demo mode for unit testing
    process.env.NEXT_PUBLIC_DEMO_MODE = 'true';
  });

  it('enforces fail-closed behavior in production mode when Supabase credentials are missing', async () => {
    // Simulate production mode
    process.env.NEXT_PUBLIC_DEMO_MODE = 'false';
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    const req = new NextRequest('http://localhost:3000/api/portal/sessions/sess-today-01/attendance');
    const result = await getAuthenticatedActor(req);

    expect(result.actor).toBeNull();
    expect(result.statusCode).toBe(503);
    expect(result.error).toContain('Missing Supabase backend credentials');

    // Restore demo mode
    process.env.NEXT_PUBLIC_DEMO_MODE = 'true';
  });

  it('enforces fail-closed behavior in production mode when token is missing', async () => {
    process.env.NEXT_PUBLIC_DEMO_MODE = 'false';
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://sample-project.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'sample-secret-service-key';

    const req = new NextRequest('http://localhost:3000/api/portal/sessions/sess-today-01/attendance');
    const result = await getAuthenticatedActor(req);

    expect(result.actor).toBeNull();
    expect(result.statusCode).toBe(401);
    expect(result.error).toContain('Authentication required');

    // Clean up
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    process.env.NEXT_PUBLIC_DEMO_MODE = 'true';
  });

  it('rejects cross-branch access: teacher t-01 cannot access Chattogram session assigned to t-03', async () => {
    const teacher1 = SYNTHETIC_USERS.find((u) => u.id === 't-01')!;
    const ctgSession = SYNTHETIC_CLASS_SESSIONS.find((s) => s.id === 'sess-ctg-01')!;

    const check = verifySessionAttendanceAccess(teacher1, ctgSession, false);
    expect(check.authorized).toBe(false);
    expect(check.statusCode).toBe(403);
    expect(check.reason).toContain('is not authorized for session');
  });

  it('rejects cross-branch access: Dhaka coordinator cannot access Chattogram session', async () => {
    const dhakaCoord = SYNTHETIC_USERS.find((u) => u.id === 'coord-dhaka')!;
    const ctgSession = SYNTHETIC_CLASS_SESSIONS.find((s) => s.id === 'sess-ctg-01')!;

    const check = verifySessionAttendanceAccess(dhakaCoord, ctgSession, false);
    expect(check.authorized).toBe(false);
    expect(check.statusCode).toBe(403);
    expect(check.reason).toContain('cannot access branch br-chattogram');
  });

  it('permits authorized branch coordinator to access sessions within their own branch', async () => {
    const ctgCoord = SYNTHETIC_USERS.find((u) => u.id === 'coord-ctg')!;
    const ctgSession = SYNTHETIC_CLASS_SESSIONS.find((s) => s.id === 'sess-ctg-01')!;

    const check = verifySessionAttendanceAccess(ctgCoord, ctgSession, false);
    expect(check.authorized).toBe(true);
  });

  it('permits institutional administrator global access across all branches', async () => {
    const admin = SYNTHETIC_USERS.find((u) => u.id === 'admin-01')!;
    const ctgSession = SYNTHETIC_CLASS_SESSIONS.find((s) => s.id === 'sess-ctg-01')!;
    const dhakaSession = SYNTHETIC_CLASS_SESSIONS.find((s) => s.id === 'sess-today-01')!;

    expect(verifySessionAttendanceAccess(admin, ctgSession, false).authorized).toBe(true);
    expect(verifySessionAttendanceAccess(admin, dhakaSession, false).authorized).toBe(true);
  });

  it('blocks deactivated instructor account from accessing portal APIs', async () => {
    const req = new NextRequest('http://localhost:3000/api/portal/sessions/sess-today-01/attendance', {
      headers: { 'x-lpc-actor-id': 't-disabled' },
    });

    const res = await getAttendanceHandler(req, { params: { id: 'sess-today-01' } });
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toContain('deactivated');
  });

  it('strictly blocks attendance submission on a cancelled class session with HTTP 422', async () => {
    const teacher1 = SYNTHETIC_USERS.find((u) => u.id === 't-01')!;
    const cancelledSession = SYNTHETIC_CLASS_SESSIONS.find((s) => s.id === 'sess-cancelled-01')!;

    const writeCheck = verifySessionAttendanceAccess(teacher1, cancelledSession, true);
    expect(writeCheck.authorized).toBe(false);
    expect(writeCheck.statusCode).toBe(422);
    expect(writeCheck.reason).toContain('Class session is cancelled');
  });

  it('rejects ordinary teacher attempting to perform administrator operations', async () => {
    const teacher1 = SYNTHETIC_USERS.find((u) => u.id === 't-01')!;
    const check = verifyAdminAccess(teacher1);

    expect(check.authorized).toBe(false);
    expect(check.statusCode).toBe(403);
    expect(check.reason).toContain('Administrator privileges required');
  });

  it('ignores client-injected actor_role or actorId in API payload (server-enforced identity)', async () => {
    // Request sent by teacher t-01 attempting to create batch by claiming actor_role: admin in body
    const req = new NextRequest('http://localhost:3000/api/portal/admin/batches', {
      method: 'POST',
      headers: {
        'x-lpc-actor-id': 't-01', // Authenticated identity is teacher
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        actor_role: 'admin',
        actorId: 'admin-01',
        courseId: 'c-01',
        branchId: 'br-dhaka',
        name: 'Hacked Batch',
        code: 'HACK-01',
        startDate: '2026-11-20',
        endDate: '2027-01-20',
        schedulePattern: 'Sun 10:00 AM',
      }),
    });

    const res = await postBatchHandler(req);
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toContain('Administrator privileges required');
  });

  it('enforces session number uniqueness within a batch cohort', () => {
    const duplicateAttempt = createAdminSession({
      batchId: 'batch-se-44',
      sessionNumber: 5, // Session 5 already exists in batch-se-44
      title: 'Conflicting Duplicate Session',
      room: 'Room 101',
      sessionDate: '2026-11-25',
      startTime: '10:00',
      endTime: '11:30',
      assignedTeacherId: 't-01',
    });

    expect(duplicateAttempt.success).toBe(false);
    expect(duplicateAttempt.error).toContain('already exists for batch');
  });

  it('throttles rapid repeated requests using in-memory rate limiter', () => {
    const key = 'test-client-ip';
    // Max 5 requests per 10 seconds
    for (let i = 0; i < 5; i++) {
      const res = checkRateLimit(key, 5, 10000);
      expect(res.allowed).toBe(true);
    }

    // 6th request must be rejected
    const blockedRes = checkRateLimit(key, 5, 10000);
    expect(blockedRes.allowed).toBe(false);
    expect(blockedRes.remaining).toBe(0);
    expect(blockedRes.resetAt).toBeGreaterThan(Date.now());
  });
});
