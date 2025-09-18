import { Notification } from '@/lib/types';
import { subHours, subMinutes } from 'date-fns';

export let mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-3', // Engineer Chirag Kumar
    type: 'new_assignment',
    title: 'New Issue Assigned',
    description: 'Pothole on Main Street needs verification.',
    issueId: 'issue-1',
    timestamp: subMinutes(new Date(), 5).toISOString(),
    read: false,
  },
  {
    id: 'notif-2',
    userId: 'user-5', // Approving Manager Esha Verma
    type: 'sla_alert',
    title: 'SLA Breach Warning',
    description: 'Streetlight outage issue is approaching its SLA deadline.',
    issueId: 'issue-2',
    timestamp: subHours(new Date(), 1).toISOString(),
    read: false,
  },
  {
    id: 'notif-3',
    userId: 'user-2', // Head of Dept Bhavin Shah
    type: 'escalation',
    title: 'Issue Escalated',
    description: 'Fallen tree on Oak Lane has breached its SLA and is now escalated.',
    issueId: 'issue-7',
    timestamp: subHours(new Date(), 3).toISOString(),
    read: true,
  },
  {
    id: 'notif-4',
    userId: 'user-6', // Contractor Farhan Ali
    type: 'new_assignment',
    title: 'New Job Assigned',
    description: 'Overflowing garbage bin at City Park is ready for work.',
    issueId: 'issue-3',
    timestamp: subHours(new Date(), 8).toISOString(),
    read: true,
  },
   {
    id: 'notif-5',
    userId: 'user-1', // Citizen Alia Reddy
    type: 'status_update',
    title: 'Your issue has been resolved!',
    description: 'The Water Main Break at 55 Elm Street is now marked as Resolved.',
    issueId: 'issue-4',
    timestamp: subHours(new Date(), 12).toISOString(),
    read: true,
  },
];

export const setMockNotifications = (newNotifications: Notification[]) => {
    mockNotifications = newNotifications;
};
