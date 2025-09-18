'use client';

import { Announcement } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { useEffect, useState } from 'react';

const announcementVariants = cva('border', {
  variants: {
    priority: {
      High: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      Medium: 'border-yellow-500/50 text-yellow-600 dark:border-yellow-500 [&>svg]:text-yellow-600',
      Low: 'border-gray-300 text-gray-500 dark:border-gray-700 [&>svg]:text-gray-500',
    },
  },
  defaultVariants: {
    priority: 'Low',
  },
});

interface AnnouncementCardProps {
  announcement: Announcement;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
    const [localizedDate, setLocalizedDate] = useState('');

    useEffect(() => {
        if(announcement) {
            setLocalizedDate(new Date(announcement.createdAt).toLocaleString());
        }
    }, [announcement]);

  if (!announcement) return null;

  return (
    <Alert className={cn(announcementVariants({ priority: announcement.priority }))}>
      <Megaphone className="h-4 w-4" />
      <AlertTitle className="font-bold">{announcement.title}</AlertTitle>
      <AlertDescription>
        <p className="mb-2">{announcement.message}</p>
        <p className="text-xs text-muted-foreground">Posted on: {localizedDate}</p>
      </AlertDescription>
    </Alert>
  );
}
