# Attendance — functional specification

## Roles
Teacher: view assigned batches/sessions and eligible students; draft and submit attendance only for assigned sessions. Assignment dates matter. No access to unrelated students via direct URLs or API calls.
Coordinator: scoped to authorized branches; view reports and handle corrections within that scope.
Admin: manage branches, teacher invitations, students, courses, batches, enrollments, assignments and sessions. Admin role assignment must be a trusted operation, never a signup form choice.

## Core model (adapt to stack)
- profiles: auth user id, display name, account status.
- role_assignments / branch_scopes: role and authorized scope; secure from self-editing.
- branches; courses; batches (branch, course, name, start/end, status).
- students: internal id, unique student code, name, active state. Do not require student auth accounts.
- enrollments: student, batch, effective start/end, status. Preserve history.
- teacher_assignments: teacher, batch, effective start/end.
- class_sessions: unique id, batch, start/end time, timezone, scheduled/completed/cancelled state; substitute teacher authorization if used.
- attendance_sheets: session id unique, draft/submitted state, revision/version, submitted_by/at.
- attendance_records: sheet/session, student, status, optional bounded note; unique(session, student).
- attendance_audit: actor, timestamp, old/new values, reason, session, operation. Server-generated and not editable by teachers.

Never key attendance solely by batch plus calendar date. Two sessions on one date are valid. Session creation needs duplicate safeguards appropriate to the actual schedule. Freeze/retain the eligible roster on submission or use enrollment history so later transfers do not rewrite old reports.

## Marking workflow
1. Authenticated teacher selects an authorized scheduled session.
2. Load eligible enrolled students for that session, existing marks and version.
3. New students start UNMARKED. Show counts, roster search and unmarked filter.
4. Individual controls: present, absent, late, excused; unmarked for incomplete draft.
5. Mark all present affects unmarked rows by default. Require explicit confirmation to replace already marked rows.
6. Save draft persists on server and reports time saved. Explicit draft save required; optional autosave only if reliable and clearly signalled.
7. Review summary before submission. Block final submission while unmarked students remain, with a clear way to find them.
8. Submit atomically validates roster, assignment, session state and version; writes records and audit.
9. After submission show read-only state and correction route. MVP: coordinator/admin correction with mandatory reason; teacher may request a correction. Do not silently reopen submitted sheets.

## Integrity and concurrency
Server validations, database uniqueness and transactions prevent duplicate submission. Use revision/optimistic concurrency; two tabs or users cannot silently overwrite each other's marks. Retry safely with idempotency where appropriate. Return an actionable conflict message. Teacher access changes must take effect server-side.
Do not allow attendance for cancelled sessions. Future marking and retrospective windows need policy; safe demo default is today's session only, with scoped staff override and audit. Flag this as provisional for owner confirmation.

## Network behavior
A failed request must never appear as saved. MVP requires online server save; display offline state, preserve current in-memory edits and allow retry. Warn before navigation when dirty. Do not claim robust offline support. If local draft recovery is implemented, minimize private data, scope per user and session, expire it, clear on logout and address shared-device risks.

## Reports
Session roster, batch/date summaries, per-student period report and missing-attendance sessions. All use the same scope enforcement as marking. Export authorized results only. Defend CSV exports against spreadsheet formula injection.
Show raw present/absent/late/excused counts. Attendance percentage policy is NOT finalized: decide excused denominator, late weight and which completed sessions count. MVP may show a clearly labelled provisional formula only if documented; no invented institutional threshold. Do not count cancelled, future or merely unmarked classes as absences. Historic student transfers must not distort reports.

## Administrative workflows
Synthetic seed; validated CSV student preview/import with row errors and duplicate handling; enrollment, batch assignment, teacher assignment; session creation/cancellation/rescheduling; account disablement; secure password recovery through auth provider. Preserve historical records instead of destructive deletion.

## Decisions needing LPC
Active branches; users and class volumes; existing IDs/data; correction authority; late/excused rules; marking window; substitute teachers; retention; export access; account invitation process. Build to allow these decisions without assuming facts.
