import { APP_NAME } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto py-6 px-4 md:px-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {APP_NAME}. An Initiative by the Government of India.
        </p>
      </div>
    </footer>
  );
}
