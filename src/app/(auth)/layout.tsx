import AppHeader from '@/components/shared/Header';
import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
     <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}
