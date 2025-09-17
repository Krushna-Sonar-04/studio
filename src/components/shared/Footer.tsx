import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-full lg:col-span-1">
            <h4 className="font-bold text-lg mb-2 font-headline">{APP_NAME}</h4>
            <p className="text-sm text-muted-foreground">
              Empowering citizens to build smarter, cleaner communities.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-muted-foreground hover:text-primary">Home</Link></li>
              <li><Link href="/citizen/dashboard" className="text-muted-foreground hover:text-primary">Citizen Dashboard</Link></li>
              <li><Link href="/contractor/dashboard" className="text-muted-foreground hover:text-primary">Contractor Dashboard</Link></li>
              <li><Link href="/login" className="text-muted-foreground hover:text-primary">Admin Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Help Center</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">FAQs</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>support@civiclens.gov.in</li>
              <li>Toll-Free: 1800-XYZ-1234</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 {APP_NAME}. An Initiative by the Government of India.</p>
        </div>
      </div>
    </footer>
  );
}
