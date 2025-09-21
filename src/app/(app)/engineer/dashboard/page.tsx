'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useIssues } from '@/hooks/use-issues';
import { Issue } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function EngineerDashboard() {
  const { user } = useAuth();
  const { issues } = useIssues();
  const router = useRouter();
  const { t } = useLanguage();

  const assignedJobs = useMemo(() => {
    if (user) {
      return issues.filter(issue => issue.currentRoles.includes(user.role) && issue.assignedEngineerId === user.id);
    }
    return [];
  }, [user, issues]);
  
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">{t('engineer_dashboard_title')}</h1>
        <p className="text-muted-foreground">{t('engineer_dashboard_subtitle')}</p>
      </div>

      <Card>
        <CardHeader><CardTitle>{t('assigned_jobs_title')}</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('id_column')}</TableHead>
                <TableHead>{t('image_column')}</TableHead>
                <TableHead>{t('title_column')}</TableHead>
                <TableHead>{t('type_column')}</TableHead>
                <TableHead>{t('reported_on_column')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedJobs.length > 0 ? (
                assignedJobs.map(job => (
                  <TableRow key={job.id} onClick={() => router.push(`/engineer/jobs/${job.id}`)} className="cursor-pointer">
                    <TableCell className="font-medium">{job.id}</TableCell>
                    <TableCell>
                      {job.imageUrl ? (
                        <div className="w-16 h-10 rounded-md overflow-hidden border flex items-center justify-center">
                          <Image src={job.imageUrl} alt={job.title} width={64} height={40} className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-16 h-10 rounded-md bg-muted flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.type}</TableCell>
                    <TableCell>{new Date(job.reportedAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">{t('no_jobs_assigned_verification')}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
