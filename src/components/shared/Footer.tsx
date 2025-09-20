
'use client';

import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold mb-4">{APP_NAME}</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              {t('footer_tagline')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">{t('quick_links')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-muted-foreground hover:text-foreground">{t('home')}</Link></li>
              <li><Link href="/citizen/dashboard" className="text-muted-foreground hover:text-foreground">{t('Citizen_Dashboard')}</Link></li>
              <li><Link href="/contractor/dashboard" className="text-muted-foreground hover:text-foreground">{t('Contractor_Dashboard')}</Link></li>
              <li><Link href="/login" className="text-muted-foreground hover:text-foreground">{t('admin_login')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">{t('support')}</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">{t('help_center')}</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">{t('faqs')}</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">{t('contact_us')}</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">{t('privacy_policy')}</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="font-semibold mb-4">{t('contact_us')}</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">📧 support@civiclens.gov.in</li>
              <li className="text-muted-foreground">📞 1800-XYZ-1234</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {APP_NAME} | {t('gok_initiative')}</p>
        </div>
      </div>
    </footer>
  );
}
