'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-14 h-14 rounded-2xl bg-lpc-navy-100 text-lpc-navy-800 flex items-center justify-center mx-auto">
        <Mail className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-lpc-navy-900">
          LPC Academic Bulletin & Intake Notices
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto">
          Subscribe to receive quarterly ELT pedagogical articles, course term calendars, and public workshop announcements.
        </p>
      </div>

      {submitted ? (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl max-w-md mx-auto space-y-2 text-emerald-900">
          <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
          <h2 className="text-base font-bold">Subscription Confirmed</h2>
          <p className="text-xs text-emerald-700">
            Thank you! You will receive our next quarterly bulletin at <strong>{email}</strong>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address..."
            className="flex-1 px-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-lpc-gold-500"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-lpc-navy-800 hover:bg-lpc-navy-900 text-white font-bold rounded-xl text-sm transition-colors"
          >
            Subscribe
          </button>
        </form>
      )}

      <div className="pt-4">
        <Link href="/" className="text-xs text-slate-500 hover:text-slate-800 underline">
          &larr; Return to Home
        </Link>
      </div>
    </div>
  );
}
