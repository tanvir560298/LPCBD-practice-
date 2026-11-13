# Language Proficiency Center (LPC), Bangladesh
## Modern Institutional Website & Secure Teacher Attendance Portal

This repository contains the Next.js 14 + TypeScript implementation for the public website and faculty attendance portal of **Language Proficiency Center (LPC), Bangladesh**.

---

## 1. Quick Start

### Prerequisites
- Node.js `v18.17.0` or higher (`v24.x` tested and supported)
- npm `v9.x` or higher

### Installation & Run Commands
```bash
# 1. Install dependencies
npm install

# 2. Run TypeScript typecheck
npm run typecheck

# 3. Run unit & integration test suite (Vitest)
npm test

# 4. Build optimized production bundle
npm run build

# 5. Start local production server
npm start
# App runs at: http://localhost:3000
```

---

## 2. Information Architecture & Route Inventory

Every original navigation destination from `https://lpcbd.org/` is accounted for without placeholder `#` links:

| Original Item | Grouped Destination | New Route | Status |
|---|---|---|---|
| Home | Home | `/` | Complete with Hero, Discovery, Pedagogy, Access Highlight, FAQ |
| About US / About LPC | About LPC > Overview | `/about` | Complete with Mission & History |
| Board of Directors | About LPC > Leadership | `/about/leadership` | Governance framework & audit notice |
| Teachers (Duplicate menu) | About LPC > Teachers | `/teachers` | Consolidated faculty directory |
| Course | Courses Catalog | `/courses` | Filterable by category, audience & branch |
| Individual Course | Course Detail | `/courses/[slug]` | Syllabus, schedule, branch availability, fee notes |
| Access Program | Programs & Schools > Access | `/programs/access` | Distinct microscholarship eligibility |
| L P C Schools | Programs & Schools > Schools | `/schools` | Laboratory Schools Overview |
| Dhaka Lab School | Schools > Dhaka | `/schools/dhaka` | Dhanmondi campus admissions & curriculum |
| Rajshahi Lab School | Schools > Rajshahi | `/schools/rajshahi` | Rajshahi campus details |
| Success Story | Community > Student Stories | `/community/stories` | Verified learning reflections |
| Alumni | Community > Alumni | `/community/alumni` | Alumni network & mentorship |
| Blog | Community > Blog | `/blog` | ELT articles & study strategies |
| Branches | Contact & Branches > Branches | `/branches` | Dhaka, Chattogram, Rajshahi, Cox's Bazar |
| Contact Us | Contact & Branches > Contact | `/contact` | Working enquiry form with server feedback |
| Login | Header > Teacher Portal | `/portal` & `/portal/login` | Full-size dedicated attendance workstation |
| Newsletter | Footer Auxiliary | `/newsletter` | Academic newsletter subscription |

---

## 3. Teacher Attendance Workstation

Accessible directly via the prominent **Teacher Portal** link in the header:
- **Session-based, not just date-based:** A batch can hold multiple classes on the same date (e.g. Batch 44 Session #5 at 10:00 AM and Session #6 at 12:00 PM).
- **Timezone Discipline:** All scheduled times display in **Asia/Dhaka (BST / GMT+6)**; timestamps persist as UTC ISO strings.
- **Unmarked Default:** Enrolled students initialize with `unmarked` status. Final submission is blocked if unresolved unmarked students remain.
- **Bulk Protection:** "Mark All Present" defaults to unmarked rows and requires explicit confirmation to overwrite existing manual marks.
- **Locking & Corrections:** Submitting locks the sheet and produces an audit trail. Retrospective adjustments require Branch Coordinator approval via the "Request Correction" workflow.
- **Reports:** Scoped roster reports provide raw counts and a documented provisional attendance percentage calculation. Exported CSVs are protected against spreadsheet formula injection.

---

## 4. Visual Assets & Synthetic Data Disclosure

- **Typographic Wordmark:** A custom typographic crest badge is used in the header and footer pending receipt of high-resolution vector logos from LPC administration.
- **Synthetic Profiles:** In accordance with the brief, sample teacher identities, student rosters, and testimonials are clearly marked as realistic synthetic models for prototype evaluation.

---

## 5. Responsive Evidence & Screenshots

Generated headless Chrome screenshots at desktop (`1280x900`) and mobile (`390x844`) widths are available in `docs/screenshots/`:
- `docs/screenshots/homepage-desktop.png`
- `docs/screenshots/homepage-mobile.png`
- `docs/screenshots/courses-desktop.png`
- `docs/screenshots/course-detail-desktop.png`
- `docs/screenshots/course-detail-mobile.png`
- `docs/screenshots/portal-dashboard-desktop.png`
- `docs/screenshots/attendance-workstation-desktop.png`
- `docs/screenshots/attendance-workstation-mobile.png`

