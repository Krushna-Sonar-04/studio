'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LocateFixed, Terminal } from 'lucide-react';
import { LatLngTuple } from 'leaflet';
import { useToast } from '@/hooks/use-toast';
import { IssueMarker } from '@/components/shared/LeafletMap';
import { Button } from '@/components/ui/button';
import { useIssues } from '@/hooks/use-issues';

// The "window is not defined" error in Next.js happens because Leaflet directly
// interacts with the browser's DOM. Using `dynamic` with `ssr: false` is the
// correct and necessary way to fix this, ensuring the component only loads on the client.
const LeafletMap = dynamic(() => import('@/components/shared/LeafletMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><p>Loading map...</p></div>
});


// Default to a central location in Pune, India, if geolocation fails.
const DEFAULT_CENTER: LatLngTuple = [18.5204, 73.8567];

// In a real application, this data would be fetched from Firestore
// based on the user's location.
const dummyIssues: IssueMarker[] = [
  { id: 'issue-1', title: 'Pothole on JM Road', lat: 18.5204, lng: 73.8567 },
  { id: 'issue-2', title: 'Broken Street Light near FC College', lat: 18.5215, lng: 73.8575 },
  { id: 'issue-3', title: 'Garbage Overflow at Deccan Gymkhana', lat: 18.5189, lng: 73.8550 },
];

export default function NearbyIssuesMapPage() {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<LatLngTuple | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngTuple>(DEFAULT_CENTER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use `navigator.geolocation` to get the user's current location.
    // This is a browser API and must run inside `useEffect`.
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation: LatLngTuple = [position.coords.latitude, position.coords.longitude];
        setUserLocation(newLocation);
        setMapCenter(newLocation);
        setLoading(false);
      },
      (error) => {
        console.error("Error getting user location:", error);
        toast({
            variant: "destructive",
            title: "Location Access Denied",
            description: "Falling back to the default location. Please enable location permissions to see issues near you.",
        });
        setUserLocation(null); // No user location
        setMapCenter(DEFAULT_CENTER); // Use default
        setLoading(false);
      }
    );
  }, [toast]);
  
  const handleRecenter = () => {
    if (userLocation) {
      setMapCenter(userLocation);
      toast({ title: "Map Recentered", description: "Map centered on your current location." });
    } else {
      toast({ variant: "destructive", title: "Cannot Recenter", description: "Your location is not available." });
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
        <Button onClick={handleRecenter} variant="outline" disabled={!userLocation}>
            <LocateFixed className="mr-2 h-4 w-4" />
            Recenter on Me
        </Button>
      </div>

       <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Developer Note</AlertTitle>
          <AlertDescription>
            The issue coordinates are currently using dummy data for demonstration purposes. In a real application, these would be fetched from a database.
          </AlertDescription>
        </Alert>

      <div className="h-[calc(100vh-300px)] w-full border rounded-lg overflow-hidden">
        {loading ? (
          <div className="h-full w-full bg-muted flex items-center justify-center">
            <p>Fetching your location and loading map...</p>
          </div>
        ) : (
          <LeafletMap center={mapCenter} flyTo={mapCenter} markers={dummyIssues} zoom={15} />
        )}
      </div>
    </div>
  );
}
