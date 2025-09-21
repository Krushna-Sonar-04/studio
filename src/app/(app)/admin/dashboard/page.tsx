'use client';

import { useState, useMemo } from 'react';
import { useIssues } from '@/hooks/use-issues';
import { mockUsers } from '@/lib/mock-data';
import { Issue, Notification } from '@/lib/types';
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
import { useNotifications } from '@/hooks/use-notifications';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';

const DynamicIssueDataTable = dynamic(
  () => import('@/components/admin/IssueDataTable').then(mod => mod.IssueDataTable),
  {
    loading: () => <Skeleton className="h-[400px] w-full" />,
    ssr: false,
  }
);


export default function AdminDashboard() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { issues, updateIssue } = useIssues();
  const { addNotification } = useNotifications();
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

      // Create a notification for the engineer
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        userId: selectedEngineer,
        type: 'new_assignment',
        title: 'New Issue Assigned',
        description: `Issue "${selectedIssue.title}" has been assigned to you for verification.`,
        issueId: selectedIssue.id,
        timestamp: new Date().toISOString(),
        read: false,
      };
      addNotification(notification);

      toast({ title: t('task_assigned_toast_title'), description: t('task_assigned_toast_desc', { slaDays }) });
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
      toast({ title: t('contractor_assigned_toast_title'), description: t('contractor_assigned_toast_desc') });
      setAssignContractorOpen(false);
      setSelectedIssue(null);
    }
  };

  const currentIssues = useMemo(() => issues, [issues]);

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
          <h1 className="text-3xl font-headline font-bold">{t('admin_dashboard_title')}</h1>
          <p className="text-muted-foreground">{t('admin_dashboard_subtitle')}</p>
        </div>
        <Link href="/admin/broadcast">
            <Button>
                <Megaphone className="mr-2 h-4 w-4" />
                {t('send_broadcast_button')}
            </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('new_reports_stat')}</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.new}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('pending_verification_stat')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.pendingVerification}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('in_progress_stat')}</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.inProgress}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('resolved_stat')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.resolved}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>{t('all_issues_title')}</CardTitle></CardHeader>
        <CardContent className="pt-6">
          <DynamicIssueDataTable 
            columns={issueColumns({ openAssignDialog, openContractorDialog })} 
            data={currentIssues}
          />
        </CardContent>
      </Card>

      {/* Assign Task Dialog */}
      <Dialog open={isAssignTaskOpen} onOpenChange={setAssignTaskOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('assign_verification_dialog_title')}</DialogTitle>
            <DialogDescription>{t('assign_verification_dialog_desc', { issueId: selectedIssue?.id })}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="engineer-select">{t('engineer_label')}</Label>
                <Select onValueChange={setSelectedEngineer} required>
                    <SelectTrigger id="engineer-select"><SelectValue placeholder={t('select_engineer_placeholder')} /></SelectTrigger>
                    <SelectContent>{engineers.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="sla-days">{t('sla_days_label')}</Label>
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
            <Button variant="outline" onClick={() => setAssignTaskOpen(false)}>{t('cancel_button')}</Button>
            <Button onClick={handleAssignTask} disabled={!selectedEngineer}>{t('assign_button')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Assign Contractor Dialog */}
      <Dialog open={isAssignContractorOpen} onOpenChange={setAssignContractorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('assign_contractor_dialog_title')}</DialogTitle>
            <DialogDescription>{t('assign_contractor_dialog_desc', { issueId: selectedIssue?.id })}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select onValueChange={setSelectedContractor}>
              <SelectTrigger><SelectValue placeholder={t('select_contractor_placeholder')} /></SelectTrigger>
              <SelectContent>{contractors.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignContractorOpen(false)}>{t('cancel_button')}</Button>
            <Button onClick={handleAssignContractor} disabled={!selectedContractor}>{t('assign_button')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
