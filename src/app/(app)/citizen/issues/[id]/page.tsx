
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useIssues } from '@/hooks/use-issues';
import { mockUsers } from '@/lib/mock-data';
import { IssueTimeline } from '@/components/shared/IssueTimeline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ArrowLeft, Calendar, FileText, ImageIcon, MapPin, User, Wrench, Ticket, ShieldAlert, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { ImageLightbox } from '@/components/shared/ImageLightbox';
import { Separator } from '@/components/ui/separator';

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { issues } = useIssues();
  const id = params.id as string;
  const issue = useMemo(() => issues.find((i) => i.id === id), [id, issues]);
  const [localizedDate, setLocalizedDate] = useState('');
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState('');
  
  const openLightbox = (url: string) => {
    setLightboxImageUrl(url);
    setLightboxOpen(true);
  };


  useEffect(() => {
    if (issue) {
      setLocalizedDate(new Date(issue.reportedAt).toLocaleString());
    }
  }, [issue]);

  if (!issue) {
    return <div className="text-center">Issue not found.</div>;
  }
  
  const reportedBy = mockUsers.find(u => u.id === issue.reportedBy);
  const contractor = mockUsers.find(u => u.id === issue.assignedContractorId);
  const isSlaBreached = issue.slaDeadline && isPast(new Date(issue.slaDeadline));

  const imageHint = issue.type.toLowerCase().split(' ')[0] || 'issue photo';

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
        <CardContent className="pt-6">
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
                        <div className="mt-2 rounded-lg overflow-hidden border cursor-pointer" onClick={() => openLightbox(issue.imageUrl!)}>
                        <Image
                            src={issue.imageUrl}
                            alt={issue.title}
                            width={400}
                            height={250}
                            className="object-cover"
                            data-ai-hint={imageHint}
                        />
                        </div>
                     </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {issue.contractorReport && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <CheckCircle className="text-green-600" />
                Resolution Report
            </CardTitle>
            {contractor && <CardDescription>Work completed by {contractor.name} on {new Date(issue.contractorReport.submittedAt).toLocaleDateString()}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold">Contractor's Notes:</h4>
              <p className="text-muted-foreground">{issue.contractorReport.notes}</p>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">'Before' Photo</h4>
                {issue.contractorReport.beforeImageUrl ? (
                    <Image src={issue.contractorReport.beforeImageUrl} alt="Before work" width={400} height={300} className="rounded-lg border object-cover cursor-pointer" onClick={() => openLightbox(issue.contractorReport!.beforeImageUrl!)} />
                ) : <p className="text-sm text-muted-foreground">No 'before' image provided.</p>}
              </div>
              <div>
                <h4 className="font-semibold mb-2">'After' Photo</h4>
                {issue.contractorReport.afterImageUrl ? (
                  <Image src={issue.contractorReport.afterImageUrl} alt="After work" width={400} height={300} className="rounded-lg border object-cover cursor-pointer" onClick={() => openLightbox(issue.contractorReport!.afterImageUrl!)} />
                ) : <p className="text-sm text-muted-foreground">No 'after' image provided.</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Issue Progress</CardTitle>
          <CardDescription>Track the status of your reported issue from submission to resolution.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <IssueTimeline statusHistory={issue.statusHistory} currentStatus={issue.status} />
        </CardContent>
      </Card>
      
      {lightboxImageUrl && (
        <ImageLightbox
          imageUrl={lightboxImageUrl}
          alt={issue.title}
          isOpen={isLightboxOpen}
          onOpenChange={setLightboxOpen}
        />
      )}
    </div>
  );
}
