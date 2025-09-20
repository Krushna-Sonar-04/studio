
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useIssues } from '@/hooks/use-issues';
import { Issue } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, BarChart, ListChecks, CheckCircle2, Map, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { UpvoteButton } from '@/components/shared/UpvoteButton';
import { mockAnnouncements } from '@/lib/mock-data/announcements';
import { AnnouncementCard } from '@/components/shared/AnnouncementCard';
import { useLanguage } from '@/contexts/LanguageContext';

const StatusBadge = React.memo(({ status, t }: { status: Issue['status'], t: (key: string) => string }) => {
  const variant: 'default' | 'secondary' | 'destructive' | 'outline' = useMemo(() => {
    switch (status) {
      case 'Submitted':
      case 'PendingVerificationAndEstimation':
        return 'default';
      case 'InProgress':
      case 'Verified':
        return 'secondary';
      case 'Resolved':
      case 'Closed':
      case 'Approved':
        return 'outline';
      case 'Rejected':
        return 'destructive';
      default:
        return 'default';
    }
  }, [status]);
  return <Badge variant={variant}>{t(status)}</Badge>;
});
StatusBadge.displayName = 'StatusBadge';


export default function CitizenDashboard() {
  const { user } = useAuth();
  const { issues, updateIssue } = useIssues();
  const router = useRouter();
  const { t } = useLanguage();

  const userIssues = useMemo(() => {
    if (user) {
      return issues.filter((issue) => issue.reportedBy === user.id);
    }
    return [];
  }, [user, issues]);

  const handleUpvoteChange = (issueId: string, newUpvoteCount: number, userHasUpvoted: boolean) => {
    const issueToUpdate = issues.find(issue => issue.id === issueId);
    if (issueToUpdate && user) {
        const newUpvotedBy = userHasUpvoted
            ? [...issueToUpdate.upvotedBy, user.id]
            : issueToUpdate.upvotedBy.filter(id => id !== user.id);
        
        updateIssue({
            ...issueToUpdate,
            upvotes: newUpvoteCount,
            upvotedBy: newUpvotedBy,
        });
    }
  };

  const stats = useMemo(() => {
    const total = userIssues.length;
    const inProgress = userIssues.filter(
      (issue) => !['Resolved', 'Closed', 'Rejected'].includes(issue.status)
    ).length;
    const resolved = userIssues.filter(
      (issue) => ['Resolved', 'Closed'].includes(issue.status)
    ).length;
    return { total, inProgress, resolved };
  }, [userIssues]);
  
  const latestAnnouncement = useMemo(() => {
    return [...mockAnnouncements].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }, []);

  if (!user) {
    return <div className="text-center">Loading user data...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('welcome_message')}, {user.name}!</h1>
          <p className="text-muted-foreground">{t('dashboard_subtitle')}</p>
        </div>
        <div className="flex gap-2">
           <Link href="/citizen/nearby-issues">
            <Button variant="outline">
              <Map className="mr-2 h-4 w-4" />
              {t('view_nearby_issues')}
            </Button>
          </Link>
          <Link href="/citizen/report">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('report_new_issue')}
            </Button>
          </Link>
        </div>
      </div>

       {latestAnnouncement && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
              <Megaphone className="text-primary" /> {t('latest_announcement')}
            </h2>
            <Link href="/citizen/announcements">
              <Button variant="link">{t('view_all')}</Button>
            </Link>
          </div>
          <AnnouncementCard announcement={latestAnnouncement} />
        </div>
      )}


      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total_reports')}</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('in_progress')}</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('resolved')}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('your_reported_issues')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('token_id')}</TableHead>
                <TableHead>{t('title')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('upvotes')}</TableHead>
                <TableHead>{t('reported_on')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userIssues.length > 0 ? (
                userIssues.map((issue) => (
                  <TableRow key={issue.id} >
                    <TableCell 
                      className="font-medium cursor-pointer"
                      onClick={() => router.push(`/citizen/issues/${issue.id}`)}
                    >
                      {issue.id}
                    </TableCell>
                    <TableCell
                      className="cursor-pointer"
                      onClick={() => router.push(`/citizen/issues/${issue.id}`)}
                    >
                      {issue.title}
                    </TableCell>
                    <TableCell
                      className="cursor-pointer"
                      onClick={() => router.push(`/citizen/issues/${issue.id}`)}
                    >
                      <StatusBadge status={issue.status} t={t} />
                    </TableCell>
                     <TableCell>
                      <UpvoteButton
                        issueId={issue.id}
                        initialUpvotes={issue.upvotes}
                        initialHasUpvoted={issue.upvotedBy.includes(user.id)}
                        onUpvoteChange={handleUpvoteChange}
                      />
                    </TableCell>
                    <TableCell
                      className="cursor-pointer"
                      onClick={() => router.push(`/citizen/issues/${issue.id}`)}
                    >
                      {new Date(issue.reportedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    {t('no_issues_reported')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
