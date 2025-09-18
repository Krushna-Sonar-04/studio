'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';

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
import { Send, MapPin, LocateFixed, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Leaflet is a client-side only library. Using `next/dynamic` with `ssr: false`
// is the correct and safest way to ensure this component is never rendered on
// the server, which prevents "window is not defined" and other hydration errors.
const LeafletMap = dynamic(() => import('@/components/shared/LeafletMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><p>Loading map...</p></div>
});


const issueTypes: IssueType[] = ['Pothole', 'Streetlight', 'Garbage', 'Water Leakage', 'Obstruction'];

// Default to a central location in India
const defaultPosition: [number, number] = [20.5937, 78.9629];

const formSchema = z.object({
  title: z.string().min(10, {
    message: 'Title must be at least 10 characters.',
  }),
  type: z.enum(issueTypes, {
    required_error: 'You need to select an issue type.',
  }),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().min(5, {
        message: 'Please select a location on the map or provide a valid address.',
    }),
  }),
  description: z.string().min(20, {
    message: 'Description must be at least 20 characters.',
  }),
  photo: z.any().optional(),
});

export default function ReportIssuePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      photo: undefined,
      location: {
        lat: defaultPosition[0],
        lng: defaultPosition[1],
        address: '',
      },
    },
  });

  const getAddressFromLatLng = useCallback(async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      // Use a free and open-source geocoding service like Nominatim.
      // In a production app, you might use a more robust, rate-limited service.
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      const data = await response.json();
      if (data && data.display_name) {
        form.setValue('location.address', data.display_name, { shouldValidate: true });
      } else {
        form.setValue('location.address', 'Address not found', { shouldValidate: true });
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      toast({
        variant: 'destructive',
        title: 'Could not fetch address',
        description: 'Please check your connection or enter the address manually.',
      });
    } finally {
      setIsGeocoding(false);
    }
  }, [form, toast]);


  const handleMapClick = useCallback((latlng: { lat: number; lng: number }) => {
    form.setValue('location.lat', latlng.lat);
    form.setValue('location.lng', latlng.lng);
    getAddressFromLatLng(latlng.lat, latlng.lng);
  }, [form, getAddressFromLatLng]);

  const handleLocateMe = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        form.setValue('location.lat', latitude);
        form.setValue('location.lng', longitude);
        getAddressFromLatLng(latitude, longitude);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        toast({
          variant: 'destructive',
          title: 'Location access denied',
          description: 'Please enable location services in your browser.',
        });
        console.error('Geolocation error:', error);
      }
    );
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Simulating issue submission:', values);
    toast({
      title: 'Issue Submitted!',
      description: 'Your civic issue report has been received. (Simulated)',
    });
    router.push('/citizen/dashboard');
  }

  const { lat, lng } = form.watch('location');

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
                        <div className="h-[400px] w-full rounded-md overflow-hidden border">
                           <LeafletMap 
                                center={[lat, lng]}
                                markerPosition={[lat, lng]}
                                onMapClick={handleMapClick}
                                flyTo={[lat, lng]}
                                scrollWheelZoom={true}
                            />
                        </div>
                        <Button type="button" variant="outline" onClick={handleLocateMe} disabled={isLocating}>
                            {isLocating ? <Loader2 className="animate-spin" /> : <LocateFixed />}
                            Use My Current Location
                        </Button>
                        <FormField
                            control={form.control}
                            name="location.address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input placeholder="Address will appear here..." {...field} />
                                            {isGeocoding && <Loader2 className="animate-spin absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" />}
                                        </div>
                                    </FormControl>
                                     <FormDescription>
                                        Click on the map or use your location. You can edit the address here if needed.
                                    </FormDescription>
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
