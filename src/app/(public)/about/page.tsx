'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Award,
  Users,
  Compass,
  CheckCircle,
  Building2,
  Info,
  ArrowRight,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-lpc-navy-50 text-lpc-navy-800 rounded-full text-xs font-semibold">
          <Building2 className="w-3.5 h-3.5" />
          <span>About LPC Bangladesh</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-lpc-navy-900 tracking-tight">
          Pioneering Communicative Language Teaching in Bangladesh
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Founded to bridge the divide between theoretical grammar instruction and real-world communicative competence, Language Proficiency Center (LPC) has served students, educators, and institutions across the nation.
        </p>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-lpc-navy-100 text-lpc-navy-800 flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Our Academic Mission</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To empower Bangladeshi learners of all socio-economic backgrounds with practical, spontaneous, and globally recognized English communication abilities through learner-centered communicative language pedagogy.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-10 h-10 rounded-xl bg-lpc-gold-100 text-lpc-gold-800 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Our Pedagogical Vision</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To serve as Bangladesh’s foremost center of excellence in English language education, teacher training, and institutional capacity building, aligned with CEFR benchmarks and international academic standards.
          </p>
        </div>
      </div>

      {/* Historical Milestones & Programs */}
      <section className="bg-slate-100 rounded-3xl p-8 sm:p-10 border border-slate-200 space-y-6">
        <div className="max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-wider text-lpc-gold-600">
            Institutional Legacy
          </div>
          <h2 className="text-2xl font-bold text-lpc-navy-900 mt-1">
            Core Pillars of LPC Operation
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-slate-900">Communicative Fluency</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Replacing rote grammar translation with spontaneous conversation, public presentation, and debate practice.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-slate-900">Access & Social Impact</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Implementing regional cohorts of the English Access Microscholarship Program in partnership with international sponsors.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
            <h3 className="text-sm font-bold text-slate-900">Integrated Schooling</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Operating LPC Laboratory Schools in Dhaka and Rajshahi to instill bilingual confidence from early childhood.
            </p>
          </div>
        </div>
      </section>

      {/* Pending Owner Content Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Institutional Content Verification Register:</span>
          <span>
            Detailed historical founding dates, legal charter documents, and bilateral partner agreements are tracked for formal LPC owner sign-off.
          </span>
        </div>
      </div>

      {/* Next Links */}
      <div className="pt-4 flex flex-wrap gap-4">
        <Link
          href="/about/leadership"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-lpc-navy-800 text-white rounded-xl text-xs font-bold hover:bg-lpc-navy-900 transition-colors"
        >
          <span>Meet the Board of Directors</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/teachers"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
        >
          <span>View Faculty & Teachers</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

