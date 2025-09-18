'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useIssues } from '@/hooks/use-issues';
import { Issue } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users } from 'lucide-react';

export default function ApprovingManagerDashboard() {
  const { user } = useAuth();
  const { issues } = useIssues();
  const router = useRouter();
  const [pendingJobs, setPendingJobs] = useState<Issue[]>([]);

  useEffect(() => {
    // Approving managers see all issues where their role is the current one to act.
    if (user) {
      setPendingJobs(issues.filter(issue => issue.currentRoles.includes(user.role)));
    }
  }, [user, issues]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-headline font-bold">Approval Dashboard</h1>
            <p className="text-muted-foreground">Projects awaiting your approval and contractor management.</p>
        </div>
        <Link href="/approving-manager/contractors">
            <Button>
                <Users className="mr-2 h-4 w-4" />
                Manage Contractors
            </Button>
        </Link>
      </div>

      <Card>
        <CardHeader><CardTitle>Pending Approval</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Estimated Cost</TableHead>
                <TableHead>Submitted On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingJobs.length > 0 ? (
                pendingJobs.map(job => (
                  <TableRow key={job.id} onClick={() => router.push(`/approving-manager/jobs/${job.id}`)} className="cursor-pointer">
                    <TableCell className="font-medium">{job.id}</TableCell>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>${job.estimationReport?.estimatedCost.toLocaleString()}</TableCell>
                    <TableCell>{new Date(job.estimationReport?.submittedAt || '').toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No jobs are pending approval.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
