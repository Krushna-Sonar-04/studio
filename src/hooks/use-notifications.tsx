"use client";

import { useState, useEffect, useCallback, createContext, useContext, ReactNode, useMemo } from 'react';
import { mockNotifications as initialNotifications } from '@/lib/mock-data/notifications';
import type { Notification } from '@/lib/types';

interface NotificationsContextType {
    notifications: Notification[];
    addNotification: (notification: Notification) => void;
    updateNotification: (notification: Notification) => void;
    updateAllNotificationsForUser: (userId: string, updates: Partial<Pick<Notification, 'read'>>) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

let notificationsStore: Notification[] = [...initialNotifications];

export function NotificationsProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>(notificationsStore);
    
    useEffect(() => {
        setNotifications(notificationsStore);
    }, []);

    const addNotification = useCallback((newNotification: Notification) => {
        notificationsStore.unshift(newNotification);
        setNotifications([...notificationsStore]);
    }, []);

    const updateNotification = useCallback((notificationToUpdate: Notification) => {
        notificationsStore = notificationsStore.map(n => n.id === notificationToUpdate.id ? notificationToUpdate : n);
        setNotifications([...notificationsStore]);
    }, []);

    const updateAllNotificationsForUser = useCallback((userId: string, updates: Partial<Pick<Notification, 'read'>>) => {
        notificationsStore = notificationsStore.map(n => {
            if (n.userId === userId) {
                return { ...n, ...updates };
            }
            return n;
        });
        setNotifications([...notificationsStore]);
    }, []);

    const contextValue = useMemo(() => ({
        notifications,
        addNotification,
        updateNotification,
        updateAllNotificationsForUser
    }), [notifications, addNotification, updateNotification, updateAllNotificationsForUser]);


    return (
        <NotificationsContext.Provider value={contextValue}>
            {children}
        </NotificationsContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationsContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
}
