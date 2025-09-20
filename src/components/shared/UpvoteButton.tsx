'use client';

import React, { useState, useEffect } from 'react';
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

export const UpvoteButton = React.memo(function UpvoteButton({
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
    setHasUpvoted(initialHasUpvoted);
  }, [initialUpvotes, initialHasUpvoted]);
  
  const handleUpvote = () => {
    if (!user) { // Or show a toast to log in
      alert("Please log in to upvote issues.");
      return; 
    }

    const newUpvoteCount = hasUpvoted ? upvoteCount - 1 : upvoteCount + 1;
    const newHasUpvoted = !hasUpvoted;

    setUpvoteCount(newUpvoteCount);
    setHasUpvoted(newHasUpvoted);
    
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
});
