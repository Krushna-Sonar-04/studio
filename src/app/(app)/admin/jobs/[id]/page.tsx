
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useIssues } from '@/hooks/use-issues';
import { mockUsers } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Send } from 'lucide-react';
import type { Issue, Notification } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNotifications } from '@/hooks/use-notifications';

export default function AdminJobAssignmentPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { issues, updateIssue } = useIssues();
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const id = params.id as string;
  const issue = issues.find((i) => i.id === id);
  
  const [isAssignDialogOpen, setAssignDialogOpen] = useState(true); // Open by default on this page
  const [selectedContractor, setSelectedContractor] = useState('');
  const [slaDays, setSlaDays] = useState(15);

  const contractors = mockUsers.filter(u => u.role === 'Contractor' && u.active);

  if (!issue) {
    return <div className="text-center">Issue not found.</div>;
  }
  
  const handleAssignContractor = () => {
    if (!selectedContractor || !user) {
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
                status: 'AssignedToContractor',
                date: new Date().toISOString(),
                updatedBy: user.name,
                notes: `Assigned to contractor with a ${slaDays}-day SLA.`,
            }
        ]
    };
    
    updateIssue(updatedIssue);

    const contractorNotification: Notification = {
        id: `notif-contractor-${Date.now()}`,
        userId: selectedContractor,
        type: 'new_assignment',
        title: 'New Job Assigned',
        description: `You have been assigned to work on issue: "${issue.title}".`,
        issueId: issue.id,
        timestamp: new Date().toISOString(),
        read: false,
    };
    addNotification(contractorNotification);

    toast({
        title: 'Project Assigned',
        description: 'The job has been assigned to the contractor.',
    });
    setAssignDialogOpen(false);
    router.push('/admin/dashboard');
  };

  const handleCancel = () => {
      setAssignDialogOpen(false);
      router.back();
  }


  return (
    <div className="space-y-8">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>
      
      <Card>
          <CardHeader>
              <CardTitle>Assign Approved Job</CardTitle>
              <CardDescription>Issue: {issue.title} (Status: {issue.status})</CardDescription>
          </CardHeader>
          <CardContent>
              <p>This issue has been approved and now needs to be assigned to a contractor for execution.</p>
          </CardContent>
      </Card>

      {/* This dialog is the main purpose of the page */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent onEscapeKeyDown={handleCancel} onPointerDownOutside={handleCancel}>
          <DialogHeader>
            <DialogTitle>Assign Contractor</DialogTitle>
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
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleAssignContractor} disabled={!selectedContractor}>
                <Send className="mr-2 h-4 w-4" />
                Assign Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
