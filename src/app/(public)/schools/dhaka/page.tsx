'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  BookOpen,
  Calendar,
  CheckCircle,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';

export default function DhakaSchoolPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Breadcrumb & Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link href="/schools" className="hover:text-slate-900">LPC Schools</Link>
          <span>/</span>
          <span className="text-lpc-navy-900 font-semibold">Dhaka Campus</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-lpc-navy-900 tracking-tight">
          LPC Laboratory School & College, Dhaka
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Comprehensive academic schooling in Dhanmondi, Dhaka, fostering intellectual curiosity, ethical character, and natural bilingual fluency in Bangla and English.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Academic Structure & Facilities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="text-xs font-bold text-lpc-navy-800">Primary Wing</div>
                <div className="text-sm font-semibold text-slate-900">Playgroup to Class 5</div>
                <p className="text-xs text-slate-500">Focus on phonetics, communicative habits, and numeracy foundation.</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="text-xs font-bold text-lpc-navy-800">Secondary & College</div>
                <div className="text-sm font-semibold text-slate-900">Class 6 to Class 12</div>
                <p className="text-xs text-slate-500">Science, Business Studies & Humanities with multimedia language lab.</p>
              </div>
            </div>
          </section>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              School prospectus, uniform codes, and term examination routines are tracked in the Content Verification Register pending administrative confirmation.
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Dhaka Campus Admissions
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-lpc-navy-600 shrink-0 mt-0.5" />
                <span>House 42, Road 9/A, Dhanmondi R/A, Dhaka-1209</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>+880 1711-000000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>dhaka.school@lpcbd.org</span>
              </div>
            </div>

            <Link
              href="/contact"
              className="block w-full py-2.5 bg-lpc-navy-800 hover:bg-lpc-navy-900 text-white font-bold rounded-lg text-xs text-center transition-colors"
            >
              Contact School Office
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

