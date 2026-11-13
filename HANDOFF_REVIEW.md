# Language Proficiency Center (LPC) — Technical Review & Handoff Report

*Target System:* Language Proficiency Center (LPC), Bangladesh (`https://lpcbd.org/`)  
*Evaluation Benchmark:* `handoff/07-REVIEW-CHECKLIST.md` & `handoff/05-ENGINEERING-AND-SECURITY.md`  
*Current Status:* **Ready for Codex Cross-Check & Owner Verification**  
*Date:* 13 November 2026

---

## 1. Executive Summary & Verification Evidence

All six development phases defined in `06-PHASED-PROMPTS.md` have been implemented, tested, and validated in an isolated staging-ready environment.

### Automated Test Suite: **36 / 36 Tests Passing (100%)**
```
Test Files  6 passed (6)
     Tests  36 passed (36)
  Duration  665ms

✓ tests/redirects.test.ts (3 tests)
  - Preserves exact 301/308 legacy URLs (e.g. /about-us -> /about, /course -> /courses)
  - No blanket wildcard redirect to homepage
✓ tests/navigation.test.ts (2 tests)
  - All 17 legacy navbar destinations mapped and reachable
  - Duplicate 'Teachers' menu entry consolidated into /teachers
✓ tests/enquiry.test.ts (4 tests)
  - Server-side validation rejects malformed phone and email
  - Real tracking reference generation (ENQ-XXXXXX)
  - Sliding-window rate-limiting protects against form submission abuse
✓ tests/attendance.test.ts (8 tests)
  - Clocks, session dates, and timetables locked to Asia/Dhaka (BST / UTC+6)
  - Keyed by unique session ID; supports multiple sessions on same calendar date
  - Bulk "Mark All Present" requires explicit confirmation before overwriting existing marks
  - Formula injection defense: escapes '=', '+', '-', '@' on CSV export
✓ tests/attendance-concurrency.test.ts (7 tests)
  - Unmarked default initialization
  - Optimistic concurrency control (409 Conflict on revision mismatch)
  - 422 Unprocessable Entity blocking final submission if unmarked rows remain
  - Atomic sheet lock upon final submission
  - Immutable audit logging with UTC timestamps
  - Teacher correction request workflow with reason tracking
✓ tests/security-policies.test.ts (12 tests)
  - Production fails closed (503/401) without valid Supabase backend credentials
  - Teacher cross-branch/unassigned session access rejected (403 Forbidden)
  - Branch coordinator cross-campus access rejected (403 Forbidden)
  - Client-injected actor_role or actorId in body is ignored; server enforces authenticated session
  - Cancelled session attendance submission blocked (422 Unprocessable Entity)
  - Deactivated staff account blocked (403 Forbidden)
  - Admin operations (batch creation, session scheduling) strictly guarded
  - Session number uniqueness enforced within batch cohort
  - Sliding-window in-memory rate limiting throttles rapid calls (429)
```

- **Typecheck (`npm run typecheck`):** 0 errors.
- **Production Build (`npm run build`):** 30 / 30 routes compiled cleanly.
- **Responsive Multi-Viewport Evidence:** 4 viewports captured in `docs/screenshots/` (Mobile 390px, Tablet 768px, Desktop 1280px, Wide 1440px).

---

## 2. Complete File & Route Directory

### Public Website Routes (17 Legacy Mappings Preserved)
- `/`: Public Homepage with Split Hero, Audience Filtering (Adults, Test Prep, Young Learners), CEFR Pedagogy, Access Program Spotlight, Reflections, and Regional Campuses.
- `/about`: Institutional Mission, Heritage, and Three Core Pillars.
- `/about/leadership`: Board of Directors & Governance overview (with verification disclaimer).
- `/teachers`: Consolidated Faculty & Trainer directory.
- `/courses`: Filterable Course Catalog (Categories, Branches, Level).
- `/courses/[slug]`: Course Detail page with weekly syllabus, prerequisites, schedule, branch availability, fee disclaimer, and enquiry trigger.
- `/programs/access`: English Access Microscholarship Program (distinguishing merit scholarship eligibility from paid tuition).
- `/schools`: LPC Laboratory Schools Overview.
- `/schools/dhaka`: Dhaka Laboratory School & College shell.
- `/schools/rajshahi`: Rajshahi Laboratory School & College shell.
- `/community/stories`: Student Success Stories & Reflections.
- `/community/alumni`: Alumni Network & Professional Mentorship.
- `/blog`: ELT Pedagogical Insights & Articles.
- `/branches`: 4 Regional Campuses (Dhaka Dhanmondi, Chattogram Agrabad, Rajshahi, Cox's Bazar).
- `/contact`: Admissions Contact Form integrated with `/api/enquiry`.
- `/newsletter`: Auxiliary newsletter subscription.
- `/sitemap.xml`: Dynamic XML sitemap listing public pages and active course URLs.
- `/robots.txt`: Search crawler directives allowing public pages and explicitly disallowing `/portal/` and `/api/`.

### Teacher & Administrator Workstation Routes
- `/portal`: Dedicated Faculty Dashboard (Today's Scheduled Sessions in `Asia/Dhaka` time).
- `/portal/batches`: Assigned Batches overview.
- `/portal/batches/[id]`: Detailed cohort schedule, session timeline, and enrolled roster.
- `/portal/sessions/[id]/attendance`: Interactive Attendance Workstation (Unmarked default, 5-status toggles, bulk present protection, save draft, submit lock, and correction request).
- `/portal/reports`: Scoped Attendance Reports with raw counts, provisional percentage, missing attendance monitor, and formula-safe CSV export.
- `/portal/admin`: Full Administrative Console for Batches, Sessions, Teacher Assignments, and Student Enrollments.
- `/portal/admin/import`: Administrative CSV student roster preview and row-level error validation.
- `/portal/login`: Faculty & Staff Demo Login with Role-Scoped identity switcher.

---

## 3. Checklist Audit (07-REVIEW-CHECKLIST.md)

| Category | Requirement | Status | Evidence / Verification |
|---|---|---|---|
| **Public Site** | 17 legacy menu destinations mapped & reachable | **PASS** | `tests/navigation.test.ts`, `tests/redirects.test.ts` |
| **Public Site** | Consolidated duplicate 'Teachers' menu | **PASS** | Single `/teachers` route with faculty directory |
| **Public Site** | No empty `#` placeholders or shop/cart artifacts | **PASS** | All CTAs link to real modals, routes, or `/api/enquiry` |
| **Public Site** | Course information supports enquiry without fabrication | **PASS** | Clear disclaimed tuition fees; verified CEFR syllabus |
| **Public Site** | Mobile menu & responsive layouts across breakpoints | **PASS** | Tested at 390px, 768px, 1280px, 1440px |
| **Public Site** | Enquiry workflow reaches real destination & validates | **PASS** | `tests/enquiry.test.ts`; validation & rate limiting active |
| **Attendance** | Teacher sees only assigned sessions | **PASS** | `tests/security-policies.test.ts`; 403 on unassigned session |
| **Attendance** | Coordinator cannot cross branch boundaries | **PASS** | `tests/security-policies.test.ts`; Dhaka coord rejected on CTG |
| **Attendance** | Ordinary users cannot self-promote to admin | **PASS** | Server-enforced identity; body `actor_role` claims ignored |
| **Attendance** | New records start unmarked; final submit blocks incomplete | **PASS** | `tests/attendance-concurrency.test.ts`; 422 block verified |
| **Attendance** | Bulk present preserves marks unless confirmed | **PASS** | Modal confirmation required to overwrite |
| **Attendance** | Draft survives reload after server save | **PASS** | `tests/attendance-concurrency.test.ts`; version incremented |
| **Attendance** | Multi-session on same date support | **PASS** | Keyed by session ID (Session #5 & #6 for Batch 44) |
| **Attendance** | Cancelled session cannot receive attendance | **PASS** | `tests/security-policies.test.ts`; returns 422 Unprocessable |
| **Attendance** | Correction requires authorization, reason & audit | **PASS** | `requestAttendanceCorrection` records immutable audit |
| **Attendance** | Exports are spreadsheet-formula-safe | **PASS** | `tests/attendance.test.ts`; `=,+,-,@` sanitized with `'` |
| **Security** | Production fails closed without backend credentials | **PASS** | `tests/security-policies.test.ts`; returns 503/401 |
| **Security** | No secrets in repo/browser/logs | **PASS** | `.env.example` documented; service role key server-only |
| **Security** | Database backup, restore, and rollback documented | **PASS** | `docs/DATABASE_OPERATIONS.md` with tested commands |

---

## 4. Policy Decisions & Identified Content Gaps

### Policy Decisions Recorded
1. **Timezone Anchor:** All schedules, attendance sheets, and calendar queries are strictly calculated in `Asia/Dhaka` (`BST / GMT+6`). UTC is used exclusively for storage timestamps.
2. **Session Keying:** Attendance is keyed by `(session_id, student_id)`, NOT `(batch_id, date)`. This allows intensive cohorts to hold multiple valid sessions on a single date.
3. **Attendance Formula:** The report percentage is labeled **Provisional** until the LPC Academic Council officially ratifies whether "excused" absences count toward the 75% certificate eligibility threshold. Formula currently used:
   $$\text{Attendance Rate} = \frac{\text{Present} + \text{Late}}{\text{Present} + \text{Late} + \text{Absent}} \times 100$$
4. **Isolated Synthetic Demo Mode:** `NEXT_PUBLIC_DEMO_MODE=true` allows full UI and logic testing using synthetic data without contacting external services. In production (`NEXT_PUBLIC_DEMO_MODE=false`), the app strictly fails closed if Supabase credentials are missing.

### Content Gaps Register for LPC Owner Review
- **Official Vector Logo:** Currently using a clean typographic crest wordmark. Awaiting official `.svg` vector asset.
- **Board of Directors Roster:** Leadership page provides institutional governance shells. Current trustee list needs owner re-verification.
- **Tuition Fee Schedule:** Course detail pages clearly display a provisional note advising students to consult the admissions office for the current term schedule and scholarship concessions.
- **Campus Helpdesk Phone Numbers:** Branch directory lists legacy numbers with placeholders; need owner confirmation before publication.

---

## 5. Startup & Staging Run Commands

### Development Mode
```bash
npm install
npm run dev
# Server accessible at http://localhost:3000
```

### Run Automated Tests & Typecheck
```bash
npm run typecheck
npm test
```

### Production Build & Launch
```bash
npm run build
npm start
```

### Production Deployment Boundaries
- **DO NOT** deploy to live DNS (`lpcbd.org`) or overwrite existing WordPress hosting without explicit written authorization from the LPC owner.
- **DO NOT** import real student personal identifiable information (PII) into staging or local databases.
