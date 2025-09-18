'use client';

import { useState } from 'react';
import { mockIssues, setMockIssues } from '@/lib/mock-data';
import { Issue, User } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MoreHorizontal, Bell, AlertTriangle, Play, CheckCircle, Megaphone, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { mockUsers } from '@/lib/mock-data';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isAssignTaskOpen, setAssignTaskOpen] = useState(false);
  const [isAssignContractorOpen, setAssignContractorOpen] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState('');
  const [selectedContractor, setSelectedContractor] = useState('');
  const [slaDays, setSlaDays] = useState(10);

  const engineers = mockUsers.filter(u => u.role === 'Engineer');
  const contractors = mockUsers.filter(u => u.role === 'Contractor');

  const handleAssignTask = () => {
    if (selectedIssue && selectedEngineer) {
       const deadline = new Date();
       deadline.setDate(deadline.getDate() + slaDays);

      const updatedIssues = issues.map(issue => {
        if (issue.id === selectedIssue.id) {
          return {
            ...issue,
            status: 'PendingVerificationAndEstimation' as const,
            currentRoles: ['Engineer'],
            assignedEngineerId: selectedEngineer,
            slaDays: slaDays,
            slaDeadline: deadline.toISOString(),
            statusHistory: [
              ...issue.statusHistory,
              {
                status: 'PendingVerificationAndEstimation' as const,
                date: new Date().toISOString(),
                updatedBy: 'Admin',
                notes: `Assigned to Engineer for verification with a ${slaDays}-day SLA.`,
              },
            ],
          };
        }
        return issue;
      });
      setMockIssues(updatedIssues);
      setIssues(updatedIssues);
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
      toast({ title: 'Contractor Assigned (Simulated)' });
      setAssignContractorOpen(false);
      setSelectedIssue(null);
    }
  };

  const stats = {
    new: issues.filter(i => i.status === 'Submitted').length,
    pendingVerification: issues.filter(i => i.status === 'PendingVerificationAndEstimation').length,
    inProgress: issues.filter(i => i.status === 'InProgress' || i.status === 'AssignedToContractor').length,
    resolved: issues.filter(i => i.status === 'Resolved' || i.status === 'Closed').length,
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reported On</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map(issue => (
                <TableRow key={issue.id}>
                  <TableCell className="font-medium cursor-pointer" onClick={() => router.push(`/citizen/issues/${issue.id}`)}>{issue.id}</TableCell>
                  <TableCell className="cursor-pointer" onClick={() => router.push(`/citizen/issues/${issue.id}`)}>{issue.title}</TableCell>
                  <TableCell className="cursor-pointer" onClick={() => router.push(`/citizen/issues/${issue.id}`)}>
                    <Badge variant={issue.escalated ? 'destructive' : 'secondary'}>
                      {issue.escalated && <ShieldAlert className="mr-1 h-3 w-3" />}
                      {issue.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="cursor-pointer" onClick={() => router.push(`/citizen/issues/${issue.id}`)}>{new Date(issue.reportedAt).toLocaleDateString()}</TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedIssue(issue); setAssignTaskOpen(true); }} disabled={issue.status !== 'Submitted'}>
                          Assign for Verification
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedIssue(issue); setAssignContractorOpen(true); }} disabled={issue.status !== 'Approved'}>
                          Assign to Contractor
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
            <Button onClick={handleAssignContractor}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
