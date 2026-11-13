'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building,
} from 'lucide-react';
import { SYNTHETIC_BRANCHES, SYNTHETIC_COURSES } from '@/lib/mockData';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('br-dhaka');
  const [courseSlug, setCourseSlug] = useState('spoken-english');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    setLoading(true);
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: name,
          phone,
          email: email || undefined,
          courseSlug,
          branchId: branch,
          message: message || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Failed to submit inquiry.');
        if (result.errors) {
          setFieldErrors(result.errors);
        }
        setLoading(false);
        return;
      }

      setReferenceCode(result.referenceCode);
      setSubmitted(true);
    } catch {
      setError('Network communication failed. Please check your connection or contact our helpline directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-lpc-navy-50 text-lpc-navy-800 rounded-full text-xs font-semibold">
          <Phone className="w-3.5 h-3.5" />
          <span>Admissions & Inquiries</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-lpc-navy-900 tracking-tight">
          Contact LPC Admissions & Campuses
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Connect with our academic counselors across our regional branches for course diagnostics, term schedules, or institutional collaborations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Message Delivered Successfully</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Thank you, <strong className="text-slate-800">{name}</strong>. An LPC admissions advisor from the selected branch will respond to you within 24 hours.
              </p>
              {referenceCode && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 max-w-xs mx-auto text-xs text-slate-600">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Tracking Reference</span>
                  <span className="text-base font-mono font-bold text-lpc-navy-900">{referenceCode}</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setPhone('');
                  setEmail('');
                  setMessage('');
                  setReferenceCode(null);
                }}
                className="mt-4 px-5 py-2.5 bg-lpc-navy-800 text-white rounded-lg text-xs font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Send an Admissions Inquiry</h2>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="cf-name">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="cf-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tanzim Ahmed"
                    className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-lpc-gold-500 ${
                      fieldErrors.fullName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {fieldErrors.fullName && (
                    <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="cf-phone">
                    Phone / Mobile <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="cf-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-lpc-gold-500 ${
                      fieldErrors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {fieldErrors.phone && (
                    <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="cf-email">
                    Email Address
                  </label>
                  <input
                    id="cf-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="learner@example.com"
                    className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-lpc-gold-500 ${
                      fieldErrors.email ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="cf-branch">
                    Target Branch
                  </label>
                  <select
                    id="cf-branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-lpc-gold-500"
                  >
                    {SYNTHETIC_BRANCHES.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="cf-course">
                  Course of Interest
                </label>
                <select
                  id="cf-course"
                  value={courseSlug}
                  onChange={(e) => setCourseSlug(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-lpc-gold-500"
                >
                  {SYNTHETIC_COURSES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="cf-message">
                  Your Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="cf-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide any specific requirements, current proficiency level, or question..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-lpc-gold-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-lpc-navy-800 hover:bg-lpc-navy-900 text-white font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Inquiry to Admissions...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Regional Branches Contact Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Admissions Central Helpdesk</h2>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-lpc-navy-700" />
                <span className="font-semibold text-slate-800">+880 1711-000000 / +880 1712-000000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-lpc-navy-700" />
                <span>info@lpcbd.org / admissions@lpcbd.org</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-lpc-navy-700" />
                <span>Office Hours: Saturday – Thursday, 9:00 AM – 6:00 PM BST</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Campus Locations
            </h3>
            {SYNTHETIC_BRANCHES.map((b) => (
              <div key={b.id} className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs">
                <div className="font-bold text-slate-900">{b.name}</div>
                <div className="text-slate-500 text-[11px] mt-0.5">{b.address}</div>
                <div className="text-slate-700 font-medium mt-1">{b.phone}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
