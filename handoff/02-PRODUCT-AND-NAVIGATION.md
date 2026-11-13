# Product and information architecture

## Primary audiences
Prospective students, parents/guardians, teachers, program participants, alumni and institutional collaborators. First-time students should discover suitable courses and how to enquire without understanding internal organization structures.

## Public navigation proposal
Home | About LPC | Courses | Programs & Schools | Community | Contact & Branches | Teacher Portal
Distinct Admission Enquiry CTA. Prioritize clear touch-friendly grouping rather than fitting every item on one horizontal line.

| Existing item | New location | Proposed route |
|---|---|---|
| Home | Home | / |
| About US / About LPC | About LPC > Overview | /about |
| Board of Directors | About LPC > Leadership | /about/leadership |
| Teachers (both menu appearances) | About LPC > Teachers | /teachers |
| Branches | Contact & Branches > Branches | /branches |
| Course | Courses | /courses |
| Individual course | Course detail | /courses/[slug] |
| Access Program | Programs & Schools > Access | /programs/access |
| Alumni | Community > Alumni | /community/alumni |
| Success Story | Community > Student stories | /community/stories |
| L P C Schools | Programs & Schools > Schools | /schools |
| LPC Laboratory School & College Dhaka | Schools > Dhaka | /schools/dhaka |
| LPC Laboratory School & College Rajshahi | Schools > Rajshahi | /schools/rajshahi |
| Blog | Community > Blog | /blog |
| Contact Us | Contact & Branches > Contact | /contact |
| Login | Teacher Portal | /portal/login |
| Newsletter (auxiliary item) | Footer / updates | /newsletter |

Do not remove unverified activities silently. If details are unavailable, design the page and track missing owner content; do not publish a misleading empty page. Schools and branch activity need owner confirmation.

### Legacy URLs
Preserve existing URLs where feasible, otherwise create explicit 301 mappings after inventory. Examples: /about-us/, /board-of-directors/, /course/, /product/spoken-english/, /access-program-bangladesh/, /success-story/, /contact-us/, /l-p-c-school/ and its Dhaka/Rajshahi children. The WordPress /teachers/ route can remain unchanged. Review existing media and indexed URLs before launch. No redirect loops or blanket redirects to home.

## Public pages
Homepage: purposeful hero, audience choices, courses, teaching approach, Access/program highlight, verified student stories, upcoming information, branches, FAQ, footer.
Courses: category, audience and delivery filters only where actual data supports them; useful empty state; shareable filters desirable.
Course detail: audience, prerequisites/level, outcomes, syllabus, duration/hours, format, schedule, branch, fee if supplied, instructors if assigned, enquiry action and FAQ. Unknown information is not invented.
Enquiry: minimum useful fields, course/branch choice, name, preferred contact, optional message. Show success only after real server confirmation. No unnecessary sensitive fields.
Contact/branches: current addresses and direct contact actions, maps where appropriate.
Community: genuine stories with consent and dates; do not fabricate ratings.

## Portal routes
/portal/login; /portal (today's classes); /portal/batches; /portal/batches/[id]; /portal/sessions/[id]/attendance; /portal/reports.
Coordinator/admin management routes may live under /portal/admin, but route naming does not grant authorization.

Student and parent logins, QR attendance, GPS, biometric attendance, payments, live classes, LMS and payroll are not MVP requirements. Do not expand scope automatically.
