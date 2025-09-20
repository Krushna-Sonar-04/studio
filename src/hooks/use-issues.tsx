"use client";

import { useState, useEffect, useCallback, createContext, useContext, ReactNode, useMemo } from 'react';
import { mockIssues as initialIssues } from '@/lib/mock-data';
import type { Issue } from '@/lib/types';

interface IssuesContextType {
    issues: Issue[];
    updateIssue: (issue: Issue) => void;
    addIssue: (issue: Issue) => void;
}

const IssuesContext = createContext<IssuesContextType | undefined>(undefined);

// The single source of truth for our mock data.
// In a real app, this would be your database.
let mockIssuesStore: Issue[] = [...initialIssues];

export function IssuesProvider({ children }: { children: ReactNode }) {
    const [issues, setIssues] = useState<Issue[]>([]);

    // This effect runs once to initialize the state from our mock store.
    useEffect(() => {
        setIssues(mockIssuesStore);
    }, []);
    
    // Function to update an issue
    const updateIssue = useCallback((issueToUpdate: Issue) => {
        const newIssues = mockIssuesStore.map(i => i.id === issueToUpdate.id ? issueToUpdate : i);
        mockIssuesStore = newIssues;
        setIssues(newIssues);
    }, []);
    
    // Function to add a new issue
    const addIssue = useCallback((newIssue: Issue) => {
        const newIssues = [newIssue, ...mockIssuesStore];
        mockIssuesStore = newIssues;
        setIssues(newIssues);
    }, []);
    
    // We use useMemo to ensure the context value object is stable unless its contents change.
    const contextValue = useMemo(() => ({
        issues,
        updateIssue,
        addIssue
    }), [issues, updateIssue, addIssue]);

    return (
        <IssuesContext.Provider value={contextValue}>
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
