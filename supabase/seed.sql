-- Language Proficiency Center (LPC), Bangladesh - Synthetic Seed Data
-- Note: Synthetic profiles and records prepared solely for local prototype and staging verification.

-- Insert Branches
INSERT INTO branches (id, code, name, city, address, phone, email)
VALUES
  ('b1000000-0000-0000-0000-000000000001', 'DHK-01', 'Dhaka Main Campus', 'Dhaka', 'House 42, Road 9/A, Dhanmondi R/A, Dhaka-1209', '+880 1711-000000', 'dhaka@lpcbd.org'),
  ('b1000000-0000-0000-0000-000000000002', 'CTG-01', 'Chattogram Center', 'Chattogram', 'Agrabad Commercial Area, Chattogram-4100', '+880 1819-000000', 'chattogram@lpcbd.org'),
  ('b1000000-0000-0000-0000-000000000003', 'RAJ-01', 'Rajshahi Branch', 'Rajshahi', 'Ghoramara, Boalia, Rajshahi-6100', '+880 1712-000000', 'rajshahi@lpcbd.org'),
  ('b1000000-0000-0000-0000-000000000004', 'CXB-01', 'Cox''s Bazar Center', 'Cox''s Bazar', 'Main Road, Jhawtala, Cox''s Bazar-4700', '+880 1811-000000', 'coxsbazar@lpcbd.org')
ON CONFLICT DO NOTHING;

-- Insert Courses
INSERT INTO courses (id, slug, title, category, target_audience, level, duration_weeks, total_hours)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'spoken-english', 'Comprehensive Spoken English & Fluency', 'Spoken English', 'Adult learners and job seekers', 'Elementary to Upper-Intermediate', 12, 48),
  ('c1000000-0000-0000-0000-000000000002', 'ielts-preparation', 'IELTS Academic & General Intensive', 'Test Preparation', 'Higher education candidates', 'Intermediate to Advanced', 10, 60),
  ('c1000000-0000-0000-0000-000000000003', 'english-for-professionals', 'Executive English & Business Communication', 'Professional Skills', 'Corporate executives and managers', 'Upper-Intermediate', 8, 32),
  ('c1000000-0000-0000-0000-000000000004', 'english-for-teens', 'English Communication for Young Learners & Teens', 'Young Learners', 'School students ages 11-16', 'Beginner to Intermediate', 12, 36)
ON CONFLICT DO NOTHING;

