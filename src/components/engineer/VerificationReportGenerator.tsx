
'use client';

import { useState } from 'react';
import { generateIssueVerificationReport, IssueVerificationReportOutput } from '@/ai/flows/issue-verification-report-generation';
import { Issue, VerificationReport } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Lightbulb, FileText, Upload, Send, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useIssues } from '@/hooks/use-issues';
import { useAuth } from '@/hooks/use-auth';

export function VerificationReportGenerator({ issue }: { issue: Issue }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiReport, setAiReport] = useState<IssueVerificationReportOutput | null>(null);
  const [comments, setComments] = useState('');
  const [verificationPhoto, setVerificationPhoto] = useState<File | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { updateIssue } = useIssues();
  const { user } = useAuth();


  const handleGenerateReport = async () => {
    setIsLoading(true);
    setAiReport(null);
    try {
      const result = await generateIssueVerificationReport({
        issueReport: `Title: ${issue.title}\nType: ${issue.type}\nLocation: ${issue.location}\nDescription: ${issue.description}`,
      });
      setAiReport(result);
      // Pre-fill comments with AI report for easy editing
      setComments(result.report);
    } catch (error) {
      console.error('AI report generation failed:', error);
      toast({
        variant: 'destructive',
        title: 'AI Assistant Error',
        description: 'Failed to generate preliminary report.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);

    let verificationPhotoUrl: string | undefined;
    if (verificationPhoto) {
       try {
        verificationPhotoUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(verificationPhoto);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      } catch (error) {
        console.error("Error converting image to Data URI:", error);
        toast({
          variant: 'destructive',
          title: 'Image Upload Failed',
          description: 'Could not process the selected image.'
        });
        setIsSubmitting(false);
        return;
      }
    }

    const verificationReport: VerificationReport = {
        comments: comments,
        submittedAt: new Date().toISOString(),
        verificationPhotoUrl: verificationPhotoUrl,
    };

    const updatedIssue: Issue = {
        ...issue,
        status: 'Verified',
        // In a real app, you would have a system to assign this. Here we hardcode.
        assignedFundManagerId: 'user-4', 
        currentRoles: ['Fund Manager'],
        verificationReport: verificationReport,
        statusHistory: [
            ...issue.statusHistory,
            { status: 'Verified', date: new Date().toISOString(), updatedBy: user.name, notes: 'Issue verified by engineer.' }
        ]
    };
    
    updateIssue(updatedIssue);

    toast({
      title: 'Verification Report Submitted!',
      description: 'The report has been sent for cost estimation.',
    });
    router.push('/engineer/dashboard');
    setIsSubmitting(false);
  };

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="font-headline">Verification Report</CardTitle>
        <CardDescription>Assess the issue and submit your findings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!aiReport && (
          <Button onClick={handleGenerateReport} disabled={isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Preliminary Report (AI)
          </Button>
        )}
        
        {isLoading && (
            <div className="flex items-center justify-center p-8 space-x-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>AI assistant is analyzing...</span>
            </div>
        )}

        {aiReport && (
          <>
            <Alert>
                <Lightbulb className="h-4 w-4" />
                <AlertTitle>AI Generated Assessment</AlertTitle>
                <AlertDescription className="prose prose-sm max-w-none">
                    <pre className="text-xs whitespace-pre-wrap font-sans bg-transparent p-0">{aiReport.report}</pre>
                </AlertDescription>
            </Alert>
            
            {aiReport.confirmationNeeded && aiReport.confirmationNeeded.length > 0 && (
                 <Alert variant="destructive">
                    <AlertTitle>Confirmation Needed</AlertTitle>
                    <AlertDescription>
                        The AI suggests confirming the following details:
                        <ul className="list-disc pl-5 mt-2">
                           {aiReport.confirmationNeeded.map((field, i) => <li key={i}>{field}</li>)}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}
          </>
        )}

        <div className="space-y-2">
            <label htmlFor="comments" className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4" />
                Your Technical Comments
            </label>
            <Textarea
              id="comments"
              placeholder="Add your technical assessment here. You can edit the AI-generated report above."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[150px]"
            />
        </div>
        <div className="space-y-2">
             <label htmlFor="photo" className="flex items-center gap-2 text-sm font-medium">
                <Upload className="h-4 w-4" />
                Upload Verification Photo
            </label>
            <Input 
              id="photo" 
              type="file" 
              accept="image/*"
              onChange={(e) => setVerificationPhoto(e.target.files ? e.target.files[0] : null)}
            />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={!comments || isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Submit Verification
        </Button>
      </CardFooter>
    </Card>
  );
}
