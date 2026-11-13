-- Language Proficiency Center (LPC), Bangladesh - Synthetic Seed Data
-- Note: Synthetic profiles and records prepared solely for local prototype and staging verification.
-- NEVER import real student records or live credentials into this seed script.

-- 1. Insert Branches
INSERT INTO branches (id, code, name, city, address, phone, email)
VALUES
  ('b1000000-0000-0000-0000-000000000001', 'DHK-01', 'Dhaka Main Campus (Dhanmondi)', 'Dhaka', 'House 42, Road 9/A, Dhanmondi R/A, Dhaka-1209', '+880 1711-000000', 'dhaka@lpcbd.org'),
  ('b1000000-0000-0000-0000-000000000002', 'CTG-01', 'Chattogram Center', 'Chattogram', 'Agrabad Commercial Area, Chattogram-4100', '+880 1819-000000', 'chattogram@lpcbd.org'),
  ('b1000000-0000-0000-0000-000000000003', 'RAJ-01', 'Rajshahi Branch', 'Rajshahi', 'Ghoramara, Boalia, Rajshahi-6100', '+880 1712-000000', 'rajshahi@lpcbd.org'),
  ('b1000000-0000-0000-0000-000000000004', 'CXB-01', 'Cox''s Bazar Center', 'Cox''s Bazar', 'Main Road, Jhawtala, Cox''s Bazar-4700', '+880 1811-000000', 'coxsbazar@lpcbd.org')
ON CONFLICT (code) DO NOTHING;

-- 2. Insert Courses
INSERT INTO courses (id, slug, title, category, target_audience, level, duration_weeks, total_hours)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'spoken-english', 'Comprehensive Spoken English & Fluency', 'Spoken English', 'Adult learners and job seekers', 'Elementary to Upper-Intermediate', 12, 48),
  ('c1000000-0000-0000-0000-000000000002', 'ielts-preparation', 'IELTS Academic & General Intensive', 'Test Preparation', 'Higher education candidates', 'Intermediate to Advanced', 10, 60),
  ('c1000000-0000-0000-0000-000000000003', 'english-for-professionals', 'Executive English & Business Communication', 'Professional Skills', 'Corporate executives and managers', 'Upper-Intermediate', 8, 32),
  ('c1000000-0000-0000-0000-000000000004', 'english-for-teens', 'English Communication for Young Learners & Teens', 'Young Learners', 'School students ages 11-16', 'Beginner to Intermediate', 12, 36)
ON CONFLICT (slug) DO NOTHING;

-- 3. Synthetic User Profiles (For Auth Staging)
-- In a real Supabase instance, IDs match auth.users(id)
INSERT INTO profiles (id, full_name, email, is_active)
VALUES
  ('u1000000-0000-0000-0000-000000000001', 'Dr. Anisur Rahman', 'anisur.rahman@lpcbd.demo', TRUE),
  ('u1000000-0000-0000-0000-000000000002', 'Shahana Parveen', 'shahana.parveen@lpcbd.demo', TRUE),
  ('u1000000-0000-0000-0000-000000000003', 'Mahmudul Hasan', 'mahmudul.hasan@lpcbd.demo', TRUE),
  ('u1000000-0000-0000-0000-000000000004', 'Nasrin Sultana', 'nasrin.sultana@lpcbd.demo', TRUE),
  ('u1000000-0000-0000-0000-000000000005', 'Tanveer Hossain', 'tanveer.hossain@lpcbd.demo', TRUE),
  ('u1000000-0000-0000-0000-000000000006', 'Farhan Ahmed', 'farhan.ahmed@lpcbd.demo', TRUE)
ON CONFLICT (email) DO NOTHING;

-- 4. Role Assignments & Branch Scopes
INSERT INTO role_assignments (user_id, role, branch_id)
VALUES
  ('u1000000-0000-0000-0000-000000000001', 'teacher', 'b1000000-0000-0000-0000-000000000001'), -- Dr. Anisur Rahman (Dhaka)
  ('u1000000-0000-0000-0000-000000000002', 'teacher', 'b1000000-0000-0000-0000-000000000001'), -- Shahana Parveen (Dhaka)
  ('u1000000-0000-0000-0000-000000000003', 'teacher', 'b1000000-0000-0000-0000-000000000002'), -- Mahmudul Hasan (Chattogram)
  ('u1000000-0000-0000-0000-000000000004', 'coordinator', 'b1000000-0000-0000-0000-000000000001'), -- Nasrin Sultana (Dhaka Coord)
  ('u1000000-0000-0000-0000-000000000005', 'coordinator', 'b1000000-0000-0000-0000-000000000002'), -- Tanveer Hossain (CTG Coord)
  ('u1000000-0000-0000-0000-000000000006', 'admin', NULL) -- Farhan Ahmed (Global Admin)
ON CONFLICT DO NOTHING;

-- 5. Batches
INSERT INTO batches (id, course_id, branch_id, code, name, start_date, end_date, status, schedule_pattern)
VALUES
  ('b2000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'SE-DHK-44', 'Spoken English — Batch 44 (Morning Dhanmondi)', '2026-11-01', '2027-01-25', 'in_progress', 'Sun, Tue, Thu 10:00 - 11:30 AM BST'),
  ('b2000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'IELTS-DHK-28', 'IELTS Intensive — Batch 28 (Weekend Evening)', '2026-11-05', '2027-01-15', 'in_progress', 'Fri, Sat 03:30 - 05:30 PM BST'),
  ('b2000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'SE-CTG-01', 'Spoken English — CTG Batch 01 (Agrabad)', '2026-11-01', '2027-01-25', 'in_progress', 'Sun, Tue, Thu 10:00 - 11:30 AM BST')
ON CONFLICT (code) DO NOTHING;

-- 6. Students
INSERT INTO students (id, student_code, full_name, email, phone, active)
VALUES
  ('s1000000-0000-0000-0000-000000000001', 'LPC-26-0101', 'Tanzila Akhter', 'tanzila.a@sample.lpcbd', '+880 1711-112233', TRUE),
  ('s1000000-0000-0000-0000-000000000002', 'LPC-26-0102', 'Abrar Hossain', 'abrar.h@sample.lpcbd', '+880 1711-223344', TRUE),
  ('s1000000-0000-0000-0000-000000000003', 'LPC-26-0103', 'Nusrat Jahan', 'nusrat.j@sample.lpcbd', '+880 1711-334455', TRUE),
  ('s1000000-0000-0000-0000-000000000004', 'LPC-26-0104', 'Kamrul Islam', 'kamrul.i@sample.lpcbd', '+880 1711-445566', TRUE),
  ('s1000000-0000-0000-0000-000000000005', 'LPC-26-0105', 'Fatima Tuz Zohra', 'fatima.z@sample.lpcbd', '+880 1711-556677', TRUE)
ON CONFLICT (student_code) DO NOTHING;

-- 7. Enrollments
INSERT INTO enrollments (student_id, batch_id, enrolled_at, status)
VALUES
  ('s1000000-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000001', '2026-10-25', 'active'),
  ('s1000000-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000001', '2026-10-25', 'active'),
  ('s1000000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000001', '2026-10-26', 'active'),
  ('s1000000-0000-0000-0000-000000000004', 'b2000000-0000-0000-0000-000000000001', '2026-10-26', 'active'),
  ('s1000000-0000-0000-0000-000000000005', 'b2000000-0000-0000-0000-000000000001', '2026-10-27', 'active')
ON CONFLICT (student_id, batch_id) DO NOTHING;

-- 8. Teacher Assignments
INSERT INTO teacher_assignments (teacher_id, batch_id, effective_start)
VALUES
  ('u1000000-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000001', '2026-11-01'),
  ('u1000000-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000002', '2026-11-05'),
  ('u1000000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000003', '2026-11-01')
ON CONFLICT (teacher_id, batch_id) DO NOTHING;

-- 9. Class Sessions (Demonstrating multi-session on same date)
INSERT INTO class_sessions (id, batch_id, session_number, title, room, session_date, start_time, end_time, timezone, assigned_teacher_id, status)
VALUES
  ('sess0000-0000-0000-0000-000000000005', 'b2000000-0000-0000-0000-000000000001', 5, 'Dialogue Practice: Inquiries & Clarification', 'Room 302', CURRENT_DATE, '10:00:00', '11:30:00', 'Asia/Dhaka', 'u1000000-0000-0000-0000-000000000001', 'scheduled'),
  ('sess0000-0000-0000-0000-000000000006', 'b2000000-0000-0000-0000-000000000001', 6, 'Laboratory Listening Drill & Accent Practice (Extra Session)', 'Room 304', CURRENT_DATE, '12:00:00', '13:30:00', 'Asia/Dhaka', 'u1000000-0000-0000-0000-000000000001', 'scheduled')
ON CONFLICT (batch_id, session_number) DO NOTHING;
