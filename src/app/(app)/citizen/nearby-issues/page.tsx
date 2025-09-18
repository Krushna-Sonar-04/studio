'use client';

import { useEffect, useMemo, useState } from 'react';
import { mockIssues } from '@/lib/mock-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { LatLngTuple } from 'leaflet';
import { useToast } from '@/hooks/use-toast';
import { IssueMarker } from '@/components/shared/LeafletMap';
import LeafletMap from '@/components/shared/LeafletMap';

// Default to a central location in Pune, India
const DEFAULT_CENTER: LatLngTuple = [18.5204, 73.8567];

export default function NearbyIssuesMapPage() {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<LatLngTuple | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
        setLoading(false);
      },
      (error) => {
        console.error("Error getting user location:", error);
        toast({
            variant: "destructive",
            title: "Location Access Denied",
            description: "Falling back to the default location. Please enable location permissions in your browser to see issues near you.",
        });
        setUserLocation(DEFAULT_CENTER);
        setLoading(false);
      }
    );
  }, [toast]);

  const issuesWithCoords: IssueMarker[] = useMemo(() => {
    return mockIssues
      .map(issue => {
        // This is a naive way to parse coordinates from a string address.
        // In a real app, you would have dedicated lat/lng fields.
        const parts = issue.location.split(',').map(part => part.trim());
        if (parts.length >= 2) {
          // A better approach for real data would be to use a geocoding service
          // For mock data, let's generate some coordinates around Pune
          const lat = 18.5204 + (Math.random() - 0.5) * 0.1;
          const lng = 73.8567 + (Math.random() - 0.5) * 0.1;
          return { ...issue, lat, lng };
        }
        return null;
      })
      .filter((issue): issue is NonNullable<typeof issue> => issue !== null)
      .map(issue => ({
          id: issue.id,
          title: issue.title,
          lat: issue.lat,
          lng: issue.lng
      }));
  }, []);
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold">Nearby Issues Map</h1>
        <p className="text-muted-foreground">
          Explore civic issues reported in your vicinity.
        </p>
      </div>

       <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Developer Note</AlertTitle>
          <AlertDescription>
            The issue coordinates are currently randomized for demonstration purposes. In a real application, these would be derived from the actual location provided during issue reporting.
          </AlertDescription>
        </Alert>

      <div className="h-[calc(100vh-250px)] w-full border rounded-lg overflow-hidden">
        {!loading && userLocation ? (
          <LeafletMap center={userLocation} markers={issuesWithCoords} zoom={14} />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center">
            <p>Fetching your location...</p>
          </div>
        )}
      </div>
    </div>
  );
}
