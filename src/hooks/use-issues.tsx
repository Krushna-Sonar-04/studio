"use client";

import { useState, useEffect, useCallback, createContext, useContext, ReactNode, useMemo } from 'react';
import { mockIssues as initialIssues } from '@/lib/mock-data';
import type { Issue } from '@/lib/types';

interface IssuesContextType {
    issues: Issue[];
    getIssues: () => Issue[];
    updateIssue: (issue: Issue) => void;
    addIssue: (issue: Issue) => void;
}

const IssuesContext = createContext<IssuesContextType | undefined>(undefined);

// The single source of truth for our mock data.
// In a real app, this would be your database.
let mockIssuesStore: Issue[] = [...initialIssues];

export function IssuesProvider({ children }: { children: ReactNode }) {
    const [issues, setIssues] = useState<Issue[]>(mockIssuesStore);

    // This effect runs once to initialize the state from our mock store.
    // In a real app, you might fetch initial data here.
    useEffect(() => {
        setIssues(mockIssuesStore);
    }, []);

    const getIssues = useCallback(() => {
        return issues;
    }, [issues]);
    
    // Function to update an issue
    const updateIssue = useCallback((issueToUpdate: Issue) => {
        mockIssuesStore = mockIssuesStore.map(i => i.id === issueToUpdate.id ? issueToUpdate : i);
        setIssues([...mockIssuesStore]);
    }, []);
    
    // Function to add a new issue
    const addIssue = useCallback((newIssue: Issue) => {
        mockIssuesStore.unshift(newIssue);
        setIssues([...mockIssuesStore]);
    }, []);
    
    // We use useMemo to ensure the context value object is stable unless its contents change.
    const contextValue = useMemo(() => ({
        issues,
        getIssues,
        updateIssue,
        addIssue
    }), [issues, getIssues, updateIssue, addIssue]);

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
