import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { APP_NAME } from "@/lib/constants";
import { Playfair_Display, PT_Sans } from 'next/font/google';
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import AppHeader from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { IssuesProvider } from "@/hooks/use-issues";
import { NotificationsProvider } from "@/hooks/use-notifications";
import "next/font/local";


const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-playfair-display',
  display: 'swap',
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
  display: 'swap',
});


export const metadata: Metadata = {
  title: APP_NAME,
  description: "Connecting citizens and government for a better community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-body antialiased", ptSans.variable, playfairDisplay.variable)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
                <IssuesProvider>
                    <NotificationsProvider>
                        <LanguageProvider>
                            <div className="flex flex-col min-h-screen">
                                <AppHeader />
                                <main className="flex-1">
                                    {children}
                                </main>
                                <Footer />
                            </div>
                            <Toaster />
                        </LanguageProvider>
                    </NotificationsProvider>
                </IssuesProvider>
            </AuthProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
