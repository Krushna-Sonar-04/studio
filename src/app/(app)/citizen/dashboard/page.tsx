'use client';

import { useAuth } from '@/contexts/AuthContext';
import { mockIssues } from '@/lib/mock-data';
import { Issue } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, BarChart, ListChecks, CheckCircle2, Map } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { UpvoteButton } from '@/components/shared/UpvoteButton';

const StatusBadge = ({ status }: { status: Issue['status'] }) => {
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
  return <Badge variant={variant}>{status}</Badge>;
};


export default function CitizenDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [userIssues, setUserIssues] = useState<Issue[]>([]);
  const [allIssues, setAllIssues] = useState<Issue[]>(mockIssues);

  useEffect(() => {
    if (user) {
      setUserIssues(allIssues.filter((issue) => issue.reportedBy === user.id));
    }
  }, [user, allIssues]);

  const handleUpvoteChange = (issueId: string, newUpvoteCount: number, userHasUpvoted: boolean) => {
    setAllIssues(prevIssues => 
      prevIssues.map(issue => {
        if (issue.id === issueId) {
          const newUpvotedBy = userHasUpvoted
            ? [...issue.upvotedBy, user!.id]
            : issue.upvotedBy.filter(id => id !== user!.id);
          return { ...issue, upvotes: newUpvoteCount, upvotedBy: newUpvotedBy };
        }
        return issue;
      })
    );
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
  
  if (!user) {
    return <div className="text-center">Loading user data...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Welcome, {user.name}!</h1>
          <p className="text-muted-foreground">Here's a summary of your reported issues.</p>
        </div>
        <div className="flex gap-2">
           <Link href="/citizen/nearby-issues">
            <Button variant="outline">
              <Map className="mr-2 h-4 w-4" />
              View Nearby Issues
            </Button>
          </Link>
          <Link href="/citizen/report">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Report New Issue
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Reported Issues</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Upvotes</TableHead>
                <TableHead>Reported On</TableHead>
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
                      <StatusBadge status={issue.status} />
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
                    You haven't reported any issues yet.
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
