/**
 * Language Proficiency Center (LPC), Bangladesh
 * Core Design Tokens System
 * Follows WCAG 2.2 AA accessibility standards for contrast, touch targets, and typography.
 */

export const DESIGN_TOKENS = {
  colors: {
    brand: {
      navy: {
        primary: '#0f284e',     // Anchoring interface navy
        dark: '#0a1a33',        // Deepest navy for text & headers
        light: '#1756a1',       // Focus/accent blue
        surface: '#f0f5fc',     // Pale blue surface tint
        border: '#b9d4f0',      // Soft navy border
      },
      gold: {
        accent: '#f59e0b',      // Warm amber/gold accent
        hover: '#d97706',       // High contrast hover
        dark: '#b45309',        // Deep gold text
        surface: '#fef3c7',     // Pale gold surface
        border: '#fde68a',      // Gold outline
      },
    },
    surfaces: {
      background: '#f8fafc',    // Off-white main background
      card: '#ffffff',          // Crisp white container
      subtle: '#f1f5f9',        // Slate-100 secondary fill
      muted: '#e2e8f0',         // Slate-200 dividers
    },
    text: {
      primary: '#0f172a',       // Slate-900 (High contrast >= 7:1)
      secondary: '#334155',     // Slate-700
      muted: '#64748b',         // Slate-500
      inverse: '#ffffff',       // White on navy
    },
    status: {
      unmarked: {
        bg: '#f1f5f9',
        border: '#cbd5e1',
        text: '#475569',
        badge: 'bg-slate-100 text-slate-700 border-slate-300',
        label: 'Unmarked',
      },
      present: {
        bg: '#ecfdf5',
        border: '#a7f3d0',
        text: '#065f46',
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        label: 'Present',
      },
      absent: {
        bg: '#fff1f2',
        border: '#fecdd3',
        text: '#9f1239',
        badge: 'bg-rose-50 text-rose-800 border-rose-300',
        label: 'Absent',
      },
      late: {
        bg: '#fffbeb',
        border: '#fde68a',
        text: '#92400e',
        badge: 'bg-amber-50 text-amber-800 border-amber-300',
        label: 'Late',
      },
      excused: {
        bg: '#f0f9ff',
        border: '#bae6fd',
        text: '#075985',
        badge: 'bg-sky-50 text-sky-800 border-sky-300',
        label: 'Excused',
      },
    },
  },
  typography: {
    fontFamilies: {
      sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Bengali", sans-serif',
      serif: 'Georgia, Cambria, "Times New Roman", serif',
    },
    scale: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
    },
  },
  touchTargets: {
    minSize: '44px',     // WCAG 2.2 touch target minimum
  },
  radii: {
    sm: '0.375rem',     // 6px
    md: '0.5rem',       // 8px
    lg: '0.75rem',      // 12px
    xl: '1rem',         // 16px
    '2xl': '1.5rem',    // 24px
  },
} as const;

