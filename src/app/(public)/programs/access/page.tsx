'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Award,
  BookOpen,
  Users,
  CheckCircle,
  ShieldAlert,
  ArrowRight,
  GraduationCap,
  HeartHandshake,
} from 'lucide-react';

export default function AccessProgramPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-lpc-gold-100 text-lpc-gold-900 border border-lpc-gold-300 rounded-full text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Microscholarship Initiative</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-lpc-navy-900 tracking-tight">
          English Access Microscholarship Program
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          The English Access Microscholarship Program provides a foundation of English language skills to bright, economically disadvantaged teenagers through after-school classes and intensive summer learning sessions.
        </p>
      </div>

      {/* Featured Cohort Photograph */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl aspect-[16/9] sm:aspect-[21/9] bg-slate-900 group">
        <img
          src="/assets/images/showcase/lpc-activity-1.jpg"
          alt="English Access Microscholarship Program - Student Cohort & Leadership Celebration"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lpc-gold-400 text-slate-950 text-xs font-bold w-fit mb-2 shadow-xs">
            <span>Official Access Cohort Celebration</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-extrabold text-white">
            Empowering Youth Through Communicative Fluency &amp; Civic Leadership
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Access scholars, LPC instructors, and distinguished guests celebrating graduation and completion of intensive English language modules.
          </p>
        </div>
      </div>

      {/* Distinction Alert: Scholarship vs Paid Courses */}
      <div className="p-5 bg-lpc-navy-50 border border-lpc-navy-200 rounded-2xl flex items-start gap-3.5 text-xs text-lpc-navy-900">
        <HeartHandshake className="w-5 h-5 text-lpc-navy-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-sm block text-lpc-navy-950">Important Eligibility Information</span>
          <p className="text-slate-600 leading-relaxed">
            The Access Program is a merit- and need-based scholarship initiative. It is completely distinct from LPC’s standard tuition-based public courses. Selection is conducted through dedicated regional school nominations and diagnostic interviews, and no admission fee is charged to enrolled scholarship recipients.
          </p>
        </div>
      </div>

      {/* Program Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-lpc-navy-100 text-lpc-navy-800 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">360+ Hours of Instruction</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Delivering two full academic years of communicative English classes, phonological training, and practical grammar exercises.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-lpc-gold-100 text-lpc-gold-800 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Leadership & Civic Projects</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Students engage in community service initiatives, tree plantation drives, and youth symposiums to build civic responsibility.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Digital & Tech Literacy</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Hands-on multimedia lab sessions fostering computer literacy, online research ethics, and slide presentation design.
          </p>
        </div>
      </div>

      {/* Classroom Environment & Hands-on Workshops */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
          <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
            <img
              src="/assets/images/showcase/lpc-activity-3.jpg"
              alt="LPC Multimedia Language Lab and Technology Sessions"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                Multimedia Lab
              </span>
            </div>
          </div>
          <div className="p-5 space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900">
              Interactive Multimedia Lectures &amp; Digital Drills
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Equipped with computer workstations, overhead projection, and digital language labs to enhance auditory comprehension and presentation delivery.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
          <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
            <img
              src="/assets/images/showcase/lpc-activity-2.jpg"
              alt="LPC Collaborative Student Projects & Communicative Workshops"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 text-lpc-gold-300 border border-lpc-gold-500/40 text-[10px] font-bold">
                Collaborative Workshop
              </span>
            </div>
          </div>
          <div className="p-5 space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900">
              Creative Poster Presentation &amp; Peer Learning
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Scholars work in small teams on environmental awareness, civic responsibility, and cultural topics, practicing spontaneous spoken dialogue.
            </p>
          </div>
        </div>
      </div>

      {/* Program Leadership & Coordination */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-emerald-500/80 ring-offset-4 ring-offset-white shadow-lg bg-slate-100 p-0.5">
              <img
                src="/assets/images/leadership/syed-nazrul-ahsan.jpg"
                alt="Syed Nazrul Ahsan, Lead Coordinator of English Access Program"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-slate-900 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/60 shadow-xs uppercase tracking-wider whitespace-nowrap">
              Coordinator
            </div>
          </div>
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-full text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Program Leadership</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Syed Nazrul Ahsan
            </h3>
            <div className="text-xs font-semibold text-lpc-navy-800">
              Lead Coordinator & Facilitator • English Access Microscholarship Program
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              Facilitating interactive communicative language workshops, youth leadership sessions, and academic cohort management in collaboration with the U.S. Embassy and Regional English Language Office (RELO).
            </p>
          </div>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          Current intake schedules, partner funding attribution, and regional eligibility quotas require formal verification with LPC program coordinators before open publication.
        </span>
      </div>

      {/* Return Links */}
      <div className="pt-2 flex items-center gap-4">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-lpc-navy-800 text-white rounded-xl text-xs font-bold hover:bg-lpc-navy-900 transition-colors"
        >
          <span>View Regular Public Courses</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/schools"
          className="text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          Discover LPC Laboratory Schools &rarr;
        </Link>
      </div>
    </div>
  );
}

