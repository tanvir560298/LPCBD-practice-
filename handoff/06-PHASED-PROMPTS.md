# Paste one phase at a time after the master prompt

## Phase 1 — Design prototype
Read the handoff and inspect the repo. Implement a polished responsive public homepage, course listing/detail and teacher attendance screen with clearly synthetic sample data. Keep public and portal screens separate, linked by Teacher Portal. Preserve all original navbar destinations through the agreed grouping. Design route shells for all destinations without publishing empty placeholder pages as complete. Build consistent components and meaningful loading/error/empty states. No production claims. Show desktop and mobile screenshots. Run build/typecheck/lint if configured. Record decisions and what's mocked in PROJECT_STATUS.md. Pause for design feedback before large backend implementation.

## Phase 2 — Public content and journeys
Continue from PROJECT_STATUS.md. Complete public routes, course discovery, real enquiry workflow in the configured environment, branches and accessible navigation. Use verified supplied content; mark unknown data for owner input instead of inventing it. Prepare legacy route inventory and tested redirects, metadata and sitemap. Remove shop/cart/product terminology. Test actual enquiry failure and success paths. Deliver content gaps register, screenshots, test results and updated status.

## Phase 3 — Auth, database and permissions
Continue from status. Implement maintained auth, role/scope model, database migrations, secure policies and synthetic seed per specs. Add admin management for batches, enrollments, assignments and sessions. Provide .env.example and setup docs. Test ordinary teacher, branch coordinator and admin identities, including direct API attacks against other batches/branches. Ensure demo and production auth cannot mix. Report verified permissions and unresolved configuration clearly. Update status.

## Phase 4 — Attendance end to end
Implement session roster eligibility, unmarked defaults, individual and bulk controls, server drafts, review/submit, uniqueness, transactional writes, concurrency and audit. Add correction request and authorized correction flow, cancelled class handling and network retry behavior. Test refresh after saved draft, duplicate submit, two-tab conflict and access removal. Show mobile teacher flow and report evidence. Update status.

## Phase 5 — Reports and administration
Implement scoped batch/session/student reports, missing-submission report and safe export. Implement validated CSV import preview and duplicate handling. Confirm attendance formula and marking policy with owner before labeling reports official. Test transfer/history, late/excused, cancelled/future sessions and cross-branch exports. Update status and list any remaining MVP gaps.

## Phase 6 — Review and release preparation
Audit against 07-REVIEW-CHECKLIST.md. Run appropriate automated tests and mobile/keyboard/manual checks. Review live content and assets, remove accidental demo data from production configuration, check secret handling, backups and migration/rollback docs. Provide a concrete staging-ready result with exact commands and evidence. Do not deploy or replace the existing site without explicit authorization. Produce HANDOFF_REVIEW.md for Codex with changed routes/files, screenshots, test output, known issues, policy decisions and setup instructions.

## Fix prompt — use after a Codex review
Read HANDOFF_REVIEW.md and the supplied review findings. Reproduce each actionable finding, fix root causes, add meaningful regression coverage where appropriate, and avoid unrelated redesigns. Re-run affected checks and update PROJECT_STATUS.md. State which findings were resolved, which could not be reproduced, and provide evidence. Never mark a finding fixed solely because code changed.
