'use client';

import { useParams, useRouter } from 'next/navigation';
import { mockIssues, mockUsers } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check, X, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ApprovalPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;
  const issue = mockIssues.find((i) => i.id === id);

  if (!issue) {
    return <div className="text-center">Job not found.</div>;
  }
  
  const reporter = mockUsers.find(u => u.id === issue.reportedBy);
  const engineer = mockUsers.find(u => u.id === issue.assignedEngineerId);
  const fundManager = mockUsers.find(u => u.id === issue.assignedFundManagerId);

  const handleDecision = (approved: boolean) => {
    toast({
      title: `Project ${approved ? 'Approved' : 'Rejected'}`,
      description: `The issue resolution has been ${approved ? 'approved' : 'rejected'}. (Simulated)`,
    });
    router.push('/approving-manager/dashboard');
  };

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
            <CardContent><p>{issue.verificationReport.comments}</p></CardContent>
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
           <Card>
            <CardHeader><CardTitle>Decision</CardTitle></CardHeader>
            <CardContent className="flex gap-4">
              <Button className="w-full" variant="destructive" onClick={() => handleDecision(false)}>
                <X className="mr-2 h-4 w-4" /> Reject
              </Button>
              <Button className="w-full" onClick={() => handleDecision(true)}>
                <Check className="mr-2 h-4 w-4" /> Approve
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
