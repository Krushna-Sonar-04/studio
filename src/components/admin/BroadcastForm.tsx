'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AnnouncementPriority, Announcement } from '@/lib/types';
import { Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { addAnnouncement } from '@/lib/mock-data/announcements';

const priorities: AnnouncementPriority[] = ['Low', 'Medium', 'High'];

const formSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  message: z.string().min(20, {
    message: 'Message must be at least 20 characters.',
  }),
  priority: z.enum(priorities, {
    required_error: 'You need to select a priority level.',
  }),
});

export function BroadcastForm() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      message: '',
      priority: 'Low',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newAnnouncement: Announcement = {
      id: `anno-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...values,
    };
    
    // Simulate saving the announcement
    addAnnouncement(newAnnouncement);

    console.log('Simulating broadcast submission:', newAnnouncement);
    toast({
      title: 'Broadcast Sent!',
      description: 'Your announcement has been published to all citizens. (Simulated)',
    });
    router.push('/admin/dashboard');
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Water Supply Disruption" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a priority level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {priorities.map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    High priority announcements are more prominent.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the announcement in detail..."
                      className="resize-y min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full md:w-auto">
              <Send className="mr-2 h-4 w-4" />
              Send Broadcast
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
