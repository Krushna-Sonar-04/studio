
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useIssues } from '@/hooks/use-issues';
import { Issue } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ApprovingManagerDashboard() {
  const { user } = useAuth();
  const { issues } = useIssues();
  const router = useRouter();
  const { t } = useLanguage();

  const pendingJobs = useMemo(() => {
    if (user) {
      return issues.filter(issue => issue.currentRoles.includes(user.role));
    }
    return [];
  }, [user, issues]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-headline font-bold">{t('approving_manager_dashboard_title')}</h1>
            <p className="text-muted-foreground">{t('approving_manager_dashboard_subtitle')}</p>
        </div>
        <Link href="/approving-manager/contractors">
            <Button>
                <Users className="mr-2 h-4 w-4" />
                {t('manage_contractors_button')}
            </Button>
        </Link>
      </div>

      <Card>
        <CardHeader><CardTitle>{t('pending_approval_title')}</CardTitle></CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('id_column')}</TableHead>
                <TableHead>{t('image_column')}</TableHead>
                <TableHead>{t('title_column')}</TableHead>
                <TableHead>{t('estimated_cost_column')}</TableHead>
                <TableHead>{t('submitted_on_column')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingJobs.length > 0 ? (
                pendingJobs.map(job => (
                  <TableRow key={job.id} onClick={() => router.push(`/approving-manager/jobs/${job.id}`)} className="cursor-pointer">
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
                    <TableCell>₹{job.estimationReport?.estimatedCost.toLocaleString()}</TableCell>
                    <TableCell>{new Date(job.estimationReport?.submittedAt || '').toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">{t('no_jobs_pending_approval')}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
