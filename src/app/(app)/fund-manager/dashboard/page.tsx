'use client';

import { useAuth } from '@/contexts/AuthContext';
import { mockIssues } from '@/lib/mock-data';
import { Issue } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FundManagerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [assignedJobs, setAssignedJobs] = useState<Issue[]>([]);

  useEffect(() => {
    if (user) {
      // A Fund Manager sees issues assigned to them that are now their responsibility.
      setAssignedJobs(mockIssues.filter(issue => 
        issue.currentRoles.includes(user.role) && issue.assignedFundManagerId === user.id
      ));
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Fund Manager Dashboard</h1>
        <p className="text-muted-foreground">Jobs ready for cost estimation.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Jobs for Estimation</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedJobs.length > 0 ? (
                assignedJobs.map(job => (
                  <TableRow key={job.id} onClick={() => router.push(`/fund-manager/jobs/${job.id}`)} className="cursor-pointer">
                    <TableCell className="font-medium">{job.id}</TableCell>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.type}</TableCell>
                     <TableCell>
                        {job.verificationReport ? 'Verified' : 'Pending Verification'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No jobs currently require estimation.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
