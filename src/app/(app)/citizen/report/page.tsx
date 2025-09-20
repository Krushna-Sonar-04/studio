
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useCallback, useState, useEffect, useMemo } from 'react';

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
import { Send, MapPin, Loader2, LocateFixed } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useIssues } from '@/hooks/use-issues';
import { useAuth } from '@/contexts/AuthContext';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { LatLngTuple } from 'leaflet';
import { getPlaceholderImage } from '@/lib/placeholder-images';

const Map = dynamic(() => import('@/components/shared/LeafletMap'), { 
    ssr: false,
    loading: () => <Skeleton className="h-[200px] w-full" />
});


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
  const [isLocating, setIsLocating] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<LatLngTuple | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      photo: undefined,
      location: '',
    },
  });

  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        if (data && data.display_name) {
            form.setValue('location', data.display_name);
        } else {
            form.setValue('location', `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
        }
    } catch (error) {
        console.error("Reverse geocoding failed:", error);
        form.setValue('location', `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
        toast({
            variant: 'destructive',
            title: 'Could not fetch address',
            description: 'Please enter the address manually.'
        });
    }
  }, [form, toast]);

 const handleSetLocation = useCallback((lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
    fetchAddress(lat, lng);
  }, [fetchAddress]);

  const handleLocateMe = useCallback(() => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleSetLocation(latitude, longitude);
        setIsLocating(false);
        toast({ title: 'Location Found!', description: 'Your current location has been set as the address.' });
      },
      (error) => {
        setIsLocating(false);
        console.error("Geolocation error:", error);
        toast({
          variant: 'destructive',
          title: 'Location Error',
          description: 'Could not get your location. Please enter the address manually.',
        });
      },
      { enableHighAccuracy: true }
    );
  }, [handleSetLocation, toast]);
  
  const handleMapClick = (latlng: { lat: number, lng: number }) => {
      handleSetLocation(latlng.lat, latlng.lng);
  };
  
  // Set initial location on component mount
  useEffect(() => {
    handleLocateMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'You must be logged in to report an issue.' });
      return;
    }
    
    setIsSubmitting(true);

    let imageUrl: string | undefined;
    if (values.photo && values.photo[0]) {
      try {
        imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(values.photo[0]);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      } catch (error) {
        console.error("Error converting image to Data URI:", error);
        toast({
          variant: 'destructive',
          title: 'Image Upload Failed',
          description: 'Could not process the selected image. Please try another one.'
        });
        setIsSubmitting(false);
        return;
      }
    } else {
        // If no photo is uploaded, use a unique placeholder based on the issue type
        imageUrl = getPlaceholderImage(`issue-${values.type.toLowerCase()}`);
    }

    const timestamp = Date.now();
    const issueId = `issue-${timestamp}`;
    
    addIssue({
      id: issueId,
      title: values.title,
      type: values.type,
      location: values.location,
      description: values.description,
      imageUrl: imageUrl,
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
    setIsSubmitting(false);
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
            <CardContent className="pt-6">
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
                        <div className="flex justify-between items-center">
                            <FormLabel className="flex items-center gap-2"><MapPin/> Location</FormLabel>
                             <Button type="button" variant="outline" size="sm" onClick={handleLocateMe} disabled={isLocating}>
                                {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LocateFixed className="mr-2 h-4 w-4" />}
                                Locate Me
                            </Button>
                         </div>

                        <div className="h-[200px] w-full border rounded-lg overflow-hidden">
                            <Map 
                                center={markerPosition || [18.5204, 73.8567]} 
                                markerPosition={markerPosition}
                                onMapClick={handleMapClick}
                                zoom={15}
                                flyTo={markerPosition}
                                scrollWheelZoom={false}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Click 'Locate Me' or on map, or enter address" {...field} />
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
                    render={({ field: { onChange, value, ...rest } }) => (
                        <FormItem>
                        <FormLabel>Upload a Photo</FormLabel>
                        <FormControl>
                            <Input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => onChange(e.target.files)} 
                                {...rest}
                            />
                        </FormControl>
                        <FormDescription>
                            A picture can help us understand the issue better.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    
                    <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="mr-2 h-4 w-4" />
                        )}
                        Submit Report
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
