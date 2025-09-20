
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useIssues } from '@/hooks/use-issues';
import { mockUsers } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check, X, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Issue } from '@/lib/types';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ApprovalPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { issues, updateIssue } = useIssues();
  const id = params.id as string;
  const issue = issues.find((i) => i.id === id);

  const [isAssignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState('');
  const [slaDays, setSlaDays] = useState(15);

  if (!issue) {
    return <div className="text-center">Job not found.</div>;
  }
  
  const reporter = mockUsers.find(u => u.id === issue.reportedBy);
  const engineer = mockUsers.find(u => u.id === issue.assignedEngineerId);
  const fundManager = mockUsers.find(u => u.id === issue.assignedFundManagerId);
  const contractors = mockUsers.filter(u => u.role === 'Contractor' && u.active);

  const handleReject = () => {
    const updatedIssue: Issue = {
      ...issue,
      status: 'Rejected',
      currentRoles: [], // Ends the flow here
      statusHistory: [
        ...issue.statusHistory,
        {
          status: 'Rejected',
          date: new Date().toISOString(),
          updatedBy: 'Approving Manager',
          notes: 'Project has been rejected.',
        },
      ],
    };

    updateIssue(updatedIssue);
    toast({
      title: 'Project Rejected',
      description: 'The issue resolution has been rejected.',
    });
    router.push('/approving-manager/dashboard');
  };
  
  const handleApproveAndAssign = () => {
    if (!selectedContractor) {
        toast({ variant: 'destructive', title: 'Please select a contractor.' });
        return;
    }
    
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + slaDays);
    
    const updatedIssue: Issue = {
        ...issue,
        status: 'AssignedToContractor',
        currentRoles: ['Contractor'],
        assignedContractorId: selectedContractor,
        slaDays: slaDays,
        slaDeadline: deadline.toISOString(),
        statusHistory: [
            ...issue.statusHistory,
            {
                status: 'Approved',
                date: new Date().toISOString(),
                updatedBy: 'Approving Manager',
                notes: `Project approved.`,
            },
            {
                status: 'AssignedToContractor',
                date: new Date().toISOString(),
                updatedBy: 'Approving Manager',
                notes: `Assigned to contractor with a ${slaDays}-day SLA.`,
            }
        ]
    };
    
    updateIssue(updatedIssue);
    toast({
        title: 'Project Approved & Assigned',
        description: 'The job has been assigned to the contractor.',
    });
    setAssignDialogOpen(false);
    router.push('/approving-manager/dashboard');
  };

  return (
    <>
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
                <Button className="w-full" variant="destructive" onClick={handleReject}>
                  <X className="mr-2 h-4 w-4" /> Reject
                </Button>
                <Button className="w-full" onClick={() => setAssignDialogOpen(true)}>
                  <Check className="mr-2 h-4 w-4" /> Approve
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Assign Contractor Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve and Assign Contractor</DialogTitle>
            <DialogDescription>Select a contractor and set a deadline for issue: {issue?.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             <div className="space-y-2">
                <Label htmlFor="contractor-select">Contractor</Label>
                <Select onValueChange={setSelectedContractor} required>
                    <SelectTrigger id="contractor-select"><SelectValue placeholder="Select Contractor" /></SelectTrigger>
                    <SelectContent>{contractors.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="sla-days">SLA (in days)</Label>
                <Input 
                    id="sla-days" 
                    type="number" 
                    value={slaDays}
                    onChange={(e) => setSlaDays(parseInt(e.target.value, 10))}
                    min="1"
                />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleApproveAndAssign} disabled={!selectedContractor}>Approve & Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

