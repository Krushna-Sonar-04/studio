'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useCallback, useState, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { IssueType } from '@/lib/types';
import { Send, MapPin, Loader2, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useIssues } from '@/hooks/use-issues';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


const issueTypes: IssueType[] = ['Pothole', 'Streetlight', 'Garbage', 'Water Leakage', 'Obstruction'];

const formSchema = z.object({
  title: z.string().min(10, {
    message: 'Title must be at least 10 characters.',
  }),
  type: z.enum(issueTypes, {
    required_error: 'You need to select an issue type.',
  }),
  location: z.string().min(10, { message: 'Address must be at least 10 characters.' }),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }),
  photo: z.any().optional(),
});

export default function ReportIssuePage() {
  const { toast } = useToast();
  const router = useRouter();
  const { addIssue } = useIssues();
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      photo: undefined,
      location: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({ variant: 'destructive', title: 'You must be logged in to report an issue.' });
      return;
    }
    
    addIssue({
      id: `issue-${Date.now()}`,
      title: values.title,
      type: values.type,
      location: values.location,
      description: values.description,
      // In a real app, upload the photo and get a URL
      imageUrl: values.photo?.[0] ? 'https://picsum.photos/seed/210/600/400' : undefined,
      reportedBy: user.id,
      reportedAt: new Date().toISOString(),
      status: 'Submitted',
      currentRoles: ['Head of Department'],
      statusHistory: [
        { status: 'Submitted', date: new Date().toISOString(), updatedBy: user.name, notes: 'Issue reported by citizen.' },
      ],
      upvotes: 0,
      upvotedBy: [],
    });

    toast({
      title: 'Issue Submitted!',
      description: 'Your civic issue report has been received.',
    });
    router.push('/citizen/dashboard');
  }

  return (
    <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-headline font-bold mb-2">Report a New Civic Issue</h1>
        <p className="text-muted-foreground mb-8">
            Fill out the form below to report an issue in your community.
        </p>

        <Card>
            <CardHeader>
                <CardTitle>Issue Details</CardTitle>
                <CardDescription>Provide as much detail as possible.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Issue Title</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Large pothole on Elm Street" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Issue Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select an issue type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {issueTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                     <div className="space-y-4">
                        <FormLabel className="flex items-center gap-2"><MapPin/> Location</FormLabel>
                        
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Map Under Maintenance</AlertTitle>
                            <AlertDescription>
                                The interactive map is temporarily unavailable. Please enter the full address manually below.
                            </AlertDescription>
                        </Alert>

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter the full address of the issue" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Detailed Description</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Describe the issue in detail..."
                            className="resize-y min-h-[120px]"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                    <FormField
                    control={form.control}
                    name="photo"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Upload a Photo (Optional)</FormLabel>
                        <FormControl>
                            <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                        </FormControl>
                        <FormDescription>
                            A picture can help us understand the issue better.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    
                    <Button type="submit" className="w-full md:w-auto">
                        <Send className="mr-2 h-4 w-4" />
                        Submit Report
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
