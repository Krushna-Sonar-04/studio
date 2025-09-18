"use client";

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { mockIssues as initialIssues } from '@/lib/mock-data';
import type { Issue } from '@/lib/types';

// This is a simple in-memory event emitter to notify subscribers of changes.
// In a real-world scenario, this would be replaced by a more robust state
// management library (like Zustand or Redux) or a real-time data fetching
// library (like React Query with WebSockets or SWR).
const createEventEmitter = () => {
    const listeners = new Set<(data: Issue[]) => void>();
    return {
        subscribe: (listener: (data: Issue[]) => void) => {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        emit: (data: Issue[]) => {
            for (const listener of listeners) {
                listener(data);
            }
        },
    };
};

const issueEventEmitter = createEventEmitter();

// The single source of truth for our mock data.
let mockIssuesStore: Issue[] = [...initialIssues];

const updateMockIssues = (updatedIssue: Issue) => {
    const index = mockIssuesStore.findIndex(i => i.id === updatedIssue.id);
    if (index !== -1) {
        mockIssuesStore[index] = updatedIssue;
    } else {
         // This case should not happen if we only update
        console.warn("Attempted to update an issue that does not exist.");
    }
    issueEventEmitter.emit([...mockIssuesStore]);
};

const addMockIssue = (newIssue: Issue) => {
    mockIssuesStore.unshift(newIssue);
    issueEventEmitter.emit([...mockIssuesStore]);
};

// --- React Hook and Provider ---

interface IssuesContextType {
    issues: Issue[];
    getIssues: () => Issue[];
    updateIssue: (issue: Issue) => void;
    addIssue: (issue: Issue) => void;
}

const IssuesContext = createContext<IssuesContextType | undefined>(undefined);

export function IssuesProvider({ children }: { children: ReactNode }) {
    const [issues, setIssues] = useState<Issue[]>(mockIssuesStore);

    useEffect(() => {
        const unsubscribe = issueEventEmitter.subscribe(setIssues);
        return () => unsubscribe();
    }, []);

    const getIssues = useCallback(() => {
        return issues;
    }, [issues]);

    const updateIssue = useCallback((issueToUpdate: Issue) => {
        updateMockIssues(issueToUpdate);
    }, []);
    
    const addIssue = useCallback((newIssue: Issue) => {
        addMockIssue(newIssue);
    }, []);


    return (
        <IssuesContext.Provider value={{ issues, getIssues, updateIssue, addIssue }}>
            {children}
        </IssuesContext.Provider>
    );
}

export function useIssues() {
    const context = useContext(IssuesContext);
    if (context === undefined) {
        throw new Error('useIssues must be used within an IssuesProvider');
    }
    return context;
}
