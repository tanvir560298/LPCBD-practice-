# Project Status: Language Proficiency Center (LPC), Bangladesh

*Last Updated: 13 November 2026 (Phase 1, 2 & Functional Attendance Spec Active)*

## 1. Implementation Summary
- **Phase 1 (Design Prototype)**, **Phase 2 (Content & Workflows)**, and **Phase 4 (Functional Attendance Specification - `04-ATTENDANCE-SPEC.md`)** are fully implemented and verified.
- Dedicated Server Attendance Engine ([src/lib/attendanceStore.ts](file:///Users/tanvir/Desktop/open%20folder/src/lib/attendanceStore.ts)) with optimistic concurrency revision tracking (`version`), atomic submit lock, and immutable audit logging.
- Complete API route handlers ([/api/portal/sessions/[id]/attendance](file:///Users/tanvir/Desktop/open%20folder/src/app/api/portal/sessions/[id]/attendance/route.ts)) for GET (sheet + roster), POST (draft save with 409 conflict detection), PUT (final submission with 422 unmarked block), and PATCH (authorized correction request).
- Compliance and reporting enhancements: Missing Attendance Sessions monitor, per-student history timeline, and administrative CSV student roster validation preview ([/portal/admin/import](file:///Users/tanvir/Desktop/open%20folder/src/app/portal/admin/import/page.tsx)).

## 2. Route & Architecture Directory
All 17 original navigation destinations plus portal workflows are live:
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
- `/portal`: Dedicated Faculty Attendance Dashboard (Today's Scheduled Sessions in Asia/Dhaka time).
- `/portal/batches`: Assigned Batches overview.
- `/portal/batches/[id]`: Detailed cohort schedule, session timeline, and enrolled roster.
- `/portal/sessions/[id]/attendance`: Interactive Attendance Workstation (Unmarked default, 5-status toggles, bulk present protection, save draft, submit lock, and correction request).
- `/portal/reports`: Scoped Attendance Reports with raw counts, provisional percentage, missing attendance monitor, and formula-safe CSV export.
- `/portal/admin/import`: Administrative CSV student roster preview and row-level error validation.
- `/portal/login`: Faculty Demo Login.

## 3. Automated Tests & Quality Evidence
- **Vitest Suite (24 tests across 5 files):**
  - `tests/attendance-concurrency.test.ts` (7 tests): Unmarked initialization, draft version increment, 409 conflict detection, 422 unmarked submission block, atomic sheet lock, immutable audit logging, and correction request flow.
  - `tests/attendance.test.ts` (8 tests): Dhaka time, multi-session keying, bulk overwrite protection, CSV formula sanitization.
  - `tests/enquiry.test.ts` (4 tests): Validation rejection, email formatting, tracking code generation, admin read.
  - `tests/redirects.test.ts` (3 tests): 301 legacy redirects, no blanket redirect to home.
  - `tests/navigation.test.ts` (2 tests): All 17 destinations mapped, duplicate menu consolidated.
- **TypeScript Typecheck (`npm run typecheck`):** 0 errors.
- **Production Build (`npm run build`):** 26/26 routes compiled and validated.
- **Local Server (`http://localhost:3000`):** Active and running.
