
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useIssues } from '@/hooks/use-issues';
import { mockUsers } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Send, Camera } from 'lucide-react';
import type { Issue, EstimationReport } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { useState } from 'react';
import { ImageLightbox } from '@/components/shared/ImageLightbox';

export default function FundManagerJobPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { issues, updateIssue } = useIssues();
  const { user } = useAuth();
  const id = params.id as string;
  const issue = issues.find((i) => i.id === id);

  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState('');

  const openLightbox = (url: string) => {
    setLightboxImageUrl(url);
    setLightboxOpen(true);
  };

  if (!issue) {
    return <div className="text-center">Job not found.</div>;
  }
  
  const engineer = mockUsers.find(u => u.id === issue.assignedEngineerId);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const cost = parseFloat(formData.get('cost') as string);
    const notes = formData.get('notes') as string;

    const estimationReport: EstimationReport = {
      estimatedCost: cost,
      notes: notes,
      submittedAt: new Date().toISOString(),
    };

    const updatedIssue: Issue = {
      ...issue,
      status: 'PendingApproval',
      currentRoles: ['Approving Manager'],
      estimationReport: estimationReport,
      statusHistory: [
        ...issue.statusHistory,
        {
          status: 'Estimated',
          date: new Date().toISOString(),
          updatedBy: user.name,
          notes: `Cost estimation submitted: ₹${cost}.`,
        },
        {
          status: 'PendingApproval',
          date: new Date().toISOString(),
          updatedBy: 'System',
          notes: 'Forwarded for final approval.',
        }
      ],
    };

    updateIssue(updatedIssue);
    toast({
      title: 'Estimation Submitted',
      description: 'Cost estimation has been sent for final approval.',
    });
    router.push('/fund-manager/dashboard');
  };

  return (
    <div className="space-y-8">
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">{issue.title}</CardTitle>
              <CardDescription>ID: {issue.id} | Location: {issue.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">Original Report:</h3>
              <p className="text-muted-foreground text-sm">{issue.description}</p>
            </CardContent>
          </Card>
          {issue.verificationReport && (
            <Card>
              <CardHeader>
                <CardTitle>Engineer's Verification Report</CardTitle>
                {engineer && <CardDescription>By: {engineer.name} on {new Date(issue.verificationReport.submittedAt).toLocaleDateString()}</CardDescription>}
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-semibold">Comments:</p>
                <p className="text-muted-foreground">{issue.verificationReport.comments}</p>
                 {issue.verificationReport.verificationPhotoUrl && (
                  <div>
                    <h4 className="font-semibold mb-2">Verification Photo:</h4>
                    <div className="rounded-lg overflow-hidden border w-full max-w-sm cursor-pointer" onClick={() => openLightbox(issue.verificationReport!.verificationPhotoUrl!)}>
                        <Image 
                            src={issue.verificationReport.verificationPhotoUrl} 
                            alt="Engineer verification"
                            width={400}
                            height={300}
                            className="object-cover"
                        />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Cost Estimation</CardTitle>
              <CardDescription>Provide the cost and notes.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="cost" className="text-sm font-medium">Enter the assigned amount (₹)</label>
                  <Input id="cost" name="cost" type="number" placeholder="e.g., 5500" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                  <Textarea id="notes" name="notes" placeholder="Breakdown of costs, required materials, etc." className="min-h-[120px]" required/>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Submit for Approval
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
      <ImageLightbox
        isOpen={isLightboxOpen}
        onOpenChange={setLightboxOpen}
        imageUrl={lightboxImageUrl}
        alt="Engineer verification photo"
      />
    </div>
  );
}
