"use client";

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { mockNotifications as initialNotifications, addMockNotification as addMockNotificationToStore, setMockNotifications as setMockNotificationsInStore } from '@/lib/mock-data/notifications';
import type { Notification } from '@/lib/types';

const createEventEmitter = () => {
    const listeners = new Set<(data: Notification[]) => void>();
    return {
        subscribe: (listener: (data: Notification[]) => void) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        emit: (data: Notification[]) => {
            for (const listener of listeners) {
                listener(data);
            }
        },
    };
};

const notificationEventEmitter = createEventEmitter();

let notificationsStore: Notification[] = [...initialNotifications];

const updateStoreAndEmit = () => {
    notificationEventEmitter.emit([...notificationsStore]);
};

const addNotification = (newNotification: Notification) => {
    notificationsStore.unshift(newNotification);
    updateStoreAndEmit();
};

const updateNotification = (notificationToUpdate: Notification) => {
    notificationsStore = notificationsStore.map(n => n.id === notificationToUpdate.id ? notificationToUpdate : n);
    updateStoreAndEmit();
};

const updateAllNotificationsForUser = (userId: string, updates: Partial<Notification>) => {
    notificationsStore = notificationsStore.map(n => n.userId === userId ? { ...n, ...updates } : n);
    updateStoreAndEmit();
}

interface NotificationsContextType {
    notifications: Notification[];
    addNotification: (notification: Notification) => void;
    updateNotification: (notification: Notification) => void;
    updateAllNotificationsForUser: (userId: string, updates: Partial<Notification>) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>(notificationsStore);

    useEffect(() => {
        const unsubscribe = notificationEventEmitter.subscribe(setNotifications);
        return () => unsubscribe();
    }, []);

    return (
        <NotificationsContext.Provider value={{ notifications, addNotification, updateNotification, updateAllNotificationsForUser }}>
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
