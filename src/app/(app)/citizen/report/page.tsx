'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import dynamic from 'next/dynamic';

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
import { Send, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

const issueTypes: IssueType[] = ['Pothole', 'Streetlight', 'Garbage', 'Water Leakage'];

const formSchema = z.object({
  title: z.string().min(10, {
    message: 'Title must be at least 10 characters.',
  }),
  type: z.enum(issueTypes, {
    required_error: 'You need to select an issue type.',
  }),
  location: z.string().min(5, {
    message: 'Location description must be at least 5 characters.',
  }),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }),
  photo: z.any().optional(),
});

export default function ReportIssuePage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      location: '',
      description: '',
      photo: undefined,
    },
  });
  
  const LocationPicker = useMemo(() => dynamic(() => import('@/components/shared/LocationPicker'), { 
    ssr: false,
    loading: () => <p>Loading map...</p>
  }), []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Simulating issue submission:', values);
    toast({
      title: 'Issue Submitted!',
      description: 'Your civic issue report has been received. (Simulated)',
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

                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2"><MapPin/> Location</FormLabel>
                                <FormControl>
                                    <LocationPicker 
                                        value={field.value} 
                                        onChange={field.onChange} 
                                    />
                                </FormControl>
                                <FormDescription>
                                    Click the button to fetch your current location, or drag the marker to the exact spot.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
