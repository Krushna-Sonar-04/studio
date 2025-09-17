import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold mb-4">{APP_NAME}</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Empowering citizens to build smarter, cleaner communities.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
              <li><Link href="/citizen/dashboard" className="text-muted-foreground hover:text-foreground">Citizen Dashboard</Link></li>
              <li><Link href="/contractor/dashboard" className="text-muted-foreground hover:text-foreground">Contractor Dashboard</Link></li>
              <li><Link href="/login" className="text-muted-foreground hover:text-foreground">Admin Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Help Center</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">FAQs</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
            </ul>
          </div>
           <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-muted-foreground">📧 support@civiclens.gov.in</li>
              <li className="text-muted-foreground">📞 1800-XYZ-1234</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {APP_NAME} | An Initiative by the Government of India</p>
        </div>
      </div>
    </footer>
  );
}
