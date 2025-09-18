'use client';

import { useState } from 'react';
import { useIssues } from '@/hooks/use-issues';
import { mockUsers } from '@/lib/mock-data';
import { Issue } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Bell, AlertTriangle, Play, CheckCircle, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { IssueDataTable } from '@/components/admin/IssueDataTable';
import { issueColumns } from '@/components/admin/IssueColumns';

export default function AdminDashboard() {
  const { toast } = useToast();
  const { issues, updateIssue, getIssues } = useIssues();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isAssignTaskOpen, setAssignTaskOpen] = useState(false);
  const [isAssignContractorOpen, setAssignContractorOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState('');
  const [selectedContractor, setSelectedContractor] = useState('');
  const [slaDays, setSlaDays] = useState(10);

  const engineers = mockUsers.filter(u => u.role === 'Engineer');
  const contractors = mockUsers.filter(u => u.role === 'Contractor');

  const openAssignDialog = (issue: Issue) => {
    setSelectedIssue(issue);
    setAssignTaskOpen(true);
  };
  
  const openContractorDialog = (issue: Issue) => {
    setSelectedIssue(issue);
    setAssignContractorOpen(true);
  };

  const handleAssignTask = () => {
    if (selectedIssue && selectedEngineer) {
       const deadline = new Date();
       deadline.setDate(deadline.getDate() + slaDays);

       const updatedIssue: Issue = {
         ...selectedIssue,
         status: 'PendingVerificationAndEstimation',
         currentRoles: ['Engineer'],
         assignedEngineerId: selectedEngineer,
         slaDays: slaDays,
         slaDeadline: deadline.toISOString(),
         statusHistory: [
           ...selectedIssue.statusHistory,
           {
             status: 'PendingVerificationAndEstimation',
             date: new Date().toISOString(),
             updatedBy: 'Admin',
             notes: `Assigned to Engineer for verification with a ${slaDays}-day SLA.`,
           },
         ],
       };

      updateIssue(updatedIssue);
      toast({ title: 'Task Assigned', description: `Issue sent to Engineer with a ${slaDays}-day SLA.` });
      setAssignTaskOpen(false);
      setSelectedIssue(null);
      setSelectedEngineer('');
      setSlaDays(10);
    }
  };

  const handleAssignContractor = () => {
    if (selectedIssue && selectedContractor) {
      console.log(`Assigning issue ${selectedIssue.id} to Contractor ${selectedContractor}`);
       const updatedIssue: Issue = {
        ...selectedIssue,
        status: 'AssignedToContractor',
        assignedContractorId: selectedContractor,
        currentRoles: ['Contractor'],
        statusHistory: [
          ...selectedIssue.statusHistory,
          {
            status: 'AssignedToContractor',
            date: new Date().toISOString(),
            updatedBy: 'Admin',
            notes: `Work assigned to Contractor.`,
          },
        ],
      };
      updateIssue(updatedIssue);
      toast({ title: 'Contractor Assigned', description: `Issue assigned to contractor for execution.` });
      setAssignContractorOpen(false);
      setSelectedIssue(null);
    }
  };

  const currentIssues = getIssues();

  const stats = {
    new: currentIssues.filter(i => i.status === 'Submitted').length,
    pendingVerification: currentIssues.filter(i => i.status === 'PendingVerificationAndEstimation').length,
    inProgress: currentIssues.filter(i => i.status === 'InProgress' || i.status === 'AssignedToContractor').length,
    resolved: currentIssues.filter(i => i.status === 'Resolved' || i.status === 'Closed').length,
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of all civic issues.</p>
        </div>
        <Link href="/admin/broadcast">
            <Button>
                <Megaphone className="mr-2 h-4 w-4" />
                Send Broadcast
            </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Reports</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.new}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.pendingVerification}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.inProgress}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.resolved}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>All Issues</CardTitle></CardHeader>
        <CardContent>
          <IssueDataTable 
            columns={issueColumns({ openAssignDialog, openContractorDialog })} 
            data={currentIssues}
          />
        </CardContent>
      </Card>

      {/* Assign Task Dialog */}
      <Dialog open={isAssignTaskOpen} onOpenChange={setAssignTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign for Verification</DialogTitle>
            <DialogDescription>Assign an Engineer and set an SLA for issue: {selectedIssue?.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="engineer-select">Engineer</Label>
                <Select onValueChange={setSelectedEngineer} required>
                    <SelectTrigger id="engineer-select"><SelectValue placeholder="Select Engineer" /></SelectTrigger>
                    <SelectContent>{engineers.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
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
            <Button variant="outline" onClick={() => setAssignTaskOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignTask} disabled={!selectedEngineer}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Assign Contractor Dialog */}
      <Dialog open={isAssignContractorOpen} onOpenChange={setAssignContractorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign to Contractor</DialogTitle>
            <DialogDescription>Assign a Contractor for issue: {selectedIssue?.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select onValueChange={setSelectedContractor}>
              <SelectTrigger><SelectValue placeholder="Select Contractor" /></SelectTrigger>
              <SelectContent>{contractors.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignContractorOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignContractor} disabled={!selectedContractor}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
