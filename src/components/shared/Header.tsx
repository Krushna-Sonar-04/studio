'use client';

import { APP_NAME } from '@/lib/constants';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { UserNav } from './UserNav';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { NotificationBell } from './NotificationBell';

const TricolorFlag = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 27 18"
    width="27"
    height="18"
  >
    <rect width="27" height="18" fill="#FFF" />
    <rect width="27" height="6" fill="#FF9933" />
    <rect y="12" width="27" height="6" fill="#138808" />
    <circle cx="13.5" cy="9" r="2.5" fill="#000080" stroke="#FFF" strokeWidth="0.5" />
     <g fill="#000080">
      <path d="M13.5 9.5l-.29-.95h.58z" />
      {[...Array(23)].map((_, i) => (
        <path
          key={i}
          transform={`rotate(${15 * (i + 1)} 13.5 9)`}
          d="M13.5 9.5l-.29-.95h.58z"
        />
      ))}
    </g>
  </svg>
);


export default function AppHeader() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const navLinks = [
      { href: '/citizen/dashboard', label: 'Citizen Dashboard'},
      { href: '/contractor/dashboard', label: 'Contractor Dashboard'},
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-8 flex items-center gap-2">
          <TricolorFlag />
          <span className="font-bold font-headline text-lg text-primary">{APP_NAME}</span>
        </Link>
        
        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            {isClient && user && <NotificationBell user={user} />}
            {isClient ? <UserNav /> : null}
          </div>

           {/* Mobile Nav */}
           <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                {isClient && (
                <div className="flex flex-col gap-6 pt-6">
                    <Link href="/" className="mr-8 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                        <TricolorFlag />
                        <span className="font-bold font-headline text-lg text-primary">{APP_NAME}</span>
                    </Link>
                   
                     <>
                      <nav className="grid gap-4">
                          {user && navLinks.map(link => (
                              <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                                  {link.label}
                              </Link>
                          ))}
                          {!user && (
                             <Link href="/login" className="text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>
                                {t('login_button')}
                              </Link>
                          )}
                      </nav>
                       <div className="border-t pt-6 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <LanguageSwitcher />
                                {user && <NotificationBell user={user} />}
                            </div>
                          <UserNav />
                      </div>
                     </>
                   
                </div>
                )}
              </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
