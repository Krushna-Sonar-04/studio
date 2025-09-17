import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
      <main className="flex-1 flex items-center justify-center p-4 -mt-16">
        {children}
      </main>
  );
}
