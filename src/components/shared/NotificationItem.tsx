'use client';

import { Notification, NotificationType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AlertTriangle, Bell, CheckCircle, Circle, FileText, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import React from 'react';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const notificationTypeConfig: Record<NotificationType, { icon: React.ElementType, color: string }> = {
    new_assignment: { icon: FileText, color: 'text-blue-500' },
    sla_alert: { icon: AlertTriangle, color: 'text-yellow-500' },
    escalation: { icon: Zap, color: 'text-red-500' },
    status_update: { icon: CheckCircle, color: 'text-green-500' },
};


export const NotificationItem = React.memo(function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const router = useRouter();
  const Icon = notificationTypeConfig[notification.type]?.icon || Bell;
  const iconColor = notificationTypeConfig[notification.type]?.color || 'text-muted-foreground';

  const handleClick = () => {
    if (!notification.read) {
        onMarkAsRead(notification.id);
    }
    if (notification.issueId) {
      router.push(`/citizen/issues/${notification.issueId}`);
    }
  };

  return (
    <div 
        onClick={handleClick}
        className={cn(
            "flex items-start gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer",
            notification.read ? "text-muted-foreground" : "text-foreground"
        )}
    >
      <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", iconColor)} />
      <div className="flex-1 space-y-1">
        <p className={cn("font-medium text-sm", !notification.read && "font-semibold")}>
            {notification.title}
        </p>
        <p className="text-xs">{notification.description}</p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
        </p>
      </div>
      {!notification.read && (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button onClick={(e) => { e.stopPropagation(); onMarkAsRead(notification.id); }} className="shrink-0 mt-1">
                      <Circle 
                          className="h-2.5 w-2.5 fill-primary text-primary"
                          aria-label="Unread"
                      />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Mark as read</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
});
