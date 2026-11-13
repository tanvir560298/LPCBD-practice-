'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Tag,
} from 'lucide-react';

export default function BlogPage() {
  const articles = [
    {
      id: 1,
      title: 'Overcoming Speaking Anxiety in the Communicative English Classroom',
      category: 'Pedagogy & Fluency',
      date: '10 November 2026',
      readTime: '5 min read',
      excerpt: 'Practical strategies for adult ESL learners to handle performance pressure during impromptu talks and peer discussions.',
    },
    {
      id: 2,
      title: 'Unpacking IELTS Academic Writing Task 2: Cohesion vs. Vocabulary',
      category: 'Test Preparation',
      date: '28 October 2026',
      readTime: '7 min read',
      excerpt: 'Why high-scoring IELTS essays prioritize clear logical staging over needlessly obscure vocabulary words.',
    },
    {
      id: 3,
      title: 'The Role of Phonetics and Word Stress in Clear Pronunciation',
      category: 'Phonology',
      date: '15 October 2026',
      readTime: '4 min read',
      excerpt: 'How understanding rhythm and reduced vowels unlocks natural, fatigue-free spoken English for Bangladeshi speakers.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-lpc-navy-50 text-lpc-navy-800 rounded-full text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>ELT Insights & Resources</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-lpc-navy-900 tracking-tight">
          LPC Academic Blog & Language Articles
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Pedagogical perspectives, study strategies, and linguistic commentary authored by LPC trainers and language education specialists.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((art) => (
          <article
            key={art.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700">
                  {art.category}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{art.readTime}</span>
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900 hover:text-lpc-navy-800 transition-colors">
                {art.title}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                {art.excerpt}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{art.date}</span>
              </div>
              <span className="font-bold text-lpc-navy-800 hover:underline">
                Read Article &rarr;
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
