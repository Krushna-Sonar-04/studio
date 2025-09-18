
'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LocateFixed, Map, Terminal } from 'lucide-react';
import { LatLngTuple } from 'leaflet';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Default to a central location in case geolocation fails.
const DEFAULT_CENTER: LatLngTuple = [18.5204, 73.8567];

export default function NearbyIssuesMapPage() {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<LatLngTuple | null>(null);

  useEffect(() => {
    // Geolocation is not used as the map is disabled, but the logic is kept for future use.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation: LatLngTuple = [position.coords.latitude, position.coords.longitude];
            setUserLocation(newLocation);
          },
          (error) => {
            console.error("Error getting user location:", error);
            setUserLocation(DEFAULT_CENTER);
            toast({
              variant: 'destructive',
              title: "Could not get your location.",
              description: "Showing default location.",
            });
          }
        );
    }
  }, [toast]);
  
  const handleRecenter = () => {
      toast({ title: "Feature Unavailable", description: "The map is temporarily under maintenance." });
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
        <Button onClick={handleRecenter} variant="outline" disabled>
            <LocateFixed className="mr-2 h-4 w-4" />
            Recenter on Me
        </Button>
      </div>

       <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Developer Note</AlertTitle>
          <AlertDescription>
            The interactive map feature is temporarily disabled to resolve a persistent error. This placeholder is in its place.
          </AlertDescription>
        </Alert>

      <Card className="h-[calc(100vh-300px)] w-full border rounded-lg overflow-hidden">
        <CardContent className="h-full flex flex-col items-center justify-center gap-4 text-center bg-muted/20">
            <Map className="h-16 w-16 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Map Temporarily Unavailable</h3>
            <p className="text-muted-foreground max-w-sm">We are working on fixing an issue with the interactive map. This feature will be restored soon. Thank you for your patience.</p>
        </CardContent>
      </Card>
    </div>
  );
}
