import React from 'react';
import AppHeader from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
