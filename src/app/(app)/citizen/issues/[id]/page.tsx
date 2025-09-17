'use client';

import { useParams, useRouter } from 'next/navigation';
import { mockIssues, mockUsers } from '@/lib/mock-data';
import { IssueTimeline } from '@/components/shared/IssueTimeline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ArrowLeft, Calendar, FileText, ImageIcon, MapPin, User, Wrench, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const issue = mockIssues.find((i) => i.id === id);

  if (!issue) {
    return <div className="text-center">Issue not found.</div>;
  }
  
  const reportedBy = mockUsers.find(u => u.id === issue.reportedBy);

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
            <Badge className="text-base" variant={issue.status === 'Resolved' || issue.status === 'Closed' ? 'outline' : 'default'}>
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
                <span>Reported on: <strong>{new Date(issue.reportedAt).toLocaleString()}</strong></span>
              </div>
               {reportedBy && <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <span>Reported by: <strong>{reportedBy.name}</strong></span>
              </div>}
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
