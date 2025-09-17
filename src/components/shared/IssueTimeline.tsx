'use client';

import { Issue } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, CircleDashed, CircleDot } from 'lucide-react';

interface IssueTimelineProps {
  statusHistory: Issue['statusHistory'];
  currentStatus: Issue['status'];
}

const statusMilestones: { status: Issue['status'] | string, label: string }[] = [
  { status: 'Submitted', label: 'Submitted' },
  { status: 'PendingVerificationAndEstimation', label: 'Assigned' },
  { status: 'Verified', label: 'Verified' },
  { status: 'Estimated', label: 'Fund Approved' },
  { status: 'Approved', label: 'Approved' },
  { status: 'InProgress', label: 'Work In Progress' },
  { status: 'Resolved', label: 'Resolved' }
];

export function IssueTimeline({ statusHistory, currentStatus }: IssueTimelineProps) {
  const getStatusIndex = (status: Issue['status']) => {
    switch (status) {
      case 'Submitted': return 0;
      case 'PendingVerificationAndEstimation': return 1;
      case 'Verified': return 2;
      case 'Estimated': return 3;
      case 'PendingApproval': return 3; // After estimation, before approval
      case 'Approved': return 4;
      case 'AssignedToContractor': return 4;
      case 'InProgress': return 5;
      case 'Resolved': return 6;
      case 'PendingFinalVerification': return 6;
      case 'Closed': return 6;
      default: return 0;
    }
  };

  const currentStatusIndex = getStatusIndex(currentStatus);

  return (
    <div className="p-4">
      <ol className="relative grid grid-cols-7 text-center text-sm font-medium text-gray-500">
        {statusMilestones.map((milestone, index) => {
          const isActive = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;
          const isCompleted = index < currentStatusIndex;
          
          const statusUpdate = statusHistory.findLast(s => {
            const milestoneIndexForUpdate = getStatusIndex(s.status);
            return milestoneIndexForUpdate === index;
          });

          let Icon = Circle;
          if (isCurrent && currentStatus !== 'Closed') Icon = CircleDot;
          if (isCompleted || currentStatus === 'Closed') Icon = CheckCircle;
          if (!isActive) Icon = CircleDashed;

          return (
            <li key={milestone.label} className="relative flex flex-col items-center">
              {index > 0 && (
                 <div
                 className={cn(
                   'absolute top-1/2 left-[-50%] w-full h-0.5 -translate-y-1/2',
                   isActive ? 'bg-primary' : 'bg-border'
                 )}
               />
              )}
              <span className="flex items-center justify-center flex-col z-10">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full bg-background',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className={cn("font-semibold mt-2", isActive && 'text-foreground')}>
                  {milestone.label}
                </h3>
                {statusUpdate && (
                    <div className="text-xs text-muted-foreground mt-1">
                        <p>{new Date(statusUpdate.date).toLocaleDateString()}</p>
                        <p>by {statusUpdate.updatedBy}</p>
                    </div>
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
