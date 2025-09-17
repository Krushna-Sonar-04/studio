'use client';

import { useAuth } from '@/contexts/AuthContext';
import { ROLES } from '@/lib/constants';
import { UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function LoginForm() {
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const { login } = useAuth();
  const { t } = useLanguage();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole) {
      login(selectedRole);
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">{t('login_title')}</CardTitle>
        <CardDescription>{t('login_description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="grid gap-4">
          <div className="grid gap-2">
            <Select onValueChange={(value) => setSelectedRole(value as UserRole)} value={selectedRole}>
              <SelectTrigger>
                <SelectValue placeholder={t('select_role_placeholder')} />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {t(role.replace(/\s/g, '_'))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={!selectedRole}>
            <LogIn className="mr-2 h-4 w-4" />
            {t('login_button')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
