import React from 'react';
import { Navbar } from '@/components/public/Navbar';
import { ProgramUpdatesProvider } from '@/components/public/ProgramUpdates';
import { Footer } from '@/components/public/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProgramUpdatesProvider><div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </div></ProgramUpdatesProvider>
  );
}

