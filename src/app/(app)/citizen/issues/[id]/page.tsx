
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useIssues } from '@/hooks/use-issues';
import { mockUsers } from '@/lib/mock-data';
import { IssueTimeline } from '@/components/shared/IssueTimeline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ArrowLeft, Calendar, FileText, ImageIcon, MapPin, User, Wrench, Ticket, ShieldAlert, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow, isPast } from 'date-fns';

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { issues } = useIssues();
  const id = params.id as string;
  const issue = issues.find((i) => i.id === id);
  const [localizedDate, setLocalizedDate] = useState('');

  useEffect(() => {
    if (issue) {
      setLocalizedDate(new Date(issue.reportedAt).toLocaleString());
    }
  }, [issue]);

  if (!issue) {
    return <div className="text-center">Issue not found.</div>;
  }
  
  const reportedBy = mockUsers.find(u => u.id === issue.reportedBy);
  const isSlaBreached = issue.slaDeadline && isPast(new Date(issue.slaDeadline));

  return (
    <div className="space-y-8">
       <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-headline">{issue.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 text-base">
                <Ticket className="h-4 w-4" />
                Token ID: {issue.id}
              </CardDescription>
            </div>
            <Badge 
              className="text-base" 
              variant={issue.status === 'Resolved' || issue.status === 'Closed' ? 'outline' : (issue.escalated ? 'destructive' : 'default')}
            >
              {issue.escalated && <ShieldAlert className="mr-1 h-4 w-4" />}
              {issue.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Wrench className="h-5 w-5 text-muted-foreground" />
                <span>Type: <strong>{issue.type}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>Location: <strong>{issue.location}</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>Reported on: <strong>{localizedDate || 'Loading date...'}</strong></span>
              </div>
               {reportedBy && <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <span>Reported by: <strong>{reportedBy.name}</strong></span>
              </div>}
               {issue.slaDeadline && (
                <div className={cn("flex items-center gap-3 p-3 rounded-md", isSlaBreached ? "bg-destructive/10 text-destructive" : "bg-muted/50")}>
                    <Clock className="h-5 w-5" />
                    <div>
                        <span className="font-semibold">SLA Deadline:</span>
                        <strong className="ml-2">{format(new Date(issue.slaDeadline), 'PPP')}</strong>
                        <p className="text-sm">
                            ({isSlaBreached 
                                ? `Breached ${formatDistanceToNow(new Date(issue.slaDeadline))} ago` 
                                : `${formatDistanceToNow(new Date(issue.slaDeadline), { addSuffix: true })}`
                            })
                        </p>
                    </div>
                </div>
               )}
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <span className="font-semibold">Description:</span>
                  <p className="text-muted-foreground">{issue.description}</p>
                </div>
              </div>
              {issue.imageUrl && (
                <div className="flex items-start gap-3">
                    <ImageIcon className="h-5 w-5 text-muted-foreground mt-1" />
                     <div>
                        <span className="font-semibold">Photo Evidence:</span>
                        <div className="mt-2 rounded-lg overflow-hidden border">
                        <Image
                            src={issue.imageUrl}
                            alt={issue.title}
                            width={400}
                            height={250}
                            className="object-cover"
                            data-ai-hint="issue photo"
                        />
                        </div>
                     </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Issue Progress</CardTitle>
          <CardDescription>Track the status of your reported issue from submission to resolution.</CardDescription>
        </CardHeader>
        <CardContent>
          <IssueTimeline statusHistory={issue.statusHistory} currentStatus={issue.status} />
        </CardContent>
      </Card>
    </div>
  );
}
