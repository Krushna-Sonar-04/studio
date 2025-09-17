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
      case 'PendingApproval': return 4;
      case 'Approved': return 4;
      case 'AssignedToContractor': return 4;
      case 'InProgress': return 5;
      case 'Resolved': return 6;
      case 'PendingFinalVerification': return 6;
      case 'Closed': return 6;
      default: return -1;
    }
  };

  const currentStatusIndex = getStatusIndex(currentStatus);

  return (
    <div className="p-4 md:p-6">
      <div className="relative">
        {/* The main timeline bar */}
        <div className="absolute top-5 left-0 w-full h-1 bg-border -translate-y-1/2"></div>
        <div
            className="absolute top-5 left-0 h-1 bg-primary -translate-y-1/2"
            style={{ width: `${(currentStatusIndex / (statusMilestones.length - 1)) * 100}%` }}
        ></div>

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
            if (isCurrent && currentStatus !== 'Closed' && currentStatus !== 'Resolved') Icon = CircleDot;
            if (isCompleted || currentStatus === 'Closed' || currentStatus === 'Resolved' && index <= currentStatusIndex) Icon = CheckCircle;
            if (!isActive) Icon = CircleDashed;

            return (
                <li key={milestone.label} className="relative flex flex-col items-center">
                <div
                    className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full bg-background z-10',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                >
                    <Icon className="h-7 w-7" />
                </div>
                <div className="mt-4">
                    <h3 className={cn("font-semibold", isActive && 'text-foreground')}>
                    {milestone.label}
                    </h3>
                    {statusUpdate && (
                        <div className="text-xs text-muted-foreground mt-1">
                            <p>{new Date(statusUpdate.date).toLocaleDateString()}</p>
                            {statusUpdate.updatedBy && <p>by {statusUpdate.updatedBy}</p>}
                        </div>
                    )}
                </div>
                </li>
            );
            })}
        </ol>
      </div>
    </div>
  );
}
