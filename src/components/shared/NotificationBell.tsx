'use client';

import { useEffect, useMemo, useState } from 'react';
import { Bell, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { mockNotifications, setMockNotifications } from '@/lib/mock-data/notifications';
import { Notification as NotificationType, User } from '@/lib/types';
import { NotificationItem } from './NotificationItem';

interface NotificationBellProps {
    user: User;
}

export function NotificationBell({ user }: NotificationBellProps) {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    
    useEffect(() => {
        // Filter notifications for the logged-in user
        const userNotifications = mockNotifications
            .filter(n => n.userId === user.id)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setNotifications(userNotifications);
    }, [user.id]);

    const unreadCount = useMemo(() => {
        return notifications.filter(n => !n.read).length;
    }, [notifications]);

    const handleMarkAsRead = (id: string) => {
        const updatedNotifications = notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        );
        setNotifications(updatedNotifications);
        // This would also be where you update the master list/database
        const globalUpdated = mockNotifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        );
        setMockNotifications(globalUpdated);
    };

    const handleMarkAllRead = () => {
         const updatedNotifications = notifications.map(n => ({...n, read: true}));
         setNotifications(updatedNotifications);
         const globalUpdated = mockNotifications.map(n => 
            n.userId === user.id ? { ...n, read: true } : n
        );
        setMockNotifications(globalUpdated);
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
            <PopoverContent className="w-80 p-0" align="end">
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
                   {notifications.length > 0 ? (
                        <div className="p-2">
                            {notifications.map(notification => (
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
