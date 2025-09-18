'use client';

import { useIssues } from '@/hooks/use-issues';
import { mockUsers } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Calendar, FileText, MapPin, User, Wrench, Ticket } from 'lucide-react';
import { VerificationReportGenerator } from '@/components/engineer/VerificationReportGenerator';
import { Separator } from '@/components/ui/separator';
import { useParams } from 'next/navigation';

export default function EngineerJobPage() {
  const params = useParams();
  const { id } = params;
  const { issues } = useIssues();
  const issue = issues.find((i) => i.id === id);

  if (!issue) {
    return <div className="text-center">Job not found.</div>;
  }

  const reportedBy = mockUsers.find(u => u.id === issue.reportedBy);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Verify Issue: {issue.title}</h1>
        <p className="text-muted-foreground flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            Token ID: {issue.id}
        </p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <Card>
            <CardHeader>
              <CardTitle>Citizen's Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3"><Wrench className="h-5 w-5 text-muted-foreground" /><span>Type: <strong>{issue.type}</strong></span></div>
                        <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-muted-foreground" /><span>Location: <strong>{issue.location}</strong></span></div>
                        <div className="flex items-center gap-3"><Calendar className="h-5 w-5 text-muted-foreground" /><span>Reported: <strong>{new Date(issue.reportedAt).toLocaleString()}</strong></span></div>
                        {reportedBy && <div className="flex items-center gap-3"><User className="h-5 w-5 text-muted-foreground" /><span>By: <strong>{reportedBy.name}</strong></span></div>}
                    </div>
                     <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground mt-1" />
                            <div>
                                <span className="font-semibold">Description:</span>
                                <p className="text-muted-foreground">{issue.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {issue.imageUrl && (
                    <>
                    <Separator/>
                    <div className="space-y-2">
                        <h4 className="font-semibold">Photo Evidence</h4>
                         <div className="rounded-lg overflow-hidden border w-full max-w-md">
                            <Image src={issue.imageUrl} alt={issue.title} width={600} height={400} className="object-cover" />
                        </div>
                    </div>
                    </>
                )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <VerificationReportGenerator issue={issue} />
        </div>
      </div>
    </div>
  );
}
