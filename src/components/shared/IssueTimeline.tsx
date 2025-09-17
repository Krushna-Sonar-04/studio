'use client';

import { Issue } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, CircleDashed, CircleDot, FileCheck, Search, ShieldCheck } from 'lucide-react';

interface IssueTimelineProps {
  statusHistory: Issue['statusHistory'];
  currentStatus: Issue['status'];
}

// Corresponds to the detailed 10-step workflow
const statusMilestones: { status: Issue['status'], label: string }[] = [
  { status: 'Submitted', label: 'Submitted' },
  { status: 'PendingVerificationAndEstimation', label: 'Assigned' },
  { status: 'Verified', label: 'Verified & Estimated' },
  { status: 'Approved', label: 'Approved' },
  { status: 'InProgress', label: 'Work In Progress' },
  { status: 'Resolved', label: 'Work Completed' },
  { status: 'Closed', label: 'Resolved' },
];

export function IssueTimeline({ statusHistory, currentStatus }: IssueTimelineProps) {
  const getStatusIndex = (status: Issue['status']) => {
    // This finds the first milestone that includes the current status.
    const milestoneIndex = statusMilestones.findIndex(m => m.status === status);
    if (milestoneIndex > -1) return milestoneIndex;
    
    // Handle intermediate statuses to map them to the correct visual step
    if (status === 'Estimated' || status === 'PendingApproval') return 2; // Part of "Verified & Estimated" step
    if (status === 'AssignedToContractor') return 3; // Happens after "Approved"
    if (status === 'PendingFinalVerification') return 5; // Happens after "Work Completed"
    if (status === 'Rejected') return statusMilestones.length; // A final state outside the main flow
    
    return 0; // Default to the first step
  };

  const currentStatusIndex = getStatusIndex(currentStatus);

  return (
    <div className="p-4">
      <ol className="relative grid grid-cols-7 text-center text-sm font-medium text-gray-500">
        {statusMilestones.map((milestone, index) => {
          const isActive = index <= currentStatusIndex;
          const isCurrent = index === currentStatusIndex;
          const isCompleted = index < currentStatusIndex;
          
          let statusUpdate = statusHistory.findLast(s => {
            // Special handling for the combined "Verified & Estimated" step
            if (milestone.status === 'Verified') {
              return s.status === 'Verified' || s.status === 'Estimated' || s.status === 'PendingApproval';
            }
             // "Work Completed" is when the contractor marks it "Resolved"
            if(milestone.status === 'Resolved' && s.status === 'Resolved') {
              return true;
            }
            // "Resolved" is the final "Closed" state from admin
             if(milestone.status === 'Closed' && s.status === 'Closed') {
              return true;
            }
            return s.status === milestone.status
          });
          
          // Get the latest update for the combined step
          if (milestone.status === 'Verified') {
              const verifiedUpdate = statusHistory.findLast(s => s.status === 'Verified');
              const estimatedUpdate = statusHistory.findLast(s => s.status === 'Estimated');
              if (verifiedUpdate && estimatedUpdate) {
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
            <li key={milestone.status} className="relative flex flex-col items-center">
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
