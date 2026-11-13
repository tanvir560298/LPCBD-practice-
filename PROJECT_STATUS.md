# Project Status: Language Proficiency Center (LPC), Bangladesh

*Last Updated: 13 November 2026 (Phases 1 through 6 Complete & Visual Refinements Verified)*

## 1. Implementation Summary
- **Visual Design Refinements (Secondary Reference: `rahmahinternationalschool.com` Adaptation)**:
  - **Standalone Solid White Navbar**: Completely detached, clean solid white background (`bg-white border-b border-slate-200/90 shadow-xs`), paired with an institutional contact pre-header (`bg-slate-950 text-slate-300`).
  - **Clear Separation Between Navigation and Hero**: Clean canvas background (`bg-gradient-to-b from-slate-50/90 via-white to-slate-50/40`) establishing generous breathing room and avoiding hero bleeding into header.
  - **Balanced Text and Authentic Educational Visuals**: 55/45 split between academic program messaging/CTAs and an authentic classroom vector showcase (`public/assets/images/hero-classroom.svg`) with CEFR-aligned and cohort credentials.
  - **Consistent Alignment and Section Rhythm**: Standardized `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` horizontal bounds and consistent `py-16 sm:py-24` vertical rhythm across all public sections.
  - **Distinct, Informative Course Cards**: Redesigned course cards on homepage and `/courses` with category color pills, SVG thumbnail artwork (`course-spoken-english.svg`, `course-ielts.svg`, `course-business.svg`, `course-teens.svg`), level badge, duration, hours, branch availability tags, syllabus overview link, and admission enquiry trigger.
  - **Academic Discipline**: Strictly avoided preschool typography, rainbow palettes, floating decorative cartoon shapes, and single-page navigation. Maintained LPC academic navy (`#0f172a`), warm gold (`#f59e0b`), and clean white surfaces.
- **Role/Scope Security Engine & Fail-Closed Boundary** ([src/lib/authAdapter.ts](file:///Users/tanvir/Desktop/open%20folder/src/lib/authAdapter.ts)):
  - Strictly distinguishes Teacher (assigned sessions), Branch Coordinator (assigned branch), and Institutional Administrator (global).
  - Production mode (`NEXT_PUBLIC_DEMO_MODE=false`) strictly fails closed (503/401) without verified Supabase backend credentials.
  - Server-enforced identity ignores client-injected `actor_role` or `actorId` in JSON payloads.
  - Cancelled sessions block attendance submissions with HTTP 422 Unprocessable Entity.
  - Deactivated accounts lose access immediately.
- **Academic Administration Workstation** ([src/app/portal/admin/page.tsx](file:///Users/tanvir/Desktop/open%20folder/src/app/portal/admin/page.tsx)):
  - Cohort batch creation with schedule pattern, branch mapping, and uniqueness checks.
  - Session timetabling in `Asia/Dhaka` with teacher assignment and cancellation reasons.
  - Student enrollment management and direct link to batch CSV roster import.
- **Dedicated Attendance & Concurrency Engine** ([src/lib/attendanceStore.ts](file:///Users/tanvir/Desktop/open%20folder/src/lib/attendanceStore.ts)):
  - Keyed by unique `session_id` (supporting multiple sessions per batch on one calendar date).
  - Unmarked default initialization, 5 distinct statuses, optimistic concurrency (409 Conflict), atomic submit lock, and immutable audit logs.
- **Public Website & Content Architecture**:
  - All 17 legacy menu destinations preserved and accessible through responsive, touch-friendly dropdown groupings.
  - Real `/api/enquiry` admission intake endpoint with input validation, tracking reference codes (`ENQ-XXXXXX`), and in-memory rate limiting.
  - SEO XML Sitemap (`/sitemap.xml`) and search bot directives (`/robots.txt` disallowing `/portal/` and `/api/`).
  - Tested 301/308 legacy URL redirects in `next.config.js`.

---

## 2. Complete Route & Architecture Directory
All 17 original navigation destinations plus administrative and portal workflows:
- `/`: Public Homepage with Split Hero, Audience Filtering, Pedagogy, Access Spotlight, Stories, Branches, and FAQ.
- `/about`: Institutional Overview, Mission, and Pillars.
- `/about/leadership`: Board of Directors & Governance overview.
- `/teachers`: Consolidated Faculty & Language Trainers directory.
- `/courses`: Filterable Course Catalog (Categories, Branches, Level).
- `/courses/[slug]`: Course Detail page with weekly syllabus, prerequisites, schedule, branch availability, fee disclaimer, and enquiry trigger.
- `/programs/access`: English Access Microscholarship Program.
- `/schools`: LPC Laboratory Schools Overview.
- `/schools/dhaka`: Dhaka Laboratory School & College.
- `/schools/rajshahi`: Rajshahi Laboratory School & College.
- `/community/stories`: Student Success Stories & Reflections.
- `/community/alumni`: Alumni Network & Mentorship.
- `/blog`: ELT Pedagogical Insights & Articles.
- `/branches`: Campus Locations (Dhaka, Chattogram, Rajshahi, Cox's Bazar).
- `/contact`: Admissions Contact Form integrated with `/api/enquiry`.
- `/newsletter`: Auxiliary newsletter subscription.
- `/sitemap.xml`: Dynamic XML sitemap listing public pages and active course URLs.
- `/robots.txt`: Search crawler directives allowing public pages and explicitly disallowing `/portal/` and `/api/`.
- `/api/enquiry`: Live POST handler with input validation, error mapping, and reference generation.
- `/api/portal/sessions/[id]/attendance`: Attendance endpoint supporting draft saves, atomic submission locks, optimistic concurrency checks, and correction requests.
- `/api/portal/admin/batches`: Administrative batch listing and creation endpoint.
- `/api/portal/admin/sessions`: Administrative session scheduling and cancellation endpoint.
- `/api/portal/admin/enrollments`: Student cohort enrollment endpoint.
- `/portal`: Dedicated Faculty Attendance Dashboard (Today's Scheduled Sessions in Asia/Dhaka time).
- `/portal/batches`: Assigned Batches overview.
- `/portal/batches/[id]`: Detailed cohort schedule, session timeline, and enrolled roster.
- `/portal/sessions/[id]/attendance`: Interactive Attendance Workstation (Unmarked default, 5-status toggles, bulk present protection, save draft, submit lock, and correction request).
- `/portal/reports`: Scoped Attendance Reports with raw counts, provisional percentage, missing attendance monitor, and formula-safe CSV export.
- `/portal/admin`: Full Administrative Console for Batches, Sessions, Assignments, and Enrollments.
- `/portal/admin/import`: Administrative CSV student roster preview and row-level error validation.
- `/portal/login`: Faculty & Staff Demo Login with role switcher.

---

## 3. Automated Tests & Quality Evidence
- **Vitest Suite (36 tests across 6 files — 100% Passing):**
  - `tests/security-policies.test.ts` (12 tests): Fail-closed production mode, teacher cross-branch isolation, coordinator campus isolation, privilege escalation defense, deactivated account lockout, cancelled session write lock, session number uniqueness, sliding-window rate limiting.
  - `tests/attendance-concurrency.test.ts` (7 tests): Unmarked initialization, draft version increment, 409 conflict detection, 422 unmarked submission block, atomic sheet lock, immutable audit logging, and correction request flow.
  - `tests/attendance.test.ts` (8 tests): Dhaka time, multi-session keying, bulk overwrite protection, CSV formula sanitization.
  - `tests/enquiry.test.ts` (4 tests): Validation rejection, email formatting, tracking code generation, admin read.
  - `tests/redirects.test.ts` (3 tests): 301 legacy redirects, no blanket redirect to home.
  - `tests/navigation.test.ts` (2 tests): All 17 destinations mapped, duplicate menu consolidated.
- **TypeScript Typecheck (`npm run typecheck`):** 0 errors.
- **Production Build (`npm run build`):** 30 / 30 routes compiled and validated.
- **Local Server (`http://localhost:3000`):** Active daemon process.
- **Visual Evidence & Screenshots:**
  - Desktop Refined Homepage (1280px): [docs/screenshots/refined-homepage-desktop.png](file:///Users/tanvir/Desktop/open%20folder/docs/screenshots/refined-homepage-desktop.png)
  - Mobile Refined Homepage (390px): [docs/screenshots/refined-homepage-mobile.png](file:///Users/tanvir/Desktop/open%20folder/docs/screenshots/refined-homepage-mobile.png)
  - Tablet Refined Homepage (768px): [docs/screenshots/refined-homepage-tablet.png](file:///Users/tanvir/Desktop/open%20folder/docs/screenshots/refined-homepage-tablet.png)
  - Desktop Refined Course Catalog (1280px): [docs/screenshots/refined-courses-desktop.png](file:///Users/tanvir/Desktop/open%20folder/docs/screenshots/refined-courses-desktop.png)
  - Attendance Workstation: [docs/screenshots/attendance-workstation-desktop.png](file:///Users/tanvir/Desktop/open%20folder/docs/screenshots/attendance-workstation-desktop.png)

---

## 4. Documentation & Operational Runbooks
- [HANDOFF_REVIEW.md](file:///Users/tanvir/Desktop/open%20folder/HANDOFF_REVIEW.md): Formal handoff dossier prepared for Codex review.
- [docs/CONTENT_VERIFICATION_REGISTER.md](file:///Users/tanvir/Desktop/open%20folder/docs/CONTENT_VERIFICATION_REGISTER.md): Source and owner content verification tracking table (16 verified items & owner action register).
- [docs/DATABASE_OPERATIONS.md](file:///Users/tanvir/Desktop/open%20folder/docs/DATABASE_OPERATIONS.md): PostgreSQL schema, RLS policies, backup and restore commands, and rollback strategy.
- [supabase/migrations/20261113000000_init_lpc_attendance.sql](file:///Users/tanvir/Desktop/open%20folder/supabase/migrations/20261113000000_init_lpc_attendance.sql): SQL migration file.
- [supabase/seed.sql](file:///Users/tanvir/Desktop/open%20folder/supabase/seed.sql): Synthetic seed data.
- [.env.example](file:///Users/tanvir/Desktop/open%20folder/.env.example): Environment variable template and security documentation.
