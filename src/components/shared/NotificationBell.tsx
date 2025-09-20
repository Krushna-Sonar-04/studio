'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Notification as NotificationType, User } from '@/lib/types';
import { NotificationItem } from './NotificationItem';
import { useNotifications } from '@/hooks/use-notifications';

interface NotificationBellProps {
    user: User;
}

export function NotificationBell({ user }: NotificationBellProps) {
    const { notifications, updateNotification, updateAllNotificationsForUser } = useNotifications();
    const [userNotifications, setUserNotifications] = useState<NotificationType[]>([]);
    
    useEffect(() => {
        // Filter notifications for the logged-in user
        const filtered = notifications
            .filter(n => n.userId === user.id)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setUserNotifications(filtered);
    }, [user.id, notifications]);

    const unreadCount = useMemo(() => {
        return userNotifications.filter(n => !n.read).length;
    }, [userNotifications]);

    const handleMarkAsRead = (id: string) => {
        const notification = userNotifications.find(n => n.id === id);
        if (notification) {
            updateNotification({ ...notification, read: true });
        }
    };

    const handleMarkAllRead = () => {
         updateAllNotificationsForUser(user.id, { read: true });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-white flex items-center justify-center text-xs">
                            {unreadCount}
                        </div>
                    )}
                    <span className="sr-only">Open notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
                <div className="p-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-medium">Notifications</h4>
                        {unreadCount > 0 && (
                            <Button variant="link" size="sm" onClick={handleMarkAllRead} className="p-0 h-auto">
                                Mark all as read
                            </Button>
                        )}
                    </div>
                </div>
                <Separator />
                <ScrollArea className="h-96">
                   {userNotifications.length > 0 ? (
                        <div className="p-2">
                            {userNotifications.map(notification => (
                                <NotificationItem 
                                    key={notification.id}
                                    notification={notification}
                                    onMarkAsRead={() => handleMarkAsRead(notification.id)}
                                />
                            ))}
                        </div>
                   ) : (
                        <div className="text-center text-sm text-muted-foreground p-8">
                            You have no notifications.
                        </div>
                   )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
