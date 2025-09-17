import { APP_NAME } from '@/lib/constants';
import { Building2 } from 'lucide-react';
import Link from 'next/link';
import { UserNav } from './UserNav';
import { LanguageSwitcher } from './LanguageSwitcher';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center">
          <Building2 className="mr-2 h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg text-primary">{APP_NAME}</span>
        </Link>
        <div className="flex flex-1 items-center justify-end gap-4">
          <LanguageSwitcher />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
