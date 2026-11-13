'use client';

import React from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Sparkles,
  GraduationCap,
  Award,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function StudentStoriesPage() {
  const stories = [
    {
      name: 'Tanzila Akhter',
      course: 'Spoken English & Fluency',
      campus: 'Dhaka Main Campus',
      quote: 'I used to struggle with stage fright whenever I had to speak in English during university seminars. At LPC, the interactive communicative pods allowed me to practice without judgment. The phonetics drills corrected my syllable stress, and within two months, I could present confidently.',
      outcome: 'Secured first place in Inter-University English Presentation Symposium.',
    },
    {
      name: 'Abrar Hossain',
      course: 'IELTS Academic Intensive',
      campus: 'Chattogram Center',
      quote: 'Writing Task 2 had been my major bottleneck in previous attempts. The mock exams at LPC offered precise rubric feedback on coherence and lexical resource. Dr. Anisur and Shahana ma’am showed me how to construct logical body paragraphs under timed conditions.',
      outcome: 'Achieved Overall Band Score 7.5 with 7.0 in Academic Writing.',
    },
    {
      name: 'Fatima Tuz Zohra',
      course: 'Executive Business Communication',
      campus: 'Dhaka Campus (Hybrid)',
      quote: 'Working with international development agencies requires concise, nuanced correspondence. This course bridged my grammatical knowledge with pragmatic workplace diplomacy. The simulation meetings gave me immediate actionable feedback.',
      outcome: 'Promoted to Senior Communications Officer.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-lpc-navy-50 text-lpc-navy-800 rounded-full text-xs font-semibold">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Learner Journeys</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-lpc-navy-900 tracking-tight">
          Student Success Stories & Reflections
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Real learning outcomes from students who transformed their language proficiency, academic opportunities, and professional careers through LPC programs.
        </p>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stories.map((story, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-7 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-lpc-navy-800 text-white font-bold text-sm flex items-center justify-center">
                  {story.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{story.name}</h2>
                  <div className="text-xs text-slate-500">{story.course}</div>
                  <div className="text-[11px] text-lpc-gold-600 font-medium">{story.campus}</div>
                </div>
              </div>

              <blockquote className="text-xs sm:text-sm text-slate-600 italic leading-relaxed pt-2 border-t border-slate-100">
                &ldquo;{story.quote}&rdquo;
              </blockquote>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">{story.outcome}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          Prototype Note: Student reflections shown here represent realistic synthetic learning trajectories. Verified alumni testimonials with formal media release consent will be published following administrative review.
        </span>
      </div>

      <div className="pt-2 flex items-center gap-4">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-lpc-navy-800 text-white rounded-xl text-xs font-bold hover:bg-lpc-navy-900 transition-colors"
        >
          <span>Find Your Course</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/community/alumni"
          className="text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          Explore Alumni Network &rarr;
        </Link>
      </div>
    </div>
  );
}
