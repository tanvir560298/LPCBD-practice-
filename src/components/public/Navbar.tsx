'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronDown,
  Menu,
  X,
  Lock,
  Phone,
  GraduationCap,
  BookOpen,
  Users,
  MapPin,
  Sparkles,
  ArrowRight,
  Shield,
  Code2,
  Building,
  LayoutDashboard,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { ProgramNavLink, StudentNav, useProgramUpdates } from './ProgramUpdates';
import { BrandWordmark } from './BrandWordmark';
import { EnquiryModal } from './EnquiryModal';
import { SYNTHETIC_USERS } from '@/lib/mockData';

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
  const router = useRouter();
  const { student, refresh: refreshStudent } = useProgramUpdates();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const portalDropdownRef = useRef<HTMLDivElement>(null);

  // Active staff user detection from cookie
  const [activeStaffUser, setActiveStaffUser] = useState<(typeof SYNTHETIC_USERS)[0] | null>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/lpc_demo_user=([^;]+)/);
      if (match && match[1]) {
        const found = SYNTHETIC_USERS.find((u) => u.id === match[1] && u.accountStatus === 'active');
        setActiveStaffUser(found || null);
      } else {
        setActiveStaffUser(null);
      }
    }
  }, [pathname]);

  // Close menus on outside click or route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setPortalDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setActiveDropdown(null);
      }
      if (portalDropdownRef.current && !portalDropdownRef.current.contains(target)) {
        setPortalDropdownOpen(false);
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
        setPortalDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSignOutAll = async () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'lpc_demo_user=; Max-Age=0; path=/;';
    }
    setActiveStaffUser(null);
    if (student) {
      try {
        await fetch('/api/student/session', { method: 'DELETE' });
        await refreshStudent();
      } catch {
        // Continue
      }
    }
    setPortalDropdownOpen(false);
    router.push('/');
  };

  // Determine active dashboard route and display label
  const activeDashboardHref = student
    ? '/student/dashboard'
    : activeStaffUser?.role === 'admin'
    ? '/portal/admin'
    : activeStaffUser?.role === 'developer'
    ? '/portal/developer'
    : '/portal';

  const activeDashboardLabel = student
    ? 'Student Dashboard'
    : activeStaffUser?.role === 'admin'
    ? 'Admin Dashboard'
    : activeStaffUser?.role === 'developer'
    ? 'Developer Console'
    : activeStaffUser?.role === 'coordinator'
    ? 'Coordinator Portal'
    : activeStaffUser
    ? 'Teacher Dashboard'
    : null;

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

      {/* Top Program/Student Notification Strip */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-x-4">
          <div className="lg:hidden">
            <ProgramNavLink />
          </div>
          <div className="ml-auto text-slate-700">
            <StudentNav />
          </div>
        </div>
      </div>

      {/* 2. Standalone Solid White Main Navigation Bar */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2"
        ref={dropdownRef}
      >
        {/* Brand Typographic Wordmark */}
        <BrandWordmark size="md" />

        {/* Desktop Navigation Links */}
        <nav
          className="order-3 w-full hidden lg:flex items-center gap-1 xl:gap-2 justify-center"
          aria-label="Main Navigation"
        >
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

          <ProgramNavLink />

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
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu Panel */}
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
                          pathname === item.href
                            ? 'bg-lpc-navy-50 text-lpc-navy-950 font-medium'
                            : 'hover:bg-slate-50'
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

        {/* Action Buttons: Sign In / Dashboard & Admission CTA */}
        <div className="hidden sm:flex items-center gap-2.5 ml-auto" ref={portalDropdownRef}>
          {/* Sign In & Dashboard Multi-Role Dropdown */}
          <div className="relative">
            {activeDashboardLabel ? (
              // When Signed In: Direct Dashboard Link + Dropdown Trigger
              <div className="inline-flex items-center rounded-lg shadow-xs border border-lpc-navy-800 bg-lpc-navy-900 overflow-hidden">
                <Link
                  href={activeDashboardHref}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-bold text-white hover:bg-lpc-navy-950 transition-colors min-h-[40px]"
                  title={`Open ${activeDashboardLabel}`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-lpc-gold-400" />
                  <span>{activeDashboardLabel}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                  aria-label="Switch portal or sign out"
                  className="px-2 py-2 text-white hover:bg-lpc-navy-950 border-l border-lpc-navy-800 transition-colors min-h-[40px] flex items-center justify-center"
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-lpc-gold-400 transition-transform ${
                      portalDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>
            ) : (
              // When Not Signed In: Sign In / Portals Dropdown Button
              <button
                type="button"
                onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-bold text-white bg-lpc-navy-900 hover:bg-lpc-navy-950 border border-lpc-navy-800 rounded-lg shadow-xs transition-all hover:shadow focus:ring-2 focus:ring-lpc-navy-600 min-h-[40px]"
                aria-haspopup="true"
                aria-expanded={portalDropdownOpen}
              >
                <Lock className="w-3.5 h-3.5 text-lpc-gold-400" />
                <span>Sign In</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-300 transition-transform ${
                    portalDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}

            {/* Comprehensive Multi-Role Portal Dropdown Menu */}
            {portalDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-84 sm:w-92 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-4 pb-2.5 mb-2 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Explore Portals &amp; Workstations
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lpc-gold-100 text-lpc-gold-900">
                      5 Roles
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Select any role below to experience its dedicated workstation
                  </p>
                </div>

                <div className="px-2 space-y-1">
                  {/* 1. Teacher Portal */}
                  <Link
                    href="/portal"
                    onClick={() => setPortalDropdownOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                        Teacher Portal
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        Attendance, batch schedules &amp; speaking tests
                      </p>
                    </div>
                  </Link>

                  {/* 2. Student Portal */}
                  <Link
                    href="/student/dashboard"
                    onClick={() => setPortalDropdownOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                        Student Portal
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        Batch schedule, attendance rates &amp; events
                      </p>
                    </div>
                  </Link>

                  {/* 3. Institutional Administrator */}
                  <Link
                    href="/portal/admin"
                    onClick={() => setPortalDropdownOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-700 shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-purple-700">
                        Administrator Workstation
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        Cohort batches, faculty &amp; global sessions
                      </p>
                    </div>
                  </Link>

                  {/* 4. Branch Coordinator */}
                  <Link
                    href="/portal"
                    onClick={() => setPortalDropdownOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <Building className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-amber-700">
                        Branch Coordinator
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        Campus-level attendance &amp; batch supervision
                      </p>
                    </div>
                  </Link>

                  {/* 5. Web Developer Console */}
                  <Link
                    href="/portal/developer"
                    onClick={() => setPortalDropdownOpen(false)}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-700 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">
                        Web Developer Console
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        System telemetry, security audit &amp; API logs
                      </p>
                    </div>
                  </Link>
                </div>

                {/* Dropdown Footer */}
                <div className="mt-2.5 pt-2.5 px-3 border-t border-slate-100 flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setPortalDropdownOpen(false)}
                    className="w-full py-2 px-3 text-xs font-bold text-center text-lpc-navy-950 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-lpc-gold-500" />
                    <span>Open Multi-Role Sign In Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {(activeStaffUser || student) && (
                    <button
                      type="button"
                      onClick={handleSignOutAll}
                      className="w-full py-1.5 px-3 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Sign Out Active Session</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Admission Enquiry CTA Button */}
          <button
            type="button"
            onClick={() => setEnquiryModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-bold text-slate-950 bg-lpc-gold-400 hover:bg-lpc-gold-500 border border-lpc-gold-500 rounded-lg shadow-xs transition-all hover:shadow-md focus:ring-2 focus:ring-lpc-gold-500 min-h-[40px]"
          >
            <span>Admission Enquiry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger & Quick Sign In Icon */}
        <div className="flex lg:hidden items-center gap-2">
          <Link
            href="/login"
            className="p-2 text-white bg-lpc-navy-900 border border-lpc-navy-800 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs"
            aria-label="Portal Sign In"
            title="Portal Sign In"
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

          <ProgramNavLink />

          {/* Institutional Portals Quick Access Section */}
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/70 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Portals &amp; Dashboards</span>
              <span className="text-[10px] text-lpc-gold-600 font-bold">5 Roles</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <Link
                href="/portal"
                className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 flex items-center gap-2 text-slate-800"
              >
                <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">Teacher</span>
              </Link>

              <Link
                href="/student/dashboard"
                className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-400 flex items-center gap-2 text-slate-800"
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Student</span>
              </Link>

              <Link
                href="/portal/admin"
                className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-purple-400 flex items-center gap-2 text-slate-800"
              >
                <Shield className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <span className="truncate">Admin</span>
              </Link>

              <Link
                href="/portal/developer"
                className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 flex items-center gap-2 text-slate-800"
              >
                <Code2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">Developer</span>
              </Link>
            </div>
          </div>

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
              href="/login"
              className="w-full py-2.5 px-4 bg-lpc-navy-900 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs min-h-[44px]"
            >
              <Lock className="w-4 h-4 text-lpc-gold-400" />
              <span>Institutional Sign In (All Roles)</span>
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

      {/* 4. Tri-Color Signature Accent Line (LPC Gold -> Navy -> Crimson) */}
      <div className="h-[3px] w-full bg-gradient-to-r from-lpc-gold-500 via-lpc-navy-600 to-lpc-crimson-600" />

      {/* Shared Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
      />
    </header>
  );
};
