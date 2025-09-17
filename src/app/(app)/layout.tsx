import React from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 container mx-auto p-4 md:p-8">
      {children}
    </main>
  );
}
