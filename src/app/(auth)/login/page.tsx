import { LoginForm } from '@/components/auth/LoginForm';
import { APP_NAME } from '@/lib/constants';
import { Building2 } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
       <div className="flex items-center gap-2 mb-8">
         <Building2 className="h-10 w-10 text-primary" />
         <h1 className="text-4xl font-headline text-center font-bold text-primary">
            {APP_NAME}
         </h1>
      </div>
      <LoginForm />
    </div>
  );
}
