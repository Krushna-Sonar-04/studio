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
    const [notifications, setNotifications] = useState<Notification[]>([]);
    
    useEffect(() => {
        setNotifications(notificationsStore);
    }, []);

    const addNotification = useCallback((newNotification: Notification) => {
        const newNotifications = [newNotification, ...notificationsStore];
        notificationsStore = newNotifications;
        setNotifications(newNotifications);
    }, []);

    const updateNotification = useCallback((notificationToUpdate: Notification) => {
        const newNotifications = notificationsStore.map(n => n.id === notificationToUpdate.id ? notificationToUpdate : n);
        notificationsStore = newNotifications;
        setNotifications(newNotifications);
    }, []);

    const updateAllNotificationsForUser = useCallback((userId: string, updates: Partial<Pick<Notification, 'read'>>) => {
        const newNotifications = notificationsStore.map(n => {
            if (n.userId === userId && !n.read) {
                return { ...n, ...updates };
            }
            return n;
        });
        notificationsStore = newNotifications;
        setNotifications(newNotifications);
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
