'use client';

import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Loader2, Send } from 'lucide-react';
import { SYNTHETIC_BRANCHES, SYNTHETIC_COURSES } from '@/lib/mockData';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCourseSlug?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  preselectedCourseSlug,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(preselectedCourseSlug || 'spoken-english');
  const [selectedBranch, setSelectedBranch] = useState('br-dhaka');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          phone,
          email: email || undefined,
          courseSlug: selectedCourse,
          branchId: selectedBranch,
          message: message || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error || 'Failed to submit enquiry.');
        if (result.errors) {
          setFieldErrors(result.errors);
        }
        setIsSubmitting(false);
        return;
      }

      setConfirmationCode(result.referenceCode);
      setIsSuccess(true);
    } catch {
      setErrorMessage('Network error occurred. Unable to reach LPC admissions server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setErrorMessage(null);
    setFieldErrors({});
    setConfirmationCode(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setMessage('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
    >
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 id="enquiry-modal-title" className="text-xl font-bold text-slate-900">
                Enquiry Received Successfully
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Thank you, <strong className="text-slate-800">{fullName}</strong>. An LPC admissions advisor from the selected branch will contact you within 1 business day.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 max-w-xs mx-auto text-xs text-slate-600">
              <div className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold">Reference Code</div>
              <div className="text-base font-mono font-bold text-lpc-navy-900">{confirmationCode}</div>
              <div className="mt-1 text-slate-500">Branch: {SYNTHETIC_BRANCHES.find(b => b.id === selectedBranch)?.name}</div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 bg-lpc-navy-800 text-white font-semibold rounded-lg hover:bg-lpc-navy-900 transition-colors text-sm"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-lpc-gold-600">Direct Admissions Support</div>
              <h2 id="enquiry-modal-title" className="text-2xl font-bold text-lpc-navy-900">
                Course Admission Enquiry
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Submit your query below. Our counselors will share current term schedules, placement test slots, and fee structures.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2.5 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="enq-fullname">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="enq-fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Tanzim Ahmed"
                  className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-lpc-gold-500 ${
                    fieldErrors.fullName ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                  }`}
                />
                {fieldErrors.fullName && (
                  <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.fullName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="enq-phone">
                    Phone / Mobile <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="enq-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-lpc-gold-500 ${
                      fieldErrors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {fieldErrors.phone && (
                    <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="enq-email">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="enq-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="learner@example.com"
                    className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-lpc-gold-500 ${
                      fieldErrors.email ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300'
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="enq-course">
                    Course of Interest
                  </label>
                  <select
                    id="enq-course"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-lpc-gold-500"
                  >
                    {SYNTHETIC_COURSES.map((course) => (
                      <option key={course.slug} value={course.slug}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="enq-branch">
                    Preferred Campus / Branch
                  </label>
                  <select
                    id="enq-branch"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-lpc-gold-500"
                  >
                    {SYNTHETIC_BRANCHES.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="enq-message">
                  Specific Questions or English Proficiency Goals
                </label>
                <textarea
                  id="enq-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your learning objectives, preferred timings, or target band score..."
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-lpc-gold-500 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-lpc-navy-800 hover:bg-lpc-navy-900 text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Admission Enquiry</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center leading-normal">
                Your contact details are encrypted and accessed solely by LPC admissions coordinators.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
