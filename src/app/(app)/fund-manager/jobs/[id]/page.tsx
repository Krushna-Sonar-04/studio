'use client';

import { useParams, useRouter } from 'next/navigation';
import { mockIssues, mockUsers } from '@/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, FileText, Send } from 'lucide-react';

export default function FundManagerJobPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;
  const issue = mockIssues.find((i) => i.id === id);

  if (!issue) {
    return <div className="text-center">Job not found.</div>;
  }
  
  const engineer = mockUsers.find(u => u.id === issue.assignedEngineerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Estimation Submitted',
      description: 'Cost estimation has been sent for final approval. (Simulated)',
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
              <CardContent>
                <p>{issue.verificationReport.comments}</p>
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
                  <label htmlFor="cost" className="text-sm font-medium">Estimated Cost ($)</label>
                  <Input id="cost" type="number" placeholder="e.g., 5500" required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">Notes</label>
                  <Textarea id="notes" placeholder="Breakdown of costs, required materials, etc." className="min-h-[120px]" required/>
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
    </div>
  );
}
