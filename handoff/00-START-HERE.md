# LPC website + attendance portal — Antigravity handoff
Prepared 13 November 2026 from the planning conversation.

## কীভাবে ব্যবহার করবেন
1. পুরো folder Antigravity workspace-এ রাখুন।
2. `01-MASTER-PROMPT.md`-এর পুরো লেখা প্রথম message হিসেবে দিন।
3. তারপর `06-PHASED-PROMPTS.md` থেকে একবারে একটি phase দিন। প্রথমে design prototype review করুন, তারপর backend কাজ।
4. নতুন chat হলে master prompt আবার দিন এবং আগের কাজের `PROJECT_STATUS.md` পড়তে বলুন।
5. কাজ শেষে `07-REVIEW-CHECKLIST.md` দিয়ে পরীক্ষা করুন। Code, screenshots, test results ও status নিয়ে Codex-এ cross-check করাতে পারবেন।

## যা নির্ধারিত
- Target: LPC, https://lpcbd.org/।
- Modern student-focused website এবং teacher login-সহ attendance system।
- বর্তমান navbar-এর সব destination রাখতে হবে। Related options dropdown-এ group করা যাবে।
- Teacher নিজের assigned batch-এর attendance নিতে পারবেন।
- মূল public website ও secure portal একই coherent brand ব্যবহার করবে।

## যা এখনো নির্ধারিত নয়
Student/teacher সংখ্যা, active branch list, current course details, existing hosting/database, staff accounts, attendance policy, final stack, budget, deployment destination। এগুলোকে assumption হিসেবে track করতে হবে; confirmed fact বানানো যাবে না। প্রায় তিন মাস সম্ভাব্য কাজের সময়, নিশ্চিত deadline নয়।

## File map
- 01: Paste-ready master prompt
- 02: Product scope, routes, roles
- 03: Visual direction and content
- 04: Attendance behavior and data model
- 05: Engineering and security
- 06: Sequential implementation prompts
- 07: Review checklist and evidence
- 08: Content verification register
- reference/: first visual concept and earlier research notes

প্রথম UI ছবিটি approved final design নয়; generated people, sample data ও provisional logo আছে। Reference হিসেবে ব্যবহার করুন, exact copy নয়। Production-ready দাবি করতে authenticated backend ও tests দরকার।
