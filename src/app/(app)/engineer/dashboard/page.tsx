'use client';

import { useAuth } from '@/contexts/AuthContext';
import { mockIssues } from '@/lib/mock-data';
import { Issue } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EngineerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [assignedJobs, setAssignedJobs] = useState<Issue[]>([]);

  useEffect(() => {
    if (user) {
      setAssignedJobs(mockIssues.filter(issue => issue.assignedEngineerId === user.id && issue.status === 'AssignedForVerification'));
    }
  }, [user]);
  
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Engineer Dashboard</h1>
        <p className="text-muted-foreground">Jobs assigned to you for verification.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Assigned Jobs</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reported On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedJobs.length > 0 ? (
                assignedJobs.map(job => (
                  <TableRow key={job.id} onClick={() => router.push(`/engineer/jobs/${job.id}`)} className="cursor-pointer">
                    <TableCell className="font-medium">{job.id}</TableCell>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>{job.type}</TableCell>
                    <TableCell>{new Date(job.reportedAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No jobs assigned for verification.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
