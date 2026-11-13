'use client';

import React, { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  GraduationCap,
  HelpCircle,
  Info,
  MapPin,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react';
import { SYNTHETIC_COURSES, SYNTHETIC_BRANCHES, SYNTHETIC_TEACHERS } from '@/lib/mockData';
import { EnquiryModal } from '@/components/public/EnquiryModal';

export default function CourseDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const course = SYNTHETIC_COURSES.find((c) => c.slug === slug);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Course Not Found</h1>
        <p className="text-sm text-slate-500">
          The requested course module does not exist or has been updated in our catalog.
        </p>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-4 py-2 bg-lpc-navy-800 text-white rounded-lg text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to All Courses</span>
        </Link>
      </div>
    );
  }

  const assignedBranches = SYNTHETIC_BRANCHES.filter((b) =>
    course.branchIds.includes(b.id)
  );

  return (
    <div className="space-y-12 pb-20">
      {/* Breadcrumb and Header */}
      <div className="bg-lpc-navy-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-300">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/courses" className="hover:text-white">Courses</Link>
            <span>/</span>
            <span className="text-lpc-gold-400 font-medium truncate">{course.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-lpc-gold-400/20 text-lpc-gold-300 border border-lpc-gold-400/40 text-xs font-bold">
              {course.category}
            </span>
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.durationWeeks} Weeks • {course.totalHours} Guided Hours</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white max-w-4xl">
            {course.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            {course.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setEnquiryModalOpen(true)}
              className="px-6 py-3 bg-lpc-gold-400 hover:bg-lpc-gold-500 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
            >
              <span>Enquire & Apply for Admission</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href="/courses"
              className="px-4 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-sm border border-white/20 transition-all"
            >
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Left Column: Syllabus & Learning Outcomes */}
          <div className="lg:col-span-8 space-y-10">
            {/* Learning Outcomes */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-lpc-navy-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-lpc-gold-500" />
                <span>What You Will Master</span>
              </h2>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {course.learningOutcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Weekly Syllabus Breakdown */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-lpc-navy-900 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-lpc-navy-700" />
                  <span>Curriculum & Weekly Breakdown</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Each module blends communicative practice drills, vocabulary extension, and diagnostic assessment.
                </p>
              </div>

              <div className="space-y-4">
                {course.syllabus.map((item) => (
                  <div
                    key={item.week}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-lpc-navy-100 text-lpc-navy-900 font-mono font-bold text-xs rounded">
                        Week {item.week}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
                        {item.topic}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600 pl-1 leading-relaxed">
                      {item.details}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Teaching Faculty Overview */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-lpc-navy-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-lpc-navy-700" />
                <span>Instructors & Academic Specialists</span>
              </h2>
              <p className="text-xs text-slate-500">
                Courses are conducted by certified ELT professionals holding advanced degrees in Applied Linguistics and British Council / Cambridge teaching certifications.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {SYNTHETIC_TEACHERS.slice(0, 2).map((teacher) => (
                  <div key={teacher.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-lpc-navy-800 text-white flex items-center justify-center font-bold text-sm">
                      {teacher.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{teacher.fullName}</div>
                      <div className="text-xs text-slate-500">{teacher.department}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar: Key Metadata, Schedules, Fee Notice & Enquiry Form */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Fact Box */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
              <h3 className="text-base font-bold text-lpc-navy-900 border-b border-slate-100 pb-3">
                Course Specifications
              </h3>

              <div className="space-y-3.5 text-xs text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800 block mb-0.5">Eligibility & Level:</span>
                  <span>{course.level}</span>
                </div>

                <div>
                  <span className="font-semibold text-slate-800 block mb-0.5">Prerequisites:</span>
                  <span>{course.prerequisites}</span>
                </div>

                <div>
                  <span className="font-semibold text-slate-800 block mb-0.5">Duration & Hours:</span>
                  <span>{course.durationWeeks} Weeks ({course.totalHours} Guided Classroom Hours)</span>
                </div>

                <div>
                  <span className="font-semibold text-slate-800 block mb-1">Available Schedules:</span>
                  <ul className="space-y-1">
                    {course.scheduleOptions.map((opt, i) => (
                      <li key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-700">
                        {opt}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-semibold text-slate-800 block mb-1">Offered At Campuses:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {assignedBranches.map((b) => (
                      <span key={b.id} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
                        {b.city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fee Notice with Owner Confirmation Warning per brief */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Tuition & Fee Policy:</span>
                    <span className="text-[11px] text-amber-800 leading-normal">
                      {course.feeProvisionalNote} Exact fees and scholarship waiver policies are subject to official LPC administrative confirmation.
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEnquiryModalOpen(true)}
                className="w-full py-3 bg-lpc-navy-800 hover:bg-lpc-navy-900 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Enquire About Next Batch</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Helpdesk Contacts */}
            <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="font-bold text-slate-800 text-sm">Have Questions?</div>
              <p>Our admissions desk is available Saturday to Thursday, 9:00 AM - 6:00 PM BST.</p>
              <div className="pt-1 font-semibold text-lpc-navy-900">
                Direct Hotline: +880 1711-000000
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reusable Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        preselectedCourseSlug={course.slug}
      />
    </div>
  );
}

