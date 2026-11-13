'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Filter,
  GraduationCap,
  MapPin,
  Search,
  Sparkles,
} from 'lucide-react';
import { SYNTHETIC_COURSES, SYNTHETIC_BRANCHES } from '@/lib/mockData';
import { EnquiryModal } from '@/components/public/EnquiryModal';

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string>('spoken-english');

  const filteredCourses = SYNTHETIC_COURSES.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.level.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || course.category === selectedCategory;

    const matchesBranch =
      selectedBranch === 'all' || course.branchIds.includes(selectedBranch);

    return matchesSearch && matchesCategory && matchesBranch;
  });

  const categories = [
    'all',
    'Spoken English',
    'Test Preparation',
    'Professional Skills',
    'Young Learners',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-lpc-navy-50 border border-lpc-navy-200 rounded-full text-xs font-semibold text-lpc-navy-800">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Academic Catalog & Curriculum</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-lpc-navy-900 tracking-tight">
          English Language Courses & Programs
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Explore our certified communicative English, IELTS preparation, and professional development curricula. All programs incorporate rigorous session-based attendance, continuous viva assessments, and practical speaking engagement.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by topic, keyword, or level..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-lpc-gold-500 focus:border-lpc-gold-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-lpc-gold-500"
            >
              <option value="all">All Course Categories</option>
              {categories.filter(c => c !== 'all').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Campus Branch Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-lpc-gold-500"
            >
              <option value="all">All Campus Locations</option>
              {SYNTHETIC_BRANCHES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Indicators */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div>
            Showing <strong className="text-slate-900">{filteredCourses.length}</strong> accredited programs
          </div>
          {(searchTerm || selectedCategory !== 'all' || selectedBranch !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedBranch('all');
              }}
              className="text-xs font-semibold text-lpc-gold-600 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Courses List */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Courses Match Your Criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search terms or clearing the category and branch filters to see all available LPC courses.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedBranch('all');
            }}
            className="px-4 py-2 bg-lpc-navy-800 text-white text-xs font-bold rounded-lg"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-6 sm:p-7 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-md text-xs font-bold bg-lpc-navy-50 text-lpc-navy-800 border border-lpc-navy-100">
                    {course.category}
                  </span>

                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.durationWeeks} Weeks • {course.totalHours} Guided Hours</span>
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900 hover:text-lpc-navy-800 transition-colors">
                    <Link href={`/courses/${course.slug}`}>
                      {course.title}
                    </Link>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {course.summary}
                  </p>
                </div>

                {/* Key Course Attributes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-700 block">Target Audience:</span>
                    <span className="line-clamp-1">{course.targetAudience}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 block">Proficiency Level:</span>
                    <span>{course.level}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-semibold text-slate-700 block">Schedules Offered:</span>
                    <span className="text-[11px] text-slate-500">{course.scheduleOptions[0]}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500 text-center sm:text-left">
                  <span>Campuses: </span>
                  <strong className="text-slate-800">
                    {course.branchIds.map(bId => SYNTHETIC_BRANCHES.find(b => b.id === bId)?.city).join(', ')}
                  </strong>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="flex-1 sm:flex-initial px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-xs rounded-lg transition-colors text-center"
                  >
                    View Syllabus
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCourseSlug(course.slug);
                      setEnquiryModalOpen(true);
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-lpc-gold-400 hover:bg-lpc-gold-500 text-slate-950 font-bold text-xs rounded-lg shadow-2xs transition-colors text-center"
                  >
                    Enquire Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reusable Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        preselectedCourseSlug={selectedCourseSlug}
      />
    </div>
  );
}
