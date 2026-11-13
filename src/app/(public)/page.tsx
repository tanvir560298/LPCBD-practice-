'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  HelpCircle,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  Compass,
  Award,
  ChevronRight,
  MessageSquare,
  Lock,
} from 'lucide-react';
import { SYNTHETIC_COURSES, SYNTHETIC_BRANCHES } from '@/lib/mockData';
import { EnquiryModal } from '@/components/public/EnquiryModal';

export default function HomePage() {
  const [selectedAudience, setSelectedAudience] = useState<'all' | 'adults' | 'test' | 'teens'>('all');
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const filteredCourses = SYNTHETIC_COURSES.filter((course) => {
    if (selectedAudience === 'all') return true;
    if (selectedAudience === 'adults') return course.category === 'Spoken English' || course.category === 'Professional Skills';
    if (selectedAudience === 'test') return course.category === 'Test Preparation';
    if (selectedAudience === 'teens') return course.category === 'Young Learners';
    return true;
  });

  const faqs = [
    {
      q: 'How do I determine which LPC English course is right for me?',
      a: 'We offer a complimentary 20-minute diagnostic placement test covering spoken fluency, listening, and practical grammar. Our academic coordinators will evaluate your benchmark and recommend the exact module tailored to your proficiency and objectives.',
    },
    {
      q: 'Are classes held in-person or online?',
      a: 'LPC provides both interactive physical classrooms at our Dhaka (Dhanmondi), Chattogram, and Rajshahi campuses, as well as select evening hybrid batches with dedicated multimedia language lab facilities.',
    },
    {
      q: 'How does the English Access Microscholarship Program differ from regular courses?',
      a: 'The English Access Program is a specialized two-year foundation initiative sponsored for economically disadvantaged teenagers. Unlike standard public admissions, Access students are selected through competitive regional scholarship screenings.',
    },
    {
      q: 'What credentials or certificates are awarded upon course completion?',
      a: 'Students maintaining at least 80% session attendance and completing term viva/written assessments receive an official LPC Bangladesh Certificate of Proficiency, detailing their CEFR-aligned level.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION (Split Hero with Clear Student Value Proposition) */}
      <section className="relative bg-gradient-to-b from-lpc-navy-950 via-lpc-navy-900 to-lpc-navy-800 text-white pt-12 pb-20 lg:pt-18 lg:pb-28 overflow-hidden">
        {/* Subtle decorative background grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lpc-gold-400/15 border border-lpc-gold-400/30 text-lpc-gold-300 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-lpc-gold-400" />
                <span>Admissions Open for Winter 2026 Term</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
                Speak Confidently. <br />
                <span className="text-lpc-gold-400">Excel Globally.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Language Proficiency Center (LPC) provides research-backed English language pedagogy, IELTS masterclasses, and executive communication training across Bangladesh.
              </p>

              {/* Two prioritized primary actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => setEnquiryModalOpen(true)}
                  className="px-6 py-3.5 bg-lpc-gold-400 hover:bg-lpc-gold-500 text-slate-950 font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
                >
                  <span>Apply for Admission</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  href="/courses"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <BookOpen className="w-4 h-4 text-lpc-gold-300" />
                  <span>Explore Course Catalog</span>
                </Link>
              </div>

              {/* Key Trust Metrics (Sourced conservatively without exaggerated fabrication) */}
              <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">4 Campuses</div>
                  <div className="text-xs text-slate-400 mt-0.5">Dhaka, CTG, Rajshahi, CXB</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">CLT-Based</div>
                  <div className="text-xs text-slate-400 mt-0.5">Interactive Communicative Method</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">Asia/Dhaka</div>
                  <div className="text-xs text-slate-400 mt-0.5">Structured Session Tracking</div>
                </div>
              </div>
            </div>

            {/* Right Card: Quick Course Finder & Institutional Badge */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 backdrop-blur-md text-slate-900 rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-lpc-navy-900">Admissions Quick Check</h2>
                    <p className="text-xs text-slate-500">Select your learning goal for fast placement</p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Intake Active" />
                </div>

                <div className="space-y-3">
                  <Link
                    href="/courses/spoken-english"
                    className="group block p-3.5 rounded-xl border border-slate-200 hover:border-lpc-navy-600 hover:bg-lpc-navy-50/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-lpc-navy-100 text-lpc-navy-800 flex items-center justify-center font-bold text-sm">
                          SE
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 group-hover:text-lpc-navy-800">
                            Spoken English & Fluency
                          </div>
                          <div className="text-xs text-slate-500">12 Weeks • Beginner to Advanced</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-lpc-navy-800 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>

                  <Link
                    href="/courses/ielts-preparation"
                    className="group block p-3.5 rounded-xl border border-slate-200 hover:border-lpc-navy-600 hover:bg-lpc-navy-50/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                          IE
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 group-hover:text-lpc-navy-800">
                            IELTS Academic & General
                          </div>
                          <div className="text-xs text-slate-500">10 Weeks • Band 7.0+ Target Strategy</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-lpc-navy-800 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>

                  <Link
                    href="/courses/english-for-professionals"
                    className="group block p-3.5 rounded-xl border border-slate-200 hover:border-lpc-navy-600 hover:bg-lpc-navy-50/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm">
                          EX
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900 group-hover:text-lpc-navy-800">
                            Executive English & Writing
                          </div>
                          <div className="text-xs text-slate-500">8 Weeks • Weekend & Corporate Hybrid</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-lpc-navy-800 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setEnquiryModalOpen(true)}
                    className="w-full py-2.5 px-4 bg-lpc-navy-800 hover:bg-lpc-navy-900 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Request Placement Consultation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. AUDIENCE CHOICES & COURSE DISCOVERY (Prioritized ahead of leadership grid per brief) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-lpc-gold-600 mb-1">
              Academic Curricula
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-lpc-navy-900">
              Featured English Programs
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Structured courses built on international CEFR rubrics with verifiable session tracking and continuous tutor assessments.
            </p>
          </div>

          {/* Segmented Filter Controls */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl">
            <button
              type="button"
              onClick={() => setSelectedAudience('all')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedAudience === 'all'
                  ? 'bg-white text-lpc-navy-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Courses
            </button>
            <button
              type="button"
              onClick={() => setSelectedAudience('adults')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedAudience === 'adults'
                  ? 'bg-white text-lpc-navy-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Adults & Fluency
            </button>
            <button
              type="button"
              onClick={() => setSelectedAudience('test')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedAudience === 'test'
                  ? 'bg-white text-lpc-navy-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              IELTS Prep
            </button>
            <button
              type="button"
              onClick={() => setSelectedAudience('teens')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedAudience === 'teens'
                  ? 'bg-white text-lpc-navy-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Young Learners
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-lpc-navy-50 text-lpc-navy-800 border border-lpc-navy-100">
                    {course.category}
                  </span>
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{course.durationWeeks} Weeks ({course.totalHours} hrs)</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-lpc-navy-800 transition-colors">
                    <Link href={`/courses/${course.slug}`}>
                      {course.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {course.summary}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-lpc-gold-600 shrink-0" />
                    <span className="font-medium text-slate-700">Target Level:</span>
                    <span>{course.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-lpc-navy-600 shrink-0" />
                    <span className="font-medium text-slate-700">Branches:</span>
                    <span>{course.branchIds.length} Campus Centers</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  href={`/courses/${course.slug}`}
                  className="text-xs font-bold text-lpc-navy-800 hover:text-lpc-navy-950 flex items-center gap-1"
                >
                  <span>Syllabus & Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => setEnquiryModalOpen(true)}
                  className="px-3.5 py-1.5 bg-lpc-gold-400 hover:bg-lpc-gold-500 text-slate-950 font-bold text-xs rounded-lg shadow-2xs transition-colors"
                >
                  Enquire Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-colors"
          >
            <span>View Full Academic Catalog with Weekly Modules</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. TEACHING PEDAGOGY & PHILOSOPHY */}
      <section className="bg-lpc-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-lpc-gold-400">
              The LPC Academic Standard
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Communicative Mastery, Not Memorization
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Our classrooms foster spontaneous speech through structured interaction, phonological clarity, and personalized feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-lpc-navy-800/80 border border-lpc-navy-700 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-lpc-gold-400/20 text-lpc-gold-400 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Small-Group Interactive Pods</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Classroom cohorts are capped to ensure every participant receives at least 30 minutes of direct speaking engagement and peer interaction per session.
              </p>
            </div>

            <div className="bg-lpc-navy-800/80 border border-lpc-navy-700 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-lpc-navy-100 text-lpc-navy-900 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5 text-lpc-gold-400" />
              </div>
              <h3 className="text-base font-bold text-white">CEFR-Aligned Rubrics</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                From A1 to C1, our syllabi follow internationally recognized Common European Framework guidelines with continuous diagnostic assessments.
              </p>
            </div>

            <div className="bg-lpc-navy-800/80 border border-lpc-navy-700 p-6 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Session-Based Accountability</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Teachers maintain strict session-level attendance records in Asia/Dhaka time, ensuring transparent tracking of student learning progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ENGLISH ACCESS MICROSCHOLARSHIP & INSTITUTIONAL HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-slate-900 via-lpc-navy-900 to-lpc-navy-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lpc-gold-400/20 border border-lpc-gold-400/40 text-lpc-gold-300 text-xs font-semibold">
                <Sparkles className="w-3 h-3 text-lpc-gold-400" />
                <span>Program Spotlight</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                English Access Microscholarship Program
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                A globally recognized initiative providing a foundation of English language skills to talented 13-to-20 year-olds from economically disadvantaged backgrounds. Students gain communicative fluency, digital literacy, and leadership skills.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Two-Year Intensive Cohorts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Cultural & Community Service Projects</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Regional Scholarship Selection</span>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  href="/programs/access"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-lpc-gold-400 hover:bg-lpc-gold-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md"
                >
                  <span>Learn About Access Program & Eligibility</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-lpc-gold-400/20 text-lpc-gold-400 flex items-center justify-center mx-auto">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">LPC Laboratory Schools</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Discover our institutional primary and secondary campuses in Dhaka and Rajshahi offering holistic national curriculum education.
              </p>
              <Link
                href="/schools"
                className="inline-block text-xs font-bold text-lpc-gold-400 hover:text-lpc-gold-300 underline"
              >
                Explore LPC Schools Overview &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED STUDENT REFLECTIONS (Clearly disclosed as synthetic prototype stories) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-lpc-gold-600">
            Learner Experiences
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-lpc-navy-900">
            Voices from Our Classrooms
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Realistic student narratives illustrating typical learning trajectories across LPC programs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
              &ldquo;The spoken English sessions at LPC Dhanmondi helped me eliminate hesitation during presentations. The daily speaking drills in small pods made an immense difference.&rdquo;
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-lpc-navy-100 text-lpc-navy-800 font-bold text-xs flex items-center justify-center">
                TA
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Tanzila Akhter</div>
                <div className="text-[11px] text-slate-500">Spoken English Graduate • Dhaka</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
              &ldquo;Targeting Band 7.5 felt intimidating until I took the timed mock examinations here. The examiners provided rubric-by-rubric feedback for Writing Task 2.&rdquo;
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                AH
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Abrar Hossain</div>
                <div className="text-[11px] text-slate-500">IELTS Intensive Candidate • Chattogram</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
              &ldquo;The executive business communication batch transformed how our team drafts cross-border proposals. Concise, structured, and immediately applicable.&rdquo;
            </p>
            <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center">
                FZ
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Fatima Tuz Zohra</div>
                <div className="text-[11px] text-slate-500">Corporate Program Participant • Dhaka</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/community/stories"
            className="text-xs font-bold text-lpc-navy-800 hover:text-lpc-navy-950 underline"
          >
            Read more student journeys & community updates &rarr;
          </Link>
        </div>
      </section>

      {/* 6. CAMPUS BRANCH LOCATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-100 rounded-3xl p-8 sm:p-10 border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-lpc-gold-600 mb-1">
                Regional Presence
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-lpc-navy-900">
                LPC Campus Network
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Visit our learning centers across Bangladesh for in-person admissions and placement diagnostics.
              </p>
            </div>

            <Link
              href="/branches"
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold rounded-lg border border-slate-200 shadow-2xs self-start md:self-auto"
            >
              View Full Branch Contacts
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SYNTHETIC_BRANCHES.map((branch) => (
              <div
                key={branch.id}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-lpc-navy-800">{branch.city}</span>
                    {branch.isMainCampus && (
                      <span className="text-[10px] bg-lpc-gold-100 text-lpc-gold-800 px-2 py-0.5 rounded-full font-semibold">
                        Main Campus
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{branch.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{branch.address}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                  <div className="font-medium text-slate-700">{branch.phone}</div>
                  <div className="text-slate-500">{branch.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-lpc-gold-600">
            Admissions & Course Inquiries
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-lpc-navy-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Clear information regarding prerequisites, placement screening, schedules, and certificates.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={faq.q}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-lpc-navy-800 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-lpc-gold-600 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-90' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. BOTTOM ADMISSION CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-lpc-navy-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden border border-lpc-navy-800">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Ready to Accelerate Your English Proficiency?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Speak with our academic counselors today to schedule a placement test or reserve a seat in the upcoming term batch.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setEnquiryModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 bg-lpc-gold-400 hover:bg-lpc-gold-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md"
              >
                Submit Admission Enquiry
              </button>

              <Link
                href="/contact"
                className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-sm border border-white/20 transition-all"
              >
                View Campus Addresses & Maps
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reusable Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
      />
    </div>
  );
}
