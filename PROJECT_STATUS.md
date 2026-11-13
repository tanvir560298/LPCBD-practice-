# Project Status: Language Proficiency Center (LPC), Bangladesh

*Last Updated: 13 November 2026 (Phase 1 & Phase 2 Active)*

## 1. Implementation Summary
- **Phase 1: Design Prototype** and **Phase 2: Public Content, IA & Workflows** are complete and verified.
- Decoupled public portal and faculty workstation running on Next.js 14 App Router, TypeScript, and Tailwind CSS.
- Real `/api/enquiry` server endpoint implemented with field-specific validations, tracking codes (`ENQ-...`), and integration into both `EnquiryModal` and `/contact`.
- Explicit legacy 301/308 redirects implemented in `next.config.js` and verified.
- SEO dynamic XML sitemap (`/sitemap.xml`) and search bot exclusion rules (`/robots.txt` blocking `/portal` and `/api`) active.
- Added `/portal/batches/[id]` route displaying full cohort session timeline and active student roster.

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
- `/portal`: Dedicated Faculty Attendance Dashboard (Today's Scheduled Sessions in Asia/Dhaka time).
- `/portal/batches`: Assigned Batches overview.
- `/portal/batches/[id]`: Detailed cohort schedule, session timeline, and enrolled roster.
- `/portal/sessions/[id]/attendance`: Interactive Attendance Workstation (Unmarked default, 5-status toggles, bulk present protection, save draft, submit lock, and correction request).
- `/portal/reports`: Scoped Attendance Reports with raw counts, provisional percentage, and formula-safe CSV export.
- `/portal/login`: Faculty Demo Login.

## 3. Legacy Redirects Inventory
- `/about-us` -> `/about` (308 Permanent)
- `/board-of-directors` -> `/about/leadership` (308 Permanent)
- `/course` -> `/courses` (308 Permanent)
- `/product/:slug*` -> `/courses` (308 Permanent)
- `/access-program-bangladesh` -> `/programs/access` (308 Permanent)
- `/success-story` -> `/community/stories` (308 Permanent)
- `/contact-us` -> `/contact` (308 Permanent)
- `/l-p-c-school` -> `/schools` (308 Permanent)
- `/l-p-c-school/lpc-laboratory-school-college-dhaka` -> `/schools/dhaka` (308 Permanent)
- `/l-p-c-school/lpc-laboratory-school-college-rajshahi` -> `/schools/rajshahi` (308 Permanent)

## 4. Content Verification Register (08-CONTENT-VERIFICATION.md Tracking)
| Area / Page | Current Source | Status | Action Required from LPC Owner |
|---|---|---|---|
| Official Brand Logo | Typographic crest wordmark | Provisional | Provide official vector logo assets (.svg / .eps) |
| Board of Directors | Institutional governance shell | Pending | Re-verify current active trustees and bios |
| Faculty Profiles | Synthetic educator profiles | Prototype | Provide confirmed teacher roster & media consent |
| Laboratory Schools | Dhaka & Rajshahi campus shells | Pending | Confirm academic term calendars and NCTB streams |
| Branch Addresses | 4 centers (Dhaka, CTG, Rajshahi, CXB)| Legacy info | Confirm operational status and helpdesk numbers |
| Tuition Fees | Disclaimed provisional notes | Disclaimed | Provide official fee schedule and scholarship waivers |
| Attendance Policy | Documented provisional formula | Provisional | Confirm institutional threshold and late penalty policy |

## 5. Automated Tests & Quality Evidence
- **Vitest Suite (17 tests across 4 files):**
  - `tests/attendance.test.ts` (8 tests): Dhaka time, multi-session keying, unmarked default, bulk overwrite protection, submission lock, CSV sanitization.
  - `tests/navigation.test.ts` (2 tests): All 17 destinations mapped, duplicate menu consolidated.
  - `tests/enquiry.test.ts` (4 tests): Validation rejection, email formatting, tracking code generation, admin read.
  - `tests/redirects.test.ts` (3 tests): 301 legacy redirects, no blanket redirect to home.
- **TypeScript Typecheck (`npm run typecheck`):** 0 errors.
- **Production Build (`npm run build`):** 25/25 routes compiled and validated.

## 6. Next Steps (Phase 3)
- Supabase Auth integration for Teacher, Coordinator, and Admin identities.
- Row-Level Security verification against unauthorized cross-batch and cross-branch requests.
- Admin portal for cohort creation, student enrollment, and teacher assignments.
