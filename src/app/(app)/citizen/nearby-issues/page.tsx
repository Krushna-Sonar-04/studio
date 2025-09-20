
'use client';

import { useEffect, useState, useMemo } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LocateFixed, Terminal } from 'lucide-react';
import { LatLngTuple } from 'leaflet';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useIssues } from '@/hooks/use-issues';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { IssueMarker } from '@/components/shared/LeafletMap';

// Default to a central location in case geolocation fails.
const DEFAULT_CENTER: LatLngTuple = [18.5204, 73.8567];

const Map = dynamic(() => import('@/components/shared/LeafletMap'), { 
    ssr: false,
    loading: () => <Skeleton className="h-full w-full" />
});

export default function NearbyIssuesMapPage() {
  const { toast } = useToast();
  const { issues } = useIssues();
  const [userLocation, setUserLocation] = useState<LatLngTuple | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngTuple>(DEFAULT_CENTER);
  
  const issueMarkers = useMemo((): IssueMarker[] => {
      // This is a mock implementation. A real app would get lat/lng from the issue data.
      return issues.map((issue, index) => ({
          id: issue.id,
          title: issue.title,
          // Randomize location slightly around a central point for demonstration
          lat: 18.5204 + (Math.random() - 0.5) * 0.1,
          lng: 73.8567 + (Math.random() - 0.5) * 0.1,
      }));
  }, [issues]);

  useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation: LatLngTuple = [position.coords.latitude, position.coords.longitude];
            setUserLocation(newLocation);
            setMapCenter(newLocation);
          },
          (error) => {
            console.error("Error getting user location:", error);
            // Don't set user location, map will use default center
            toast({
              variant: 'destructive',
              title: "Could not get your location.",
              description: "Showing default location. Use the 'Recenter' button to try again.",
            });
          }
        );
    }
  }, [toast]);
  
  const handleRecenter = () => {
      if(userLocation) {
        setMapCenter(userLocation);
        toast({ title: "Map Recenterd", description: "Map has been centered on your location." });
      } else {
        toast({ variant: 'destructive', title: "Location Unavailable", description: "Could not get your location to recenter." });
      }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-bold">Nearby Issues Map</h1>
          <p className="text-muted-foreground">
            Explore civic issues reported in your vicinity.
          </p>
        </div>
        <Button onClick={handleRecenter} variant="outline">
            <LocateFixed className="mr-2 h-4 w-4" />
            Recenter on Me
        </Button>
      </div>

       <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Developer Note</AlertTitle>
          <AlertDescription>
            This map uses mock locations for demonstration purposes. Issue locations are randomized around a central point.
          </AlertDescription>
        </Alert>

      <Card className="h-[calc(100vh-300px)] w-full border rounded-lg overflow-hidden">
        <CardContent className="p-0 h-full">
            <Map 
                center={mapCenter} 
                zoom={14} 
                markers={issueMarkers}
                flyTo={mapCenter}
            />
        </CardContent>
      </Card>
    </div>
  );
}
