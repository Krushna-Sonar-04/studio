'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

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
  const [isClient, setIsClient] = useState(false);

  // Ensure localStorage is only accessed on the client
  useEffect(() => {
    setIsClient(true);
    const storedUpvotes = localStorage.getItem(`upvoted_${user?.id}`);
    if (storedUpvotes) {
      const upvotedIssues: string[] = JSON.parse(storedUpvotes);
      if (upvotedIssues.includes(issueId)) {
        setHasUpvoted(true);
      }
    }
  }, [issueId, user?.id]);

  const handleUpvote = () => {
    if (!user) return; // Or show a toast to log in

    const newUpvoteCount = hasUpvoted ? upvoteCount - 1 : upvoteCount + 1;
    const newHasUpvoted = !hasUpvoted;

    setUpvoteCount(newUpvoteCount);
    setHasUpvoted(newHasUpvoted);

    // Persist to localStorage
    const storedUpvotes = localStorage.getItem(`upvoted_${user.id}`);
    const upvotedIssues: string[] = storedUpvotes ? JSON.parse(storedUpvotes) : [];

    if (newHasUpvoted) {
      upvotedIssues.push(issueId);
    } else {
      const index = upvotedIssues.indexOf(issueId);
      if (index > -1) {
        upvotedIssues.splice(index, 1);
      }
    }
    localStorage.setItem(`upvoted_${user.id}`, JSON.stringify(upvotedIssues));
    
    // Notify parent component
    onUpvoteChange(issueId, newUpvoteCount, newHasUpvoted);
  };

  if (!isClient) {
    // Render a placeholder or nothing on the server to avoid hydration mismatch
    return (
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" disabled>
                <ThumbsUp className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{initialUpvotes}</span>
        </div>
    );
  }

  return (
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
  );
}
