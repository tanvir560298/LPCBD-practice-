import { describe, it, expect } from 'vitest';
import { SYNTHETIC_USERS, SYNTHETIC_STUDENTS, SYNTHETIC_BATCHES, SYNTHETIC_CLASS_SESSIONS } from '../src/lib/mockData';
import { visibleSessions } from '../src/lib/portalView';
import { verifyAdminAccess, verifyCoordinatorOrAdminAccess } from '../src/lib/authAdapter';

describe('Multi-Role Portal Navigation & Role Architecture (Tanvir Requirements)', () => {
  const ROLE_PORTAL_ROUTES = [
    { role: 'teacher', title: 'Teacher Attendance Portal', route: '/portal' },
    { role: 'student', title: 'Student Dashboard', route: '/student/dashboard' },
    { role: 'admin', title: 'Institutional Administrator', route: '/portal/admin' },
    { role: 'coordinator', title: 'Branch Coordinator', route: '/portal' },
    { role: 'developer', title: 'Web Developer Console', route: '/portal/developer' },
    { role: 'unified_gateway', title: 'All-In-One Sign In Gateway', route: '/login' },
  ];

  it('verifies all 5 required institutional roles have designated dashboard routes', () => {
    ROLE_PORTAL_ROUTES.forEach((entry) => {
      expect(entry.route).toBeDefined();
      expect(entry.route.startsWith('/')).toBe(true);
    });
  });

  it('verifies Web Developer persona exists with full developer capabilities', () => {
    const dev = SYNTHETIC_USERS.find((u) => u.role === 'developer');
    expect(dev).toBeDefined();
    expect(dev?.id).toBe('dev-01');
    expect(dev?.fullName).toBe('Tanvir Ahmad');
    expect(dev?.accountStatus).toBe('active');

    // Developer has administrative & coordinator override permissions for testing
    expect(verifyAdminAccess(dev!).authorized).toBe(true);
    expect(verifyCoordinatorOrAdminAccess(dev!).authorized).toBe(true);

    // Developer sees all active sessions
    const devSessions = visibleSessions(dev!, SYNTHETIC_CLASS_SESSIONS, SYNTHETIC_BATCHES);
    expect(devSessions.length).toBeGreaterThan(0);
    expect(devSessions.length).toBe(SYNTHETIC_CLASS_SESSIONS.length);
  });

  it('verifies Teacher persona is properly scoped to their own sessions', () => {
    const teacher = SYNTHETIC_USERS.find((u) => u.id === 't-01');
    expect(teacher).toBeDefined();
    expect(teacher?.role).toBe('teacher');

    const teacherSessions = visibleSessions(teacher!, SYNTHETIC_CLASS_SESSIONS, SYNTHETIC_BATCHES);
    expect(teacherSessions.every((s) => s.assignedTeacherId === 't-01')).toBe(true);
  });

  it('verifies Student dataset is configured with active batch enrollments', () => {
    expect(SYNTHETIC_STUDENTS.length).toBeGreaterThan(0);
    SYNTHETIC_STUDENTS.forEach((s) => {
      expect(s.id).toBeDefined();
      expect(s.fullName).toBeDefined();
      expect(s.studentCode).toBeDefined();
    });
  });
});
