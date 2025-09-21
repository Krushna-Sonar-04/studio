'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useIssues } from '@/hooks/use-issues';
import { Issue } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { ClipboardList, Play, CheckCircle2, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ContractorDashboard() {
  const { user } = useAuth();
  const { issues } = useIssues();
  const router = useRouter();
  const { t } = useLanguage();

  const jobs = useMemo(() => {
     if (user) {
      return issues.filter(issue => issue.assignedContractorId === user.id && issue.currentRoles.includes(user.role));
    }
    return [];
  }, [user, issues]);

  const allUserJobs = useMemo(() => issues.filter(issue => issue.assignedContractorId === user?.id), [issues, user]);
  const stats = useMemo(() => ({
    assigned: allUserJobs.filter(j => j.status === 'AssignedToContractor').length,
    inProgress: allUserJobs.filter(j => j.status === 'InProgress').length,
    completed: allUserJobs.filter(j => ['Resolved', 'Closed'].includes(j.status)).length,
  }), [allUserJobs]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">{t('contractor_dashboard_title')}</h1>
        <p className="text-muted-foreground">{t('contractor_dashboard_subtitle')}</p>
      </div>

       <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('new_assigned_stat')}</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.assigned}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('in_progress_stat')}</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.inProgress}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('completed_stat')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.completed}</div></CardContent>
        </Card>
      </div>


      <Card>
        <CardHeader><CardTitle>{t('active_jobs_title')}</CardTitle></CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('id_column')}</TableHead>
                <TableHead>{t('image_column')}</TableHead>
                <TableHead>{t('title_column')}</TableHead>
                <TableHead>{t('location_column')}</TableHead>
                <TableHead>{t('status_column')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length > 0 ? (
                jobs.map(job => (
                  <TableRow key={job.id} onClick={() => router.push(`/contractor/jobs/${job.id}`)} className="cursor-pointer">
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
                    <TableCell>{job.location}</TableCell>
                    <TableCell><Badge variant="outline">{t(job.status)}</Badge></TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">{t('no_active_jobs')}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
