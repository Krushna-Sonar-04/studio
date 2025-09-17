'use client';

import { Issue } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, CircleDashed, CircleDot } from 'lucide-react';

interface IssueTimelineProps {
  statusHistory: Issue['statusHistory'];
  currentStatus: Issue['status'];
}

const statusMilestones: Issue['status'][] = [
  'Submitted',
  'Verified',
  'Approved',
  'InProgress',
  'Resolved',
];

export function IssueTimeline({ statusHistory, currentStatus }: IssueTimelineProps) {
  const getStatusIndex = (status: Issue['status']) => {
    const milestoneIndex = statusMilestones.indexOf(status);
    if (milestoneIndex > -1) return milestoneIndex;
    
    // Handle intermediate statuses
    if (['PendingVerificationAndEstimation'].includes(status)) return 0;
    if (['Estimated'].includes(status)) return 1;
    if (['PendingApproval'].includes(status)) return 1;
    if (['AssignedToContractor'].includes(status)) return 2;
    if (['Rejected', 'Closed'].includes(status)) return statusMilestones.length;

    return -1;
  };

  const currentStatusIndex = getStatusIndex(currentStatus);

  return (
    <div className="p-4">
      <ol className="relative grid grid-cols-5 text-center text-sm font-medium text-gray-500">
        {statusMilestones.map((milestone, index) => {
          const isActive = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;
          const isCompleted = index < currentStatusIndex;
          
          let statusUpdate = statusHistory.findLast(s => s.status === milestone);

          // For "Verified", we need to check both "Verified" and "Estimated" since they are parallel
          if (milestone === 'Verified') {
              const verifiedUpdate = statusHistory.findLast(s => s.status === 'Verified');
              const estimatedUpdate = statusHistory.findLast(s => s.status === 'Estimated');
              // Use the latest of the two if both exist
              if(verifiedUpdate && estimatedUpdate) {
                statusUpdate = new Date(verifiedUpdate.date) > new Date(estimatedUpdate.date) ? verifiedUpdate : estimatedUpdate;
              } else {
                statusUpdate = verifiedUpdate || estimatedUpdate;
              }
          }


          let Icon = Circle;
          if (isCurrent) Icon = CircleDot;
          if (isCompleted) Icon = CheckCircle;
          if (!isActive) Icon = CircleDashed;

          return (
            <li key={milestone} className="relative flex flex-col items-center">
              {index > 0 && (
                 <div
                 className={cn(
                   'absolute top-1/2 left-[-50%] w-full h-0.5 -translate-y-1/2',
                   index <= currentStatusIndex ? 'bg-primary' : 'bg-border'
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
                  {milestone === 'Verified' ? 'Verified & Estimated' : milestone}
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
