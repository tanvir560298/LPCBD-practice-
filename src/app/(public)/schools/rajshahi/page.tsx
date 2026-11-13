'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  BookOpen,
  ShieldAlert,
} from 'lucide-react';

export default function RajshahiSchoolPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Breadcrumb & Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <span>/</span>
          <Link href="/schools" className="hover:text-slate-900">LPC Schools</Link>
          <span>/</span>
          <span className="text-lpc-navy-900 font-semibold">Rajshahi Campus</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-lpc-navy-900 tracking-tight">
          LPC Laboratory School & College, Rajshahi
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Nurturing academic achievement, moral character, and communicative fluency in Rajshahi Division through dedicated faculty and modern learning labs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Division Academic Focus</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Serving the historic educational division of Rajshahi, the school integrates standard curriculum textbooks with intensive spoken English practice, science laboratory exploration, and sports activities.
            </p>
          </section>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Rajshahi school administration contacts and admission test routines are awaiting formal validation from the regional campus head.
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Rajshahi Admissions Office
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Ghoramara, Boalia, Rajshahi-6100</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>+880 1712-000000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>rajshahi.school@lpcbd.org</span>
              </div>
            </div>

            <Link
              href="/contact"
              className="block w-full py-2.5 bg-lpc-navy-800 hover:bg-lpc-navy-900 text-white font-bold rounded-lg text-xs text-center transition-colors"
            >
              Contact Admissions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

