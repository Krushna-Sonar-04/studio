'use client';

import { useParams, useRouter } from 'next/navigation';
import { useIssues } from '@/hooks/use-issues';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Play, Check, ArrowLeft, Upload, Ticket } from 'lucide-react';
import type { Issue, ContractorReport } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';


export default function ContractorJobPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { issues, updateIssue } = useIssues();
  const { user } = useAuth();
  const id = params.id as string;
  const issue = issues.find((i) => i.id === id);

  if (!issue) {
    return <div className="text-center">Job not found.</div>;
  }

  const handleStatusUpdate = (newStatus: 'InProgress' | 'Resolved') => {
    if (!user) return;
    
    const statusNote = newStatus === 'InProgress' ? 'Work has started.' : 'Work has been completed.';
    
    const updatedIssue: Issue = {
        ...issue,
        status: newStatus,
        // When work starts, it's still the contractor's role. When resolved, it moves to admin for final verification.
        currentRoles: newStatus === 'InProgress' ? ['Contractor'] : ['Head of Department'],
        statusHistory: [
            ...issue.statusHistory,
            { status: newStatus, date: new Date().toISOString(), updatedBy: user.name, notes: statusNote }
        ]
    };

    updateIssue(updatedIssue);
    toast({
      title: `Status Updated to ${newStatus}`,
      description: 'The job status has been changed.',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const contractorReport: ContractorReport = {
        notes: (e.currentTarget.querySelector('#notes') as HTMLTextAreaElement).value,
        beforeImageUrl: 'https://picsum.photos/seed/310/600/400', // Placeholder
        afterImageUrl: 'https://picsum.photos/seed/311/600/400', // Placeholder
        submittedAt: new Date().toISOString(),
    };

     const updatedIssue: Issue = {
        ...issue,
        status: 'Resolved',
        currentRoles: ['Head of Department'], // Next step: Final verification by Admin/HOD
        contractorReport: contractorReport,
        statusHistory: [
            ...issue.statusHistory,
            { status: 'Resolved', date: new Date().toISOString(), updatedBy: user.name, notes: 'Completion report submitted.' }
        ]
    };

    updateIssue(updatedIssue);
    toast({ title: 'Completion Report Submitted', description: 'The job has been marked as resolved and is pending final verification.' });
    router.push('/contractor/dashboard');
  };

  return (
    <div className="space-y-8">
       <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">{issue.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Ticket className="h-4 w-4" />
                Token ID: {issue.id} | Location: {issue.location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">Work Description:</h3>
              <p className="text-muted-foreground text-sm">{issue.description}</p>
            </CardContent>
             {issue.status === 'AssignedToContractor' && <CardFooter>
                 <Button onClick={() => handleStatusUpdate('InProgress')}>
                    <Play className="mr-2 h-4 w-4" /> Start Work (Set to In Progress)
                 </Button>
            </CardFooter>}
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Submit Completion Report</CardTitle>
              <CardDescription>Upload photos and add notes to mark the job as resolved.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="before" className="flex items-center gap-2 text-sm font-medium"><Upload className="h-4 w-4" />'Before' Photo</label>
                  <Input id="before" type="file" required />
                </div>
                 <div className="space-y-2">
                  <label htmlFor="after" className="flex items-center gap-2 text-sm font-medium"><Upload className="h-4 w-4" />'After' Photo</label>
                  <Input id="after" type="file" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">Completion Notes</label>
                  <Textarea id="notes" placeholder="Notes on the work performed..." className="min-h-[100px]" required/>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={issue.status !== 'InProgress'}>
                    <Check className="mr-2 h-4 w-4" /> Mark as Resolved
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
