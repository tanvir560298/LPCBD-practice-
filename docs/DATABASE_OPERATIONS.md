# LPC Attendance Database Operations & Security Runbook

*Target System:* Language Proficiency Center (LPC), Bangladesh  
*Database Engine:* PostgreSQL 15+ (Hosted via Supabase or Self-Hosted Managed Instance)  
*Date Prepared:* 13 November 2026

---

## 1. Schema & Migration Architecture

All database schema definitions are version-controlled in `supabase/migrations/`:
- `20261113000000_init_lpc_attendance.sql`: Primary schema containing user profiles, role assignments, academic courses, batches, students, enrollments, teacher assignments, class sessions, attendance sheets, attendance records, audit logs, and Row-Level Security (RLS) policies.

### Core Relational Model
1. **Profiles & Role Scopes:**
   - `profiles`: Keyed to `auth.users(id)` with email, full name, and active status.
   - `role_assignments`: Maps user to `teacher`, `coordinator`, or `admin`, scoped by `branch_id`.
2. **Academic Structure:**
   - `branches`: 4 regional centers (Dhanmondi Dhaka, Agrabad CTG, Rajshahi, Cox's Bazar).
   - `courses`: CEFR-aligned curriculum details.
   - `batches`: Cohorts with schedule pattern, branch foreign key, start/end date.
   - `students`: Private roster. Unique `student_code`. Active status flag.
   - `enrollments`: Effective student membership in a batch. Historical tracking.
   - `teacher_assignments`: Effective teacher allocation to a batch.
3. **Session-Based Attendance:**
   - `class_sessions`: Unique session identity (`id`), timetable start/end in `Asia/Dhaka`, assigned teacher, status (`scheduled`, `completed`, `cancelled`).
   - `attendance_sheets`: Unique per session. Optimistic concurrency `version` integer, `draft` / `submitted` status, submit lock timestamp.
   - `attendance_records`: 5 statuses (`unmarked`, `present`, `absent`, `late`, `excused`).
   - `attendance_audit`: Append-only immutable log recording actor, timestamp (UTC ISO), operation, and detail payload.

---

## 2. Row-Level Security (RLS) Verification

RLS is strictly enforced on all tables. Ordinary authenticated connections cannot bypass these policies:

| Role | Class Sessions Access | Attendance Marking Access | Reports Access |
|---|---|---|---|
| **Teacher** | Assigned sessions only (`assigned_teacher_id = auth.uid()`) | Unsubmitted drafts only for assigned sessions | Scoped to assigned batches |
| **Branch Coordinator** | Sessions belonging to batches in their authorized `branch_id` | Read-only + correction request review | Scoped to authorized campus branch |
| **Institutional Admin** | Global access across all branches | Full administrative override & audit review | Global cross-campus reporting |

---

## 3. Backup Procedure

### Automated Staging / Production Backup Command
Run daily automated logical dump via `pg_dump` with transaction consistency:

```bash
# Set secure environment credentials (from managed secrets vault, NEVER check into git)
export PGPASSWORD="<DB_USER_PASSWORD>"

# Run compressed custom-format pg_dump
pg_dump \
  --host="<DB_HOST>" \
  --port=5432 \
  --username="<DB_USER>" \
  --dbname="<DB_NAME>" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file="/var/backups/lpc_attendance_$(date +%Y%m%d_%H%M%S).dump"

unset PGPASSWORD
```

---

## 4. Disaster Recovery & Restoration Verification

Before making production claims, restoration was verified in a safe local sandbox environment:

```bash
# 1. Create a pristine verification database
createdb -U postgres lpc_restore_test

# 2. Restore from custom-format backup dump
pg_restore \
  -U postgres \
  --dbname=lpc_restore_test \
  --clean \
  --if-exists \
  --exit-on-error \
  /var/backups/lpc_attendance_20261113.dump

# 3. Verify integrity of audit logs and attendance records
psql -U postgres -d lpc_restore_test -c "
  SELECT count(*) AS total_sessions FROM class_sessions;
  SELECT count(*) AS total_records FROM attendance_records;
  SELECT count(*) AS total_audit_entries FROM attendance_audit;
"

# 4. Clean up test database
dropdb -U postgres lpc_restore_test
```

---

## 5. Migration Rollback Strategy

If a migration encounters an issue during a release window:
1. All migrations are wrapped in transactional blocks (`BEGIN ... COMMIT;`).
2. Schema revisions must include downward rollback steps:
   - For `20261113000000_init_lpc_attendance.sql`, rollback consists of dropping tables in reverse foreign-key order:
     ```sql
     BEGIN;
     DROP TABLE IF EXISTS correction_requests CASCADE;
     DROP TABLE IF EXISTS attendance_audit CASCADE;
     DROP TABLE IF EXISTS attendance_records CASCADE;
     DROP TABLE IF EXISTS attendance_sheets CASCADE;
     DROP TABLE IF EXISTS class_sessions CASCADE;
     DROP TABLE IF EXISTS teacher_assignments CASCADE;
     DROP TABLE IF EXISTS enrollments CASCADE;
     DROP TABLE IF EXISTS students CASCADE;
     DROP TABLE IF EXISTS batches CASCADE;
     DROP TABLE IF EXISTS courses CASCADE;
     DROP TABLE IF EXISTS role_assignments CASCADE;
     DROP TABLE IF EXISTS branches CASCADE;
     DROP TABLE IF EXISTS profiles CASCADE;
     DROP TYPE IF EXISTS sheet_status, session_status, batch_status, attendance_status, user_role CASCADE;
     COMMIT;
     ```

---

## 6. Staging & Production Release Boundary Check

Prior to any DNS cutover or live data import:
- [ ] LPC Owner has verified and confirmed hosting provider and region.
- [ ] Real student records have NOT been imported into public or demo environments.
- [ ] `NEXT_PUBLIC_DEMO_MODE` is explicitly set to `false` in production.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is kept exclusively on the server runtime and not exposed in client bundles.
- [ ] SSL/TLS certificate is active with HSTS enabled.
