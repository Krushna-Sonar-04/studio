import React from 'react';
import AppHeader from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { IssuesProvider } from '@/hooks/use-issues';
import { NotificationsProvider } from '@/hooks/use-notifications';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <IssuesProvider>
      <NotificationsProvider>
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-1 container mx-auto p-4 md:p-8">
            {children}
          </main>
          <Footer />
        </div>
      </NotificationsProvider>
    </IssuesProvider>
  );
}
