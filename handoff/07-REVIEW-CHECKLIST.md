# Acceptance and cross-check checklist
Do not mark complete without evidence. Track PASS / FAIL / NOT TESTED plus evidence.

## Public website
- All original menu destinations are mapped and reachable; duplicate Teachers menu consolidated.
- Mobile menu, dropdowns, keyboard and focus states work.
- Course information supports choosing and enquiring; no fabricated facts.
- Schools, alumni and stories use supplied content or are tracked as unpublished gaps.
- No # placeholders, empty social links, decorative calendar or shop artifacts.
- Enquiries reach a real destination; failure and retry states verified.
- Official assets sourced correctly; generated images/sample identities disclosed.
- Responsive screenshots at mobile, tablet and desktop; no unintended overflow.
- Appropriate headings, labels, contrast, image alternatives and reduced motion.
- Metadata, sitemap and explicit legacy redirects tested.

## Attendance
- Teacher sees only assigned sessions; direct URL/API scope tests pass.
- Coordinator cannot cross branch boundaries.
- Ordinary users cannot assign themselves privileged roles.
- New records start unmarked; final submit blocks incomplete roster.
- Bulk present preserves existing marks unless explicitly confirmed.
- Draft survives reload after successful server save.
- Duplicate and concurrent submission cannot silently corrupt data.
- Two sessions for the same batch/date remain distinct.
- Cancelled session cannot receive attendance.
- Submitted sheet correction requires authorization, reason and immutable audit.
- Transfer and historical enrollments do not rewrite old attendance.
- Offline/error never falsely reports save success; unsaved edits warning works.
- Report counts and documented attendance formula agree.
- Exports are authorized and spreadsheet-formula-safe.

## Security and operations
- Production fails closed without backend configuration; demo cannot grant production access.
- No secrets in repo/browser/logs/screenshots.
- Database policy tests run without privileged bypass.
- Disabled users lose access; recovery/invitation flow documented and verified if configured.
- Backups, restore, migrations, rollback and deployment steps documented.
- Real student data import and live deployment remain owner-authorized actions.

## Evidence to bring back to Codex
Repository/path or code archive; PROJECT_STATUS.md; HANDOFF_REVIEW.md; exact startup commands; package/runtime versions; migrations and policies; synthetic test user setup; test commands/output; mobile/desktop screenshots; known gaps. Do not share passwords, service keys or private student records.

## Questions for a reviewer
Can a student choose a course quickly? Can a teacher take attendance on a phone? Is a wrong-user request rejected by the server/database? Can we trace and recover a mistaken correction? Do reports retain correct history? Is each claimed working feature actually tested?
