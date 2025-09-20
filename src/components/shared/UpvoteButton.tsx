'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { ClientOnly } from './ClientOnly';

interface UpvoteButtonProps {
  issueId: string;
  initialUpvotes: number;
  initialHasUpvoted: boolean;
  onUpvoteChange: (issueId: string, newUpvoteCount: number, userHasUpvoted: boolean) => void;
}

export function UpvoteButton({
  issueId,
  initialUpvotes,
  initialHasUpvoted,
  onUpvoteChange,
}: UpvoteButtonProps) {
  const { user } = useAuth();
  const [upvoteCount, setUpvoteCount] = useState(initialUpvotes);
  const [hasUpvoted, setHasUpvoted] = useState(initialHasUpvoted);

  // Effect to sync with initial props from server, which might change
  useEffect(() => {
    setUpvoteCount(initialUpvotes);
  }, [initialUpvotes]);
  
  // Effect to sync hasUpvoted state from localStorage only once on client mount
  useEffect(() => {
    if (user) {
      const storedUpvotes = localStorage.getItem(`upvoted_${user.id}`);
      if (storedUpvotes) {
        const upvotedIssues: string[] = JSON.parse(storedUpvotes);
        if (upvotedIssues.includes(issueId)) {
          setHasUpvoted(true);
        } else {
          setHasUpvoted(false);
        }
      } else {
          setHasUpvoted(initialHasUpvoted);
      }
    }
  }, [issueId, user, initialHasUpvoted]);

  const handleUpvote = () => {
    if (!user) { // Or show a toast to log in
      alert("Please log in to upvote issues.");
      return; 
    }

    const newUpvoteCount = hasUpvoted ? upvoteCount - 1 : upvoteCount + 1;
    const newHasUpvoted = !hasUpvoted;

    setUpvoteCount(newUpvoteCount);
    setHasUpvoted(newHasUpvoted);

    // Persist to localStorage
    const storedUpvotes = localStorage.getItem(`upvoted_${user.id}`);
    let upvotedIssues: string[] = storedUpvotes ? JSON.parse(storedUpvotes) : [];

    if (newHasUpvoted) {
      upvotedIssues.push(issueId);
    } else {
      upvotedIssues = upvotedIssues.filter(id => id !== issueId);
    }
    localStorage.setItem(`upvoted_${user.id}`, JSON.stringify(upvotedIssues));
    
    // Notify parent component to update the global state
    onUpvoteChange(issueId, newUpvoteCount, newHasUpvoted);
  };

  return (
    <ClientOnly>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleUpvote} disabled={!user}>
          <ThumbsUp
            className={cn(
              'h-4 w-4',
              hasUpvoted && 'fill-blue-500 text-blue-500'
            )}
          />
          <span className="sr-only">Upvote</span>
        </Button>
        <span className="text-sm font-medium">{upvoteCount}</span>
      </div>
    </ClientOnly>
  );
}
