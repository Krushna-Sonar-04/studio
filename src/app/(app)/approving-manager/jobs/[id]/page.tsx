
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useIssues } from '@/hooks/use-issues';
import { mockUsers } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check, X, ArrowLeft, Camera } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Issue, Notification } from '@/lib/types';
import { useNotifications } from '@/hooks/use-notifications';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import Image from 'next/image';
import { ImageLightbox } from '@/components/shared/ImageLightbox';


export default function ApprovalPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { issues, updateIssue } = useIssues();
  const { addNotification } = useNotifications();
  const id = params.id as string;
  const issue = issues.find((i) => i.id === id);

  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState('');

  const openLightbox = (url: string) => {
    setLightboxImageUrl(url);
    setLightboxOpen(true);
  };

  if (!issue) {
    return <div className="text-center">Job not found.</div>;
  }
  
  const reporter = mockUsers.find(u => u.id === issue.reportedBy);
  const engineer = mockUsers.find(u => u.id === issue.assignedEngineerId);
  const fundManager = mockUsers.find(u => u.id === issue.assignedFundManagerId);

  const handleApprove = () => {
    if(!user) return;

    const updatedIssue: Issue = {
        ...issue,
        status: 'Approved',
        currentRoles: ['Head of Department'], // Send to Admin to assign contractor
        statusHistory: [
            ...issue.statusHistory,
            {
                status: 'Approved',
                date: new Date().toISOString(),
                updatedBy: user.name,
                notes: `Project approved. Forwarded for contractor assignment.`,
            }
        ]
    };
    
    updateIssue(updatedIssue);
    
    // Notify Admin that a job is ready for assignment
    const admin = mockUsers.find(u => u.role === 'Head of Department');
    if (admin) {
        const adminNotification: Notification = {
            id: `notif-admin-${Date.now()}`,
            userId: admin.id,
            type: 'new_assignment',
            title: 'Job Approved',
            description: `Issue "${issue.title}" has been approved and needs a contractor.`,
            issueId: issue.id,
            timestamp: new Date().toISOString(),
            read: false,
        };
        addNotification(adminNotification);
    }

    toast({
        title: 'Project Approved',
        description: 'The job has been sent to the Head of Department for contractor assignment.',
    });
    router.push('/approving-manager/dashboard');
  };

  const handleReject = () => {
    if(!user) return;
    const updatedIssue: Issue = {
      ...issue,
      status: 'Rejected',
      currentRoles: [], // Ends the flow here
      statusHistory: [
        ...issue.statusHistory,
        {
          status: 'Rejected',
          date: new Date().toISOString(),
          updatedBy: user.name,
          notes: 'Project has been rejected by the Approving Manager.',
        },
      ],
    };

    updateIssue(updatedIssue);
    toast({
      title: 'Project Rejected',
      description: 'The issue resolution has been rejected.',
      variant: 'destructive',
    });
    router.push('/approving-manager/dashboard');
  };
  
  const isApprovalPending = issue.status === 'PendingApproval';

  return (
    <div className="space-y-8">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <div>
        <h1 className="text-3xl font-headline font-bold">Approval for: {issue.title}</h1>
        <p className="text-muted-foreground">Review all details before making a decision.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Citizen Report</CardTitle>{reporter && <CardDescription>By: {reporter.name}</CardDescription>}</CardHeader>
            <CardContent><p>{issue.description}</p></CardContent>
          </Card>
          {issue.verificationReport && <Card>
            <CardHeader><CardTitle>Engineer Verification</CardTitle>{engineer && <CardDescription>By: {engineer.name}</CardDescription>}</CardHeader>
            <CardContent className="space-y-4">
                <p className="font-semibold">Comments:</p>
                <p className="text-muted-foreground">{issue.verificationReport.comments}</p>
                 {issue.verificationReport.verificationPhotoUrl && (
                  <div>
                    <h4 className="font-semibold mb-2">Verification Photo:</h4>
                    <div className="rounded-lg overflow-hidden border w-full max-w-sm cursor-pointer" onClick={() => openLightbox(issue.verificationReport!.verificationPhotoUrl!)}>
                        <Image 
                            src={issue.verificationReport.verificationPhotoUrl} 
                            alt="Engineer verification"
                            width={400}
                            height={300}
                            className="object-cover"
                        />
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>}
        </div>

        <div className="lg:col-span-1 space-y-6 sticky top-20">
          {issue.estimationReport && <Card>
            <CardHeader><CardTitle>Cost Estimation</CardTitle>{fundManager && <CardDescription>By: {fundManager.name}</CardDescription>}</CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${issue.estimationReport.estimatedCost.toLocaleString()}</p>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">{issue.estimationReport.notes}</p>
            </CardContent>
          </Card>}
          {isApprovalPending ? (
            <Card>
              <CardHeader><CardTitle>Decision</CardTitle></CardHeader>
              <CardContent className="flex gap-4">
                <Button className="w-full" variant="destructive" onClick={handleReject}>
                  <X className="mr-2 h-4 w-4" /> Reject
                </Button>
                <Button className="w-full" onClick={handleApprove}>
                  <Check className="mr-2 h-4 w-4" /> Approve
                </Button>
              </CardContent>
            </Card>
          ) : (
             <Card>
                <CardHeader><CardTitle>Status: {issue.status}</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">This issue is not currently awaiting your approval.</p>
                </CardContent>
             </Card>
          )}
        </div>
      </div>
       <ImageLightbox
        isOpen={isLightboxOpen}
        onOpenChange={setLightboxOpen}
        imageUrl={lightboxImageUrl}
        alt="Verification photo"
      />
    </div>
  );
}
