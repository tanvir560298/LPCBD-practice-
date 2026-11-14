'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Phone,
  Calendar,
  Check,
} from 'lucide-react';
import { SYNTHETIC_COURSES, SYNTHETIC_BRANCHES } from '@/lib/mockData';
import { HomeProgramBanner } from '@/components/public/ProgramUpdates';
import { EnquiryModal } from '@/components/public/EnquiryModal';
import { HeroPhotoCarousel } from '@/components/public/HeroPhotoCarousel';

const COURSE_IMAGES: Record<string, string> = {
  'spoken-english': '/assets/images/showcase/lpc-activity-2.jpg',
  'ielts-preparation': '/assets/images/course-ielts.svg',
  'english-for-professionals': '/assets/images/showcase/lpc-activity-3.jpg',
  'english-for-teens': '/assets/images/course-teens.svg',
};

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; bar: string }> = {
  'Spoken English': { bg: 'bg-lpc-navy-50', text: 'text-lpc-navy-900', border: 'border-lpc-navy-200', bar: 'bg-lpc-navy-600' },
  'Test Preparation': { bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-300', bar: 'bg-lpc-gold-500' },
  'Professional Skills': { bg: 'bg-rose-50', text: 'text-rose-900', border: 'border-rose-200', bar: 'bg-lpc-crimson-600' },
  'Young Learners': { bg: 'bg-emerald-50', text: 'text-emerald-900', border: 'border-emerald-200', bar: 'bg-emerald-600' },
};

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
      a: 'We offer a complimentary 20-minute diagnostic placement test covering spoken fluency, listening, and practical grammar. Our academic coordinators evaluate your benchmark and recommend the exact module tailored to your proficiency and objectives.',
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
      {/* 1. HERO SECTION (LPC Academic Navy, Tri-Color Harmonies & Balanced Photography) */}
      <section className="relative bg-gradient-to-b from-slate-950 via-lpc-navy-950 to-lpc-navy-900 text-white border-b border-lpc-navy-800 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 overflow-hidden">
        {/* Ambient Subtle Tri-Color Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-lpc-navy-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-lpc-crimson-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-lpc-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Academic Proposition & Action (55% width) */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <HomeProgramBanner />
              {/* Logo Crimson 'C' Accent Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lpc-crimson-950/90 border border-lpc-crimson-500/40 text-lpc-crimson-200 text-xs font-bold tracking-wide shadow-xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lpc-crimson-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-lpc-crimson-500"></span>
                </span>
                <span>Admissions Open for Winter 2026 Term • All 4 Campuses</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
                Speak Confidently. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lpc-gold-400 via-amber-300 to-lpc-gold-500">
                  Excel Globally.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Language Proficiency Center (LPC) provides research-backed communicative English pedagogy, IELTS intensive masterclasses, and executive communication training across Bangladesh.
              </p>

              {/* Prioritized Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                {/* Logo Gold 'L' Primary Button */}
                <button
                  type="button"
                  onClick={() => setEnquiryModalOpen(true)}
                  className="px-6 py-3.5 bg-lpc-gold-400 hover:bg-lpc-gold-500 text-slate-950 font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm border border-lpc-gold-300"
                >
                  <span>Apply for Admission</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Secondary Button */}
                <Link
                  href="/courses"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl border border-white/20 shadow-xs transition-all flex items-center justify-center gap-2 text-sm backdrop-blur-xs"
                >
                  <BookOpen className="w-4 h-4 text-lpc-gold-400" />
                  <span>Explore Course Catalog</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-lpc-gold-400">4 Campuses</div>
                  <div className="text-xs text-slate-300 mt-0.5">Dhaka, CTG, Rajshahi, CXB</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white">CLT Pedagogy</div>
                  <div className="text-xs text-slate-300 mt-0.5">Communicative Practice</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-lpc-gold-400">Asia/Dhaka</div>
                  <div className="text-xs text-slate-300 mt-0.5">Timetable &amp; Roster Sync</div>
                </div>
              </div>
            </div>

            {/* Right Column: Balanced Classroom Photography with Tri-Color Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Visual Classroom Frame with subtle border & Auto-scrolling carousel */}
                <div className="rounded-2xl border-2 border-slate-700/80 shadow-2xl bg-slate-900/80 p-2.5 overflow-hidden backdrop-blur-xs">
                  <HeroPhotoCarousel />
                </div>

                {/* Floating Badge 1: Top Right */}
                <div className="absolute -top-4 -right-4 bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white rounded-xl px-3.5 py-2 shadow-xl hidden sm:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-lpc-gold-500/20 text-lpc-gold-400 flex items-center justify-center font-bold text-xs">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">CEFR Certified</div>
                    <div className="text-[10px] text-slate-400">Curriculum Standards A1–C1</div>
                  </div>
                </div>

                {/* Floating Badge 2: Bottom Left */}
                <div className="absolute -bottom-4 -left-4 bg-slate-900/95 backdrop-blur-md border border-slate-700 text-white rounded-xl px-3.5 py-2.5 shadow-xl hidden sm:flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-lpc-crimson-600/25 text-lpc-crimson-300 flex items-center justify-center font-bold text-xs">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">Active Speaking Labs</div>
                    <div className="text-[10px] text-slate-400">15–20 Students per Cohort</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. COURSE CATALOG DISCOVERY (Distinct, Informative Course Cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Academic Catalog</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured English Programs &amp; Masterclasses
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Targeted communicative courses designed for career growth, international higher education, and foundational school readiness.
            </p>
          </div>

          {/* Segmented Audience Filter Buttons */}
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setSelectedAudience('all')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedAudience === 'all'
                  ? 'bg-white text-lpc-navy-950 shadow-xs'
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
                  ? 'bg-white text-lpc-navy-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Adults &amp; Fluency
            </button>
            <button
              type="button"
              onClick={() => setSelectedAudience('test')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedAudience === 'test'
                  ? 'bg-white text-lpc-navy-950 shadow-xs'
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
                  ? 'bg-white text-lpc-navy-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Young Learners
            </button>
          </div>
        </div>

        {/* Distinct, Informative Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course) => {
            const catStyle = CATEGORY_STYLES[course.category] || { bg: 'bg-slate-50', text: 'text-slate-800', border: 'border-slate-200' };
            const imgSrc = COURSE_IMAGES[course.slug] || '/assets/images/course-spoken-english.svg';

            return (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Tri-Color Top Accent Bar */}
                <div className={`h-1.5 w-full ${catStyle.bar}`} />

                <div>
                  {/* Thematic Thumbnail Visual */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                    <img
                      src={imgSrc}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border shadow-xs ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                        {course.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-lpc-navy-900 transition-colors line-clamp-1">
                      <Link href={`/courses/${course.slug}`}>
                        {course.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {course.summary}
                    </p>

                    {/* Metadata Grid */}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Duration:</span>
                        </span>
                        <span className="font-semibold text-slate-800">{course.durationWeeks} Weeks ({course.totalHours} hrs)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                          <span>Target Level:</span>
                        </span>
                        <span className="font-semibold text-slate-800">{course.level.split(' ')[0]}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>Locations:</span>
                        </span>
                        <span className="font-semibold text-slate-800">{course.branchIds.length} Campuses</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="text-xs font-bold text-lpc-navy-800 hover:text-lpc-navy-950 flex items-center gap-1"
                  >
                    <span>Syllabus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setEnquiryModalOpen(true)}
                    className="px-3 py-1.5 bg-lpc-gold-400 hover:bg-lpc-gold-500 text-slate-950 font-bold text-xs rounded-lg shadow-2xs transition-colors"
                  >
                    Enquire Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition-colors"
          >
            <span>View Full Academic Catalog with Weekly Syllabus Modules</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. TEACHING PEDAGOGY & PHILOSOPHY */}
      <section className="bg-slate-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-lpc-gold-400 uppercase tracking-widest">
              LPC Pedagogy Framework
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Communicative Language Teaching (CLT) Standard
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Moving beyond rote grammatical memorization toward spontaneous speech production, phonological clarity, and real-world discourse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-lpc-gold-400/20 text-lpc-gold-400 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Diagnostic Placement Benchmarking</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Before enrolment, every learner takes an individualized diagnostic assessment. We benchmark phonetic clarity, listening retention, and structural accuracy against CEFR descriptors.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Active Speaking Time</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cohort sizes are capped at 15–20 learners. Over 70% of class time is dedicated to guided dialogues, extempore presentations, and debate sessions rather than passive listening.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-400/20 text-blue-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Session Roster &amp; Viva Audits</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                All attendance is tracked in Asia/Dhaka time. Students undergo recorded mid-term and final viva voce evaluations to measure authentic spoken fluency progression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ENGLISH ACCESS MICROSCHOLARSHIP HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-lpc-navy-950 via-lpc-navy-900 to-lpc-navy-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lpc-gold-400/20 border border-lpc-gold-400/40 text-lpc-gold-300 text-xs font-bold">
                <span>National Impact Initiative</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                English Access Microscholarship Program
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                For over a decade, LPC has administered the flagship English Access Program in Bangladesh. Providing foundational English language skills, digital literacy, and leadership training to talented youth from underserved communities.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/programs/access"
                  className="px-5 py-2.5 bg-lpc-gold-400 hover:bg-lpc-gold-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <span>Read Access Program Report</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="text-xs text-slate-400 flex items-center">
                  <span>Merit-based scholarship selection • 2-Year Program</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl aspect-[4/3] group bg-slate-900">
                <img
                  src="/assets/images/showcase/lpc-activity-1.jpg"
                  alt="LPC English Access Microscholarship Program - Student Cohort & Leadership Celebration"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent flex items-end p-4">
                  <div className="text-xs text-slate-200 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                    <span>English Access Scholars &amp; Leadership Cohort</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VERIFIED STUDENT REFLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 uppercase tracking-widest">
            Alumni Outcomes
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Verified Student Reflections &amp; Journeys
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real outcomes from graduates across corporate workplaces, university programs, and international test examinations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-1 text-lpc-gold-500">
              {'★★★★★'.split('').map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
            <p className="text-xs text-slate-700 italic leading-relaxed">
              &quot;The communicative dialogues eliminated my chronic hesitation. Before joining LPC, I could write English passably, but speaking during job interviews caused immense anxiety. Today I lead client communications with global partners daily.&quot;
            </p>
            <div className="pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-900">Tanvir Ahmed Chowdhury</div>
              <div className="text-[11px] text-slate-500">Spoken English Batch 42 Graduate • Dhaka Campus</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-1 text-lpc-gold-500">
              {'★★★★★'.split('').map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
            <p className="text-xs text-slate-700 italic leading-relaxed">
              &quot;The timed mock exams and individual Academic Writing feedback allowed me to jump from Band 6.0 to 7.5 within 10 weeks. The examiners did not merely give generic advice; they broke down my coherence and lexical resource line by line.&quot;
            </p>
            <div className="pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-900">Nusrat Jahan</div>
              <div className="text-[11px] text-slate-500">IELTS Intensive Candidate • Overall Band 7.5</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-1 text-lpc-gold-500">
              {'★★★★★'.split('').map((s, i) => (
                <span key={i}>{s}</span>
              ))}
            </div>
            <p className="text-xs text-slate-700 italic leading-relaxed">
              &quot;As an English Access scholar, LPC gave me an unshakeable platform. The training in critical thinking, presentation delivery, and digital literacy enabled me to secure a university admission and pursue my bachelor&apos;s degree in linguistics.&quot;
            </p>
            <div className="pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-900">Abrar Hossain</div>
              <div className="text-[11px] text-slate-500">English Access Microscholarship Alum • Rajshahi Center</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. REGIONAL CAMPUSES & BRANCHES */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Regional Learning Centers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Campuses Across Bangladesh
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Modern air-conditioned classrooms, dedicated multimedia language labs, and reference library facilities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SYNTHETIC_BRANCHES.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-lpc-navy-900 bg-lpc-navy-50 px-2 py-0.5 rounded">
                    {b.code}
                  </span>
                  {b.isMainCampus && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Main Campus
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{b.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {b.address}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{b.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. ADMISSIONS FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 space-y-2">
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 uppercase tracking-widest">
            Admissions Assistance
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Key details regarding diagnostic benchmarking, scheduling options, and certification.
          </p>
        </div>

        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 text-left font-bold text-sm text-slate-900 hover:text-lpc-navy-900 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-90 text-lpc-navy-900' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed pr-6 animate-in fade-in duration-150">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Shared Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
      />
    </div>
  );
}
