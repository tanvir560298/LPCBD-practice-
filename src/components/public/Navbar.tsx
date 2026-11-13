'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  Menu,
  X,
  Lock,
  Phone,
  Mail,
  GraduationCap,
  BookOpen,
  Users,
  MapPin,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { BrandWordmark } from './BrandWordmark';
import { EnquiryModal } from './EnquiryModal';

interface NavItem {
  title: string;
  href: string;
  description?: string;
}

interface NavGroup {
  label: string;
  href?: string;
  items: NavItem[];
}

const NAVIGATION_GROUPS: NavGroup[] = [
  {
    label: 'About LPC',
    items: [
      { title: 'Overview & Mission', href: '/about', description: 'History, educational philosophy, and academic goals' },
      { title: 'Board of Directors', href: '/about/leadership', description: 'Institutional governance and executive trustees' },
      { title: 'Faculty & Instructors', href: '/teachers', description: 'Certified ELT educators and international trainers' },
    ],
  },
  {
    label: 'Courses',
    href: '/courses',
    items: [
      { title: 'All Courses Overview', href: '/courses', description: 'Explore all ongoing terms and language curricula' },
      { title: 'Spoken English & Fluency', href: '/courses/spoken-english', description: 'Everyday dialogue, phonetics, and speech confidence' },
      { title: 'IELTS Academic & General', href: '/courses/ielts-preparation', description: 'Intensive band-score preparation and weekly mock exams' },
      { title: 'Executive Business English', href: '/courses/english-for-professionals', description: 'Workplace presentation, negotiation, and corporate writing' },
      { title: 'English for Teens', href: '/courses/english-for-teens', description: 'Communicative practice and creative writing for school learners' },
    ],
  },
  {
    label: 'Programs & Schools',
    items: [
      { title: 'Access Microscholarship', href: '/programs/access', description: 'Foundational English for talented underprivileged youth' },
      { title: 'LPC Laboratory Schools', href: '/schools', description: 'Comprehensive primary and secondary educational campuses' },
      { title: 'Dhaka Lab School & College', href: '/schools/dhaka', description: 'Dhanmondi academic campus curriculum and admissions' },
      { title: 'Rajshahi Lab School & College', href: '/schools/rajshahi', description: 'Divisional campus academic programs and facilities' },
    ],
  },
  {
    label: 'Community',
    items: [
      { title: 'Student Success Stories', href: '/community/stories', description: 'Verified reflections from LPC course graduates' },
      { title: 'Alumni Network', href: '/community/alumni', description: 'Global professional connections and mentorship' },
      { title: 'Blog & ELT Resources', href: '/blog', description: 'Pedagogical insights, vocabulary guides, and notices' },
    ],
  },
  {
    label: 'Contact & Branches',
    items: [
      { title: 'Campus Branches', href: '/branches', description: 'Dhaka, Chattogram, Rajshahi, and Cox’s Bazar locations' },
      { title: 'Contact Admissions', href: '/contact', description: 'Direct telephone, email, and campus enquiry forms' },
    ],
  },
];

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click or route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-xs">
      {/* 1. Top Institutional Pre-Header Banner */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-lpc-gold-400" />
              <strong className="text-white font-semibold">Language Proficiency Center (LPC)</strong>
              <span className="hidden md:inline text-slate-400">• Research-Backed Applied Linguistics &amp; ELT</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300 text-[11px] sm:text-xs">
            <span className="hidden lg:flex items-center gap-1">
              <MapPin className="w-3 h-3 text-lpc-gold-400" />
              <span>Dhaka (Dhanmondi) • Chattogram • Rajshahi • Cox&apos;s Bazar</span>
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <Link
              href="/contact"
              className="hover:text-lpc-gold-300 transition-colors flex items-center gap-1 font-medium"
            >
              <Phone className="w-3 h-3 text-lpc-gold-400" />
              <span>Admissions: +880 1711-000000</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Standalone Solid White Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4" ref={dropdownRef}>
        {/* Brand Typographic Wordmark */}
        <BrandWordmark size="md" />

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
          <Link
            href="/"
            className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
              pathname === '/'
                ? 'text-lpc-navy-950 bg-slate-100 font-bold'
                : 'text-slate-700 hover:text-lpc-navy-900 hover:bg-slate-50'
            }`}
          >
            Home
          </Link>

          {NAVIGATION_GROUPS.map((group) => {
            const isOpen = activeDropdown === group.label;
            const isGroupActive = group.items.some((item) => pathname === item.href);

            return (
              <div key={group.label} className="relative">
                <button
                  type="button"
                  onClick={() => setActiveDropdown(isOpen ? null : group.label)}
                  onMouseEnter={() => setActiveDropdown(group.label)}
                  className={`inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isOpen || isGroupActive
                      ? 'text-lpc-navy-950 bg-slate-100 font-bold'
                      : 'text-slate-700 hover:text-lpc-navy-900 hover:bg-slate-50'
                  }`}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  <span>{group.label}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu Panel (Solid white with clean hairline border) */}
                {isOpen && (
                  <div
                    onMouseLeave={() => setActiveDropdown(null)}
                    className="absolute top-full left-0 mt-1.5 w-80 bg-white rounded-xl shadow-xl border border-slate-200/90 py-2.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  >
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-2.5 transition-colors ${
                          pathname === item.href ? 'bg-lpc-navy-50 text-lpc-navy-950 font-medium' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-sm font-bold text-slate-800 hover:text-lpc-navy-900">
                          {item.title}
                        </div>
                        {item.description && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                            {item.description}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Action Buttons: Teacher Portal & Admission CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Teacher Attendance Portal Access (Professional Navy Badge) */}
          <Link
            href="/portal"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-bold text-white bg-lpc-navy-900 hover:bg-lpc-navy-950 border border-lpc-navy-800 rounded-lg shadow-xs transition-all hover:shadow focus:ring-2 focus:ring-lpc-navy-600 min-h-[40px]"
            title="Secure Faculty & Teacher Attendance Workstation"
          >
            <Lock className="w-3.5 h-3.5 text-lpc-gold-400" />
            <span>Teacher Portal</span>
          </Link>

          {/* Admission Enquiry CTA Button (Warm Yellow / Gold) */}
          <button
            type="button"
            onClick={() => setEnquiryModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-bold text-slate-950 bg-lpc-gold-400 hover:bg-lpc-gold-500 border border-lpc-gold-500 rounded-lg shadow-xs transition-all hover:shadow-md focus:ring-2 focus:ring-lpc-gold-500 min-h-[40px]"
          >
            <span>Admission Enquiry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/portal"
            className="p-2 text-white bg-lpc-navy-900 border border-lpc-navy-800 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs"
            aria-label="Teacher Portal"
          >
            <Lock className="w-4 h-4 text-lpc-gold-400" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 3. Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
          <Link
            href="/"
            className={`block px-3 py-2 text-sm font-bold rounded-lg ${
              pathname === '/' ? 'bg-slate-100 text-lpc-navy-900' : 'text-slate-800'
            }`}
          >
            Home
          </Link>

          <div className="space-y-3">
            {NAVIGATION_GROUPS.map((group) => (
              <div key={group.label} className="border-b border-slate-100 pb-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-1.5">
                  {group.label}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-3 py-2 rounded-lg text-sm ${
                        pathname === item.href
                          ? 'bg-lpc-navy-50 text-lpc-navy-950 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 space-y-2">
            <Link
              href="/portal"
              className="w-full py-2.5 px-4 bg-lpc-navy-900 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs min-h-[44px]"
            >
              <Lock className="w-4 h-4 text-lpc-gold-400" />
              <span>Teacher Attendance Portal</span>
            </Link>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setEnquiryModalOpen(true);
              }}
              className="w-full py-2.5 px-4 bg-lpc-gold-400 hover:bg-lpc-gold-500 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs min-h-[44px]"
            >
              <span>Admission Enquiry</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Tri-Color Signature Accent Line (LPC Gold -> Navy -> Crimson) */}
      <div className="h-[3px] w-full bg-gradient-to-r from-lpc-gold-500 via-lpc-navy-600 to-lpc-crimson-600" />

      {/* Shared Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
      />
    </header>
  );
};
