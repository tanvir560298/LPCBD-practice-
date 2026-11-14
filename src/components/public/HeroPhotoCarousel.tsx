'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export interface ShowcaseSlide {
  id: string;
  src: string;
  alt: string;
  tag: string;
  caption: string;
  subcaption: string;
}

export const SHOWCASE_SLIDES: ShowcaseSlide[] = [
  {
    id: 'slide-1',
    src: '/assets/images/showcase/lpc-activity-1.jpg',
    alt: 'LPC English Access Microscholarship Program - Student Cohort & Leadership Celebration',
    tag: 'National Scholarship Initiative',
    caption: 'English Access Cohort & Leadership Celebration',
    subcaption: 'LPC Faculty, Board of Directors & Access Scholars in Dhaka',
  },
  {
    id: 'slide-2',
    src: '/assets/images/showcase/lpc-activity-2.jpg',
    alt: 'LPC Communicative Classroom - Students collaborating on interactive group projects',
    tag: 'Interactive CLT Workshop',
    caption: 'Classroom Projects & Peer Collaboration',
    subcaption: 'Small-cohort engagement fostering expressive fluency and teamwork',
  },
  {
    id: 'slide-3',
    src: '/assets/images/showcase/lpc-activity-3.jpg',
    alt: 'LPC Multimedia Language Lab - Syed Nazrul Ahsan conducting an English Access technology session',
    tag: 'Multimedia Language Lab',
    caption: 'Multimedia Lectures & Digital Literacy',
    subcaption: 'Coordinator Syed Nazrul Ahsan conducting Access session with projection drills',
  },
];

interface HeroPhotoCarouselProps {
  slides?: ShowcaseSlide[];
  intervalMs?: number;
}

export function HeroPhotoCarousel({
  slides = SHOWCASE_SLIDES,
  intervalMs = 4500,
}: HeroPhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, slides.length, intervalMs]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="LPC Campus Activities and Student Life Slideshow"
    >
      {/* Slides with Crossfade Transition */}
      {slides.map((slide, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
            aria-hidden={!isActive}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
            />
            {/* Subtle Gradient Shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />
          </div>
        );
      })}

      {/* Floating Bottom Info Bar */}
      <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 z-20 flex flex-col justify-end space-y-1.5 text-left pointer-events-none">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-lpc-gold-400 text-slate-950 font-bold text-[10px] tracking-wide shadow-xs">
            <Sparkles className="w-3 h-3 text-slate-950" />
            <span>{slides[currentIndex].tag}</span>
          </span>
          <span className="text-[10px] font-mono text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-700">
            {currentIndex + 1} / {slides.length}
          </span>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1 drop-shadow-xs">
            {slides[currentIndex].caption}
          </h3>
          <p className="text-[10px] sm:text-[11px] text-slate-300 line-clamp-1">
            {slides[currentIndex].subcaption}
          </p>
        </div>

        {/* Carousel Controls & Indicator Dots */}
        <div className="pt-1 flex items-center justify-between pointer-events-auto">
          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-6 bg-lpc-gold-400'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Nav Buttons */}
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={goToPrevious}
              className="p-1 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700/80 transition-colors shadow-xs"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="p-1 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700/80 transition-colors shadow-xs"
              aria-label="Next image"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

