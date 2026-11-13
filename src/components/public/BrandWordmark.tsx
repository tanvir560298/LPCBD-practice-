import React from 'react';
import Link from 'next/link';

interface BrandWordmarkProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const BrandWordmark: React.FC<BrandWordmarkProps> = ({
  variant = 'dark',
  size = 'md',
}) => {
  const isDark = variant === 'dark';

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-lpc-gold-500 rounded-lg p-1"
      aria-label="Language Proficiency Center (LPC) Bangladesh Home"
    >
      {/* Official LPC Emblem Mark */}
      <div className={`relative flex items-center justify-center rounded-xl transition-all duration-200 group-hover:scale-105 shrink-0 ${
        isDark
          ? 'bg-white p-1 shadow-xs border border-slate-200/90'
          : 'bg-white p-1 shadow-xs border border-slate-700/60'
      } ${
        size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11'
      }`}>
        <img
          src="/assets/images/lpc-emblem.png"
          alt="LPC Official Emblem"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Institution Title */}
      <div className="flex flex-col text-left">
        <span className={`font-bold tracking-tight leading-tight transition-colors ${
          isDark
            ? 'text-lpc-navy-900 group-hover:text-lpc-navy-700'
            : 'text-white group-hover:text-lpc-gold-400'
        } ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base sm:text-lg'}`}>
          Language Proficiency Center
        </span>
        <span className={`text-xs font-medium tracking-wide flex items-center gap-1.5 ${
          isDark ? 'text-slate-500' : 'text-slate-300'
        }`}>
          <span>Bangladesh</span>
          <span className="inline-block w-1 h-1 rounded-full bg-lpc-gold-500" />
          <span className="hidden sm:inline">ELT & Academic Excellence</span>
        </span>
      </div>
    </Link>
  );
};

