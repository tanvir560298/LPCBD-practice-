# Project Status: Language Proficiency Center (LPC), Bangladesh

*Last Updated: 13 November 2026 (Phase 1 Completed)*

## 1. Implementation Summary
- **Phase 1: Design Prototype** has been fully implemented, built, verified, and screen-captured.
- Greenfield Next.js 14 App Router project created with TypeScript, Tailwind CSS, Lucide icons, Vitest, and headless Chrome verification.
- Public site and Teacher Attendance Portal are completely decoupled into distinct full-screen environments, linked by the header Teacher Portal action.

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
- `/contact`: Admissions Contact Form with server validation.
- `/newsletter`: Auxiliary newsletter subscription.
- `/portal`: Dedicated Faculty Attendance Dashboard (Today's Scheduled Sessions in Asia/Dhaka time).
- `/portal/sessions/[id]/attendance`: Interactive Attendance Workstation (Unmarked default, 5-status toggles, bulk present protection, save draft, submit lock, and correction request).
- `/portal/batches`: Assigned Batches overview.
- `/portal/reports`: Scoped Attendance Reports with raw counts, provisional percentage, and formula-safe CSV export.
- `/portal/login`: Faculty Demo Login.

## 3. Decisions & Domain Conventions
1. **Timezone:** Standardized on `Asia/Dhaka` (BST / UTC+6) for all session schedules, display clocks, and attendance dates. Timestamps persist as UTC ISO strings.
2. **Session Keying:** Attendance is keyed strictly by unique class session (`class_sessions.id`), NOT just `(batch, date)`. This allows a batch to have multiple classes on the same date (demonstrated with Batch 44 having Sessions #5 and #6 today).
3. **Attendance Statuses:** Strictly follows five states: `unmarked` (default), `present`, `absent`, `late`, `excused`. No automatic default absence.
4. **Draft vs Submit:** Unsaved edits trigger browser unload warning; final submission is blocked if any unmarked students remain. Submitted sheets lock against further direct edits.
5. **Brand Wordmark:** Uses an academic typographic crest badge with provisional disclaimer; official vector logo remains pending owner verification.

## 4. Assumptions Tracked (Needing Owner Confirmation)
- Exact tuition fees, concession rates, and bank payment channels (disclaimed on course pages).
- Official high-resolution vector logo and brand color standards.
- Production hosting target and live Supabase / PostgreSQL database credentials.
- Formal roster of Board Trustees and teacher profiles with media consent.
- Official institutional attendance formula (currently using documented provisional formula: `(Present + Late*0.5) / (Completed - Excused)`).

## 5. Automated Tests & Quality Evidence
- **Vitest Suite (`tests/attendance.test.ts`, `tests/navigation.test.ts`):** 10 tests passing (100% pass rate).
- **TypeScript Typecheck (`npm run typecheck`):** 0 errors.
- **Production Build (`npm run build`):** 22/22 static pages generated successfully.
- **Responsive Screenshots (`docs/screenshots/`):**
  - `homepage-desktop.png` (1280x900)
  - `homepage-mobile.png` (390x844)
  - `courses-desktop.png` (1280x900)
  - `course-detail-desktop.png` (1280x900)
  - `course-detail-mobile.png` (390x844)
  - `portal-dashboard-desktop.png` (1280x900)
  - `attendance-workstation-desktop.png` (1280x900)
  - `attendance-workstation-mobile.png` (390x844)

## 6. Next Steps (Phase 2 & Phase 3)
- Phase 2: Refine public content and live enquiry submission endpoint (`/api/enquiry`), complete legacy 301 redirect inventory checks, and dynamic sitemap.
- Phase 3: Supabase Auth integration, live Row-Level Security policy verification under ordinary teacher vs coordinator JWTs, and admin cohort management.
