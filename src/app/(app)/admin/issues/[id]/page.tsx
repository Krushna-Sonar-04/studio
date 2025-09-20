
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useIssues } from '@/hooks/use-issues';
import { mockUsers } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import type { Issue, Notification } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { ImageLightbox } from '@/components/shared/ImageLightbox';
import { useNotifications } from '@/hooks/use-notifications';
import { Textarea } from '@/components/ui/textarea';

export default function AdminIssueReviewPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { issues, updateIssue } = useIssues();
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const id = params.id as string;
  const issue = issues.find((i) => i.id === id);

  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState('');
  const [rejectionNotes, setRejectionNotes] = useState('');
  
  const openLightbox = (url: string) => {
    setLightboxImageUrl(url);
    setLightboxOpen(true);
  };

  if (!issue) {
    return <div className="text-center">Issue not found.</div>;
  }
  
  const contractor = mockUsers.find(u => u.id === issue.assignedContractorId);

  const handleApprove = () => {
    if (!user) return;

    const updatedIssue: Issue = {
      ...issue,
      status: 'Closed',
      currentRoles: [], // End of the line
      statusHistory: [
        ...issue.statusHistory,
        {
          status: 'Closed',
          date: new Date().toISOString(),
          updatedBy: user.name,
          notes: 'Work verified and issue closed by Head of Department.',
        },
      ],
    };
    updateIssue(updatedIssue);
    
    // Notify citizen of final completion with details
    const finalReport = `The work for "${issue.title}" has been verified and the issue is now closed. \n\nContractor Notes: ${issue.contractorReport?.notes || 'N/A'}`;
    const notification: Notification = {
        id: `notif-final-${Date.now()}`,
        userId: issue.reportedBy,
        type: 'status_update',
        title: 'Your issue has been closed!',
        description: finalReport,
        issueId: issue.id,
        imageUrl: issue.contractorReport?.afterImageUrl,
        timestamp: new Date().toISOString(),
        read: false,
    };
    addNotification(notification);

    toast({
      title: 'Issue Closed',
      description: 'The contractor\'s work has been approved and the citizen has been notified.',
    });
    router.push('/admin/dashboard');
  };
  
  const handleReject = () => {
       if (!user || !rejectionNotes) {
        toast({ variant: 'destructive', title: 'Rejection failed', description: 'Please provide rejection notes.' });
        return;
       };

        const updatedIssue: Issue = {
            ...issue,
            status: 'InProgress', // Re-open the issue for the contractor
            currentRoles: ['Contractor'],
            statusHistory: [
                ...issue.statusHistory,
                {
                    status: 'InProgress',
                    date: new Date().toISOString(),
                    updatedBy: user.name,
                    notes: `Work rejected by HOD. Notes: ${rejectionNotes}`,
                },
            ],
        };
        updateIssue(updatedIssue);

        toast({
            title: 'Work Rejected',
            description: 'The issue has been sent back to the contractor for rework.',
            variant: 'destructive'
        });
        router.push('/admin/dashboard');
  };

  const isReviewable = issue.status === 'Resolved' && issue.contractorReport;

  return (
    <div className="space-y-8">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <div>
        <h1 className="text-3xl font-headline font-bold">Review Contractor Work</h1>
        <p className="text-muted-foreground">Issue: {issue.title} ({issue.id})</p>
      </div>

      {isReviewable ? (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Contractor Report</CardTitle>
                        {contractor && <CardDescription>Submitted by: {contractor.name} on {new Date(issue.contractorReport!.submittedAt).toLocaleString()}</CardDescription>}
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold">Notes:</p>
                        <p className="text-muted-foreground mb-6">{issue.contractorReport!.notes}</p>
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div>
                                <h4 className="font-semibold mb-2">'Before' Photo</h4>
                                {issue.contractorReport!.beforeImageUrl ? (
                                     <Image src={issue.contractorReport!.beforeImageUrl} alt="Before work" width={400} height={300} className="rounded-lg border object-cover cursor-pointer" onClick={() => openLightbox(issue.contractorReport!.beforeImageUrl!)} />
                                ) : <p className="text-sm text-muted-foreground">No 'before' image provided.</p>}
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">'After' Photo</h4>
                                {issue.contractorReport!.afterImageUrl ? (
                                    <Image src={issue.contractorReport!.afterImageUrl} alt="After work" width={400} height={300} className="rounded-lg border object-cover cursor-pointer" onClick={() => openLightbox(issue.contractorReport!.afterImageUrl!)} />
                                ) : <p className="text-sm text-muted-foreground">No 'after' image provided.</p>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
             <div className="lg:col-span-1 space-y-6">
                <Card className="sticky top-20">
                    <CardHeader>
                        <CardTitle>Decision</CardTitle>
                        <CardDescription>Approve the work to close the issue, or reject it and send back to the contractor.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <Button className="w-full" onClick={handleApprove}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Approve & Close Issue
                        </Button>
                        <Separator />
                        <div className="space-y-2">
                             <label htmlFor="rejection-notes" className="text-sm font-medium">Rejection Notes (if rejecting)</label>
                             <Textarea id="rejection-notes" value={rejectionNotes} onChange={(e) => setRejectionNotes(e.target.value)} placeholder="Explain why the work is not satisfactory..." />
                        </div>
                        <Button className="w-full" variant="destructive" onClick={handleReject} disabled={!rejectionNotes}>
                            <XCircle className="mr-2 h-4 w-4" /> Reject Work
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      ) : (
        <Card>
          <CardHeader><CardTitle>Not Ready for Review</CardTitle></CardHeader>
          <CardContent>
            <p>This issue is not currently awaiting your final review. Its current status is: <strong>{issue.status}</strong>.</p>
          </CardContent>
        </Card>
      )}

      <ImageLightbox
          imageUrl={lightboxImageUrl}
          alt="Contractor work photo"
          isOpen={isLightboxOpen}
          onOpenChange={setLightboxOpen}
        />
    </div>
  );
}
