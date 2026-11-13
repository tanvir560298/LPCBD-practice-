'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle,
  ShieldAlert,
} from 'lucide-react';
import { BrandWordmark } from './BrandWordmark';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes('@')) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-lpc-navy-950 text-slate-300 border-t border-lpc-navy-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-lpc-navy-900">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 space-y-5">
            <BrandWordmark variant="light" size="md" />

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Language Proficiency Center (LPC) is a pioneering institution in Bangladesh dedicated to English language pedagogy, communicative fluency, test preparation, and teacher development.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-lpc-gold-400 mb-2">
                Academic Newsletter & Intake Notices
              </div>
              {subscribed ? (
                <div className="flex items-center gap-2 p-3 bg-lpc-navy-900 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Subscribed! You will receive new term schedules and workshop notices.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-3.5 py-2 text-xs bg-lpc-navy-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lpc-gold-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-lpc-gold-500 hover:bg-lpc-gold-600 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 1: Academic Programs */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Courses & Programs
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/courses" className="hover:text-lpc-gold-400 transition-colors">
                  All Courses Overview
                </Link>
              </li>
              <li>
                <Link href="/courses/spoken-english" className="hover:text-lpc-gold-400 transition-colors">
                  Spoken English & Fluency
                </Link>
              </li>
              <li>
                <Link href="/courses/ielts-preparation" className="hover:text-lpc-gold-400 transition-colors">
                  IELTS Academic & General
                </Link>
              </li>
              <li>
                <Link href="/courses/english-for-professionals" className="hover:text-lpc-gold-400 transition-colors">
                  Executive Business English
                </Link>
              </li>
              <li>
                <Link href="/courses/english-for-teens" className="hover:text-lpc-gold-400 transition-colors">
                  English for Teens
                </Link>
              </li>
              <li className="pt-2 border-t border-lpc-navy-900">
                <Link href="/programs/access" className="text-lpc-gold-400 hover:underline">
                  English Access Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Institution & Schools */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              About & Schools
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-lpc-gold-400 transition-colors">
                  Institutional Overview
                </Link>
              </li>
              <li>
                <Link href="/about/leadership" className="hover:text-lpc-gold-400 transition-colors">
                  Board of Directors
                </Link>
              </li>
              <li>
                <Link href="/teachers" className="hover:text-lpc-gold-400 transition-colors">
                  Faculty & Teachers
                </Link>
              </li>
              <li className="pt-2 border-t border-lpc-navy-900">
                <Link href="/schools" className="hover:text-lpc-gold-400 transition-colors">
                  LPC Laboratory Schools
                </Link>
              </li>
              <li>
                <Link href="/schools/dhaka" className="hover:text-lpc-gold-400 transition-colors">
                  Dhaka Lab School & College
                </Link>
              </li>
              <li>
                <Link href="/schools/rajshahi" className="hover:text-lpc-gold-400 transition-colors">
                  Rajshahi Lab School & College
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Community & Portal */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Community & Portal
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/community/stories" className="hover:text-lpc-gold-400 transition-colors">
                  Student Success Stories
                </Link>
              </li>
              <li>
                <Link href="/community/alumni" className="hover:text-lpc-gold-400 transition-colors">
                  Alumni Network
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-lpc-gold-400 transition-colors">
                  ELT Articles & News
                </Link>
              </li>
              <li>
                <Link href="/branches" className="hover:text-lpc-gold-400 transition-colors">
                  Campus Branches
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-lpc-gold-400 transition-colors">
                  Contact Admissions
                </Link>
              </li>
              <li className="pt-2 border-t border-lpc-navy-900">
                <Link
                  href="/portal"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-lpc-navy-800 hover:bg-lpc-navy-700 text-white rounded font-medium border border-lpc-navy-700"
                >
                  <Lock className="w-3 h-3 text-lpc-gold-400" />
                  <span>Teacher Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Campuses & Contact Summary */}
        <div className="py-6 border-b border-lpc-navy-900 text-xs text-slate-400 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="font-semibold text-white mb-0.5">Dhaka Main Campus</div>
            <p>House 42, Road 9/A, Dhanmondi R/A, Dhaka-1209</p>
          </div>
          <div>
            <div className="font-semibold text-white mb-0.5">Chattogram Center</div>
            <p>Agrabad Commercial Area, Chattogram-4100</p>
          </div>
          <div>
            <div className="font-semibold text-white mb-0.5">Rajshahi Branch</div>
            <p>Ghoramara, Boalia, Rajshahi-6100</p>
          </div>
          <div>
            <div className="font-semibold text-white mb-0.5">Cox&apos;s Bazar Center</div>
            <p>Main Road, Jhawtala, Cox&apos;s Bazar-4700</p>
          </div>
        </div>

        {/* Bottom Disclaimers */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-center md:text-left">
            <ShieldAlert className="w-4 h-4 text-lpc-gold-400 shrink-0" />
            <p>
              Provisional synthetic implementation for structural review. Course details, faculty profiles, and student data are synthetic placeholders. Official assets and policies await LPC verification.
            </p>
          </div>

          <div className="text-slate-400 shrink-0">
            &copy; {new Date().getFullYear()} Language Proficiency Center (LPC), Bangladesh.
          </div>
        </div>
      </div>
    </footer>
  );
};
