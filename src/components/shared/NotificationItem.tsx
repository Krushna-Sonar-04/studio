
'use client';

import { Notification, NotificationType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { AlertTriangle, Bell, CheckCircle, Circle, FileText, Zap, Camera } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import React, { useState } from 'react';
import { ImageLightbox } from './ImageLightbox';
import { Button } from '../ui/button';

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
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  
  const Icon = notificationTypeConfig[notification.type]?.icon || Bell;
  const iconColor = notificationTypeConfig[notification.type]?.color || 'text-muted-foreground';

  const handleItemClick = () => {
    if (!notification.read) {
        onMarkAsRead(notification.id);
    }
    if (notification.issueId && !notification.imageUrl) {
      router.push(`/citizen/issues/${notification.issueId}`);
    }
  };

  const handleViewImageClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the main item click from firing
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    setLightboxOpen(true);
  };

  return (
    <>
      <div 
          onClick={handleItemClick}
          className={cn(
              "flex items-start gap-3 p-3 rounded-lg hover:bg-accent",
              notification.read ? "text-muted-foreground" : "text-foreground",
              (notification.issueId && !notification.imageUrl) && "cursor-pointer"
          )}
      >
        <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", iconColor)} />
        <div className="flex-1 space-y-1">
          <p className={cn("font-medium text-sm whitespace-pre-wrap", !notification.read && "font-semibold")}>
              {notification.title}
          </p>
          <p className="text-xs whitespace-pre-wrap">{notification.description}</p>
          
          {notification.imageUrl && (
            <Button variant="outline" size="sm" className="h-auto px-2 py-1 mt-2 text-xs" onClick={handleViewImageClick}>
              <Camera className="mr-2 h-3 w-3" />
              View 'After' Photo
            </Button>
          )}

          <p className="text-xs text-muted-foreground pt-1">
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
      {notification.imageUrl && (
        <ImageLightbox
          isOpen={isLightboxOpen}
          onOpenChange={setLightboxOpen}
          imageUrl={notification.imageUrl}
          alt={`After photo for issue ${notification.issueId}`}
        />
      )}
    </>
  );
});
