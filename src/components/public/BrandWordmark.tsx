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
      {/* Typographic Crest Badge */}
      <div className={`relative flex items-center justify-center font-serif font-black rounded-lg shadow-sm border transition-transform group-hover:scale-105 ${
        isDark
          ? 'bg-lpc-navy-800 border-lpc-navy-700 text-white'
          : 'bg-white border-slate-200 text-lpc-navy-800'
      } ${
        size === 'sm' ? 'w-10 h-10 text-base' : size === 'lg' ? 'w-14 h-14 text-2xl' : 'w-11 h-11 text-lg'
      }`}>
        <span className="tracking-tighter">LPC</span>
        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-lpc-gold-500 rounded-full border-2 border-white flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-lpc-navy-900 rounded-full" />
        </div>
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
