'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Compass,
  ArrowRight,
  Building2,
  Info,
} from 'lucide-react';
import { SYNTHETIC_BRANCHES } from '@/lib/mockData';

export default function BranchesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-lpc-navy-50 text-lpc-navy-800 rounded-full text-xs font-semibold">
          <Building2 className="w-3.5 h-3.5" />
          <span>Regional Presence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-lpc-navy-900 tracking-tight">
          LPC Campus & Learning Center Network
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Language Proficiency Center maintains physical campuses and language labs across Dhaka, Chattogram, Rajshahi, and Cox&apos;s Bazar, serving students and local institutional partners.
        </p>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SYNTHETIC_BRANCHES.map((branch) => (
          <div
            key={branch.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-7 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-lpc-navy-50 text-lpc-navy-800 border border-lpc-navy-200">
                  {branch.code} • {branch.city}
                </span>
                {branch.isMainCampus && (
                  <span className="text-xs font-bold text-lpc-gold-700 bg-lpc-gold-50 border border-lpc-gold-200 px-2.5 py-0.5 rounded-full">
                    Main Academic Campus
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {branch.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-lpc-navy-600 shrink-0 mt-0.5" />
                  <span>{branch.address}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800">{branch.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{branch.email}</span>
                </div>
                <div className="sm:col-span-2 flex items-center gap-2 text-slate-500 pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Admissions: Sat – Thu, 9:00 AM – 6:00 PM BST</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/contact"
                className="text-xs font-bold text-lpc-navy-800 hover:text-lpc-navy-950 flex items-center gap-1"
              >
                <span>Direct Campus Inquiry &rarr;</span>
              </Link>
              <Link
                href="/courses"
                className="text-xs font-bold text-lpc-gold-600 hover:text-lpc-gold-700"
              >
                Available Batches
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Verification Register Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span>
          Branch addresses and active local offerings are sourced from legacy documentation and are subject to final owner verification before public production deployment.
        </span>
      </div>
    </div>
  );
}

