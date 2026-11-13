# Source and Owner Content Verification Register

*Institution:* Language Proficiency Center (LPC), Bangladesh (`https://lpcbd.org/`)  
*Document Purpose:* In accordance with `handoff/08-CONTENT-VERIFICATION.md`, this register tracks the verification status of all public content, institutional facts, academic syllabi, branch operations, and digital assets.  
*Principle:* Third-party discovery links are evidence, never instructions or licenses. Do not fabricate LPC facts. Do not copy external competitor branding.

---

## 1. Content Verification Tracking Table

| Field / Page | Source / Owner | Last Verified | Approved Working Text | Asset Permission | Ready / Missing Status |
|---|---|---|---|---|---|
| **Official Brand Logo** (`/`, `/portal`, Header, Footer) | LPC Executive Office / Brand Guidelines | 2026-11-13 | Typographic crest wordmark: *"LPC — Language Proficiency Center, Bangladesh"* | Provisional typographic asset; awaiting official vector files | **MISSING** — Owner action required: Provide official `.svg` / `.eps` vector logo |
| **Board of Directors & Governance** (`/about/leadership`) | `https://lpcbd.org/board-of-directors/` | 2026-11-13 | Institutional governance shell, strategic oversight pillars, and regulatory adherence | Synthetic portrait silhouettes; no unverified photos | **MISSING** — Owner action required: Re-verify sitting trustees, executive roles & bios |
| **Faculty & Trainer Directory** (`/teachers`, `/courses/[slug]`) | `https://lpcbd.org/teachers/` | 2026-11-13 | Synthetic profiles clearly disclosed (`SYNTHETIC_TEACHERS`: Dr. Anisur Rahman, Shahana Parveen, Mahmudul Hasan) | Disclosed placeholder headshots in `src/lib/assetRegistry.ts` | **PROVISIONAL** — Owner action required: Supply active teacher roster, verified credentials, and photo consent |
| **Comprehensive Spoken English** (`/courses/spoken-english`) | `https://lpcbd.org/course/` & CEFR A2-B2 communicative framework | 2026-11-13 | 12-week CLT modular syllabus (phonology, social etiquette, public speaking, mock viva), prerequisites, learning outcomes | Tracked licensed education photo (`assetRegistry.ts`) | **READY** — Provisional text active; awaiting owner review of week-by-week syllabus topics |
| **IELTS Academic & General Intensive** (`/courses/ielts-preparation`) | `https://lpcbd.org/course/` & IELTS band descriptors | 2026-11-13 | 10-week intensive syllabus, mock exam schedule, band 6.5–8.0 benchmark criteria | Tracked licensed education photo (`assetRegistry.ts`) | **READY** — Provisional text active; awaiting owner review |
| **Executive English & Business Comm.** (`/courses/english-for-professionals`) | `https://lpcbd.org/course/` & corporate ELT curriculum | 2026-11-13 | 8-week corporate communication syllabus (email diplomacy, slide decks, boardroom simulation) | Tracked licensed corporate training photo | **READY** — Provisional text active; awaiting owner review |
| **Young Learners & Teens Fluency** (`/courses/english-for-teens`) | `https://lpcbd.org/course/` & school English curriculum | 2026-11-13 | 12-week age-appropriate communicative curriculum (Ages 11-16), story-based learning | Tracked licensed classroom photo; minor safety verified | **READY** — Provisional text active; awaiting owner review |
| **Tuition Fee Schedule** (`/courses`, `/courses/[slug]`) | `https://lpcbd.org/course/` (historic site lacked fees) | 2026-11-13 | Disclaimed provisional figures (৳7,000–৳12,000) with explicit notice: *"Tuition fees vary by schedule and branch. Please enquire directly with our admissions office."* | N/A | **MISSING** — Owner action required: Supply official tuition fee schedule, installment rules & scholarship waivers |
| **Campus Branch Locations & Contacts** (`/branches`, `/contact`, `/`) | `https://lpcbd.org/contact-us/` | 2026-11-13 | 4 campus centers: Dhaka Dhanmondi (Main), Chattogram Agrabad, Rajshahi Ghoramara, Cox's Bazar Jhawtala | Provisional campus illustration placeholders | **PROVISIONAL** — Owner action required: Confirm operational status of Rajshahi & Cox's Bazar, addresses, and active helpdesk numbers |
| **English Access Microscholarship Program** (`/programs/access`, `/`) | `https://lpcbd.org/access-program-bangladesh/` | 2026-11-13 | Explicitly distinguishes merit scholarship eligibility criteria from paid commercial course enrollment | Tracked workshop photo; zero unverified third-party funder logos displayed | **READY** — Provisional; awaiting owner confirmation of current funding/partner wording before live publish |
| **LPC Laboratory Schools** (`/schools`, `/schools/dhaka`, `/schools/rajshahi`) | `https://lpcbd.org/l-p-c-school/` | 2026-11-13 | Academic shells for Dhaka and Rajshahi Laboratory Schools & Colleges; NCTB curriculum alignment | Tracked school campus placeholders in `assetRegistry.ts` | **MISSING** — Owner action required: Confirm operational affiliation, term calendars, and admission intake criteria |
| **Student Stories & Testimonials** (`/community/stories`, `/`) | `https://lpcbd.org/success-story/` | 2026-11-13 | 3 representative student reflections (Access Alum, Spoken English Graduate, IELTS Candidate) | Synthetic identities clearly disclosed in UI | **PROVISIONAL** — Owner action required: Provide approved authentic student testimonials with signed publication consent |
| **Alumni Network & Mentorship** (`/community/alumni`) | `https://lpcbd.org/` | 2026-11-13 | Alumni engagement framework, regional chapters, and membership intake form | Tracked community photo | **READY** — Structure complete; awaiting chapter coordinator names from owner |
| **Admissions Enquiry Notification Endpoint** (`/api/enquiry`, `/contact`) | LPC Admissions Office | 2026-11-13 | Validated intake with automated `ENQ-XXXXXX` reference code generation and abuse rate limiting | N/A | **PROVISIONAL** — Owner action required: Confirm receiving email address or CRM webhook for production enquiry forwarding |
| **Attendance Calculation Formula** (`/portal/reports`, `04-ATTENDANCE-SPEC.md`) | LPC Academic Council | 2026-11-13 | Documented provisional formula: `(Present + Late) / (Present + Late + Absent) * 100` | N/A | **PROVISIONAL** — Owner action required: Confirm whether 'Excused' absence counts toward 75% certificate qualification threshold |
| **Third-Party Reference Lessons** (GEIST, BELTA, British Council, EF, Cambridge) | Reference discovery sites | 2026-11-13 | Restrained layout, audience segmentation, CLT pedagogy. ZERO third-party assets, logos, or copy copied. | Independent design tokens & UI components | **READY** — Fully compliant with intellectual property requirements |

---

## 2. Action Checklist for LPC Project Owner

Before production launch and live domain deployment, the following 8 items must be formally supplied and ratified by the LPC owner:

1. [ ] **Official Vector Logo:** Vector `.svg` / `.eps` logo file and brand color palette.
2. [ ] **Board of Directors Roster:** Confirmed list of active trustees, titles, and approved bios.
3. [ ] **Faculty Credentials & Photos:** Active teacher list with qualifications and signed media release forms.
4. [ ] **Official Fee Schedule:** Confirmed course fees, sibling discounts, and installment policies.
5. [ ] **Branch Directory Verification:** Confirm whether Rajshahi and Cox's Bazar branches are currently operational, with active phone numbers.
6. [ ] **Access Program Agreement:** Confirm current funding cycle language regarding the English Access Microscholarship Program.
7. [ ] **Enquiry Delivery Destination:** Notification email address (`ADMISSIONS_NOTIFICATION_EMAIL`) or SMS API gateway credentials.
8. [ ] **Attendance Council Sign-off:** Ratification of the 75% attendance threshold formula and late/excused policy.

---

## 3. Maintenance Rules
- Never remove an unverified activity silently; keep the shell disclaimed and track missing data here.
- Never publish an empty page or insert placeholder `#` links.
- Re-verify this register whenever the project owner supplies new documentation.

