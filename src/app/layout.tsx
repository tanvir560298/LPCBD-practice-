import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Language Proficiency Center (LPC) | Bangladesh',
  description: 'Premier English language training, communicative fluency, IELTS preparation, and teacher development in Bangladesh.',
  keywords: ['LPC Bangladesh', 'Language Proficiency Center', 'Spoken English Dhaka', 'IELTS Preparation Bangladesh', 'English Access Program'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-lpc-gold-200 selection:text-lpc-navy-950">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-lpc-gold-400 text-slate-950 font-bold rounded-lg shadow-lg border border-lpc-gold-500 outline-none ring-2 ring-lpc-navy-800"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}

