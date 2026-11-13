-- Language Proficiency Center (LPC), Bangladesh
-- Initial Database Migration: Profiles, Scopes, Academic Model, Session Attendance & Audit

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Profiles & Role Scopes
CREATE TYPE user_role AS ENUM ('teacher', 'coordinator', 'admin');
CREATE TYPE attendance_status AS ENUM ('unmarked', 'present', 'absent', 'late', 'excused');
CREATE TYPE batch_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE session_status AS ENUM ('scheduled', 'completed', 'cancelled');
CREATE TYPE sheet_status AS ENUM ('draft', 'submitted');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE role_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE(user_id, role, branch_id)
);

-- 2. Academic Courses, Batches, Students & Enrollments
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  target_audience TEXT,
  level TEXT NOT NULL,
  duration_weeks INTEGER NOT NULL,
  total_hours INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status batch_status NOT NULL DEFAULT 'scheduled',
  schedule_pattern TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  guardian_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE RESTRICT,
  enrolled_at DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'transferred', 'dropped')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE(student_id, batch_id)
);

CREATE TABLE teacher_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  effective_start DATE NOT NULL,
  effective_end DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE(teacher_id, batch_id)
);

-- 3. Class Sessions (Session-based, not just date-based)
CREATE TABLE class_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  batch_id UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  session_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  room TEXT,
  session_date DATE NOT NULL, -- Stored as calendar date in Asia/Dhaka
  start_time TIME NOT NULL,   -- Stored as local time in Asia/Dhaka
  end_time TIME NOT NULL,     -- Stored as local time in Asia/Dhaka
  timezone TEXT NOT NULL DEFAULT 'Asia/Dhaka',
  assigned_teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  status session_status NOT NULL DEFAULT 'scheduled',
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE(batch_id, session_number)
);

-- 4. Attendance Sheets & Records
CREATE TABLE attendance_sheets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL UNIQUE REFERENCES class_sessions(id) ON DELETE CASCADE,
  status sheet_status NOT NULL DEFAULT 'draft',
  version INTEGER NOT NULL DEFAULT 1,
  last_saved_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  submitted_at TIMESTAMPTZ,
  submitted_by UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sheet_id UUID NOT NULL REFERENCES attendance_sheets(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES class_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
  status attendance_status NOT NULL DEFAULT 'unmarked',
  note TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE(session_id, student_id)
);

-- 5. Immutable Audit Logs & Correction Requests
CREATE TABLE attendance_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES class_sessions(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES profiles(id),
  actor_role user_role NOT NULL,
  action TEXT NOT NULL,
  details JSONB NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE correction_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES class_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  previous_status attendance_status NOT NULL,
  requested_status attendance_status NOT NULL,
  reason TEXT NOT NULL,
  requested_by UUID NOT NULL REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 6. Indexes for High-Traffic Attendance Queries
CREATE INDEX idx_class_sessions_batch_date ON class_sessions(batch_id, session_date);
CREATE INDEX idx_class_sessions_teacher ON class_sessions(assigned_teacher_id);
CREATE INDEX idx_attendance_records_session ON attendance_records(session_id);
CREATE INDEX idx_enrollments_batch ON enrollments(batch_id);

-- 7. Row-Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE correction_requests ENABLE ROW LEVEL SECURITY;

-- Public can view courses and branches
CREATE POLICY "Public can view courses" ON courses FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can view branches" ON branches FOR SELECT TO anon, authenticated USING (true);

-- Authenticated teachers can only view sessions for their assigned batches
CREATE POLICY "Teachers can view assigned class sessions" ON class_sessions
  FOR SELECT TO authenticated
  USING (
    assigned_teacher_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM role_assignments ra
      WHERE ra.user_id = auth.uid() AND (ra.role = 'admin' OR ra.role = 'coordinator')
    )
  );

-- Teachers can view and mark attendance only for their assigned sessions
CREATE POLICY "Teachers can select attendance records for assigned sessions" ON attendance_records
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM class_sessions cs
      WHERE cs.id = attendance_records.session_id AND cs.assigned_teacher_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM role_assignments ra
      WHERE ra.user_id = auth.uid() AND (ra.role = 'admin' OR ra.role = 'coordinator')
    )
  );

CREATE POLICY "Teachers can update attendance records for unsubmitted drafts" ON attendance_records
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM class_sessions cs
      JOIN attendance_sheets ast ON ast.session_id = cs.id
      WHERE cs.id = attendance_records.session_id
        AND cs.assigned_teacher_id = auth.uid()
        AND ast.status = 'draft'
    )
  );

