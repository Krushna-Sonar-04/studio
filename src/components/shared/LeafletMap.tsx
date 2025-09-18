'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngTuple } from 'leaflet';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

// This is a common fix for a known issue with Webpack and Leaflet.
// It ensures that the default marker icons can be found and displayed correctly.
// Without this, you might see broken image icons for markers.
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
  iconUrl: require('leaflet/dist/images/marker-icon.png').default,
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
});


export interface IssueMarker {
  id: string;
  title: string;
  lat: number;
  lng: number;
}

interface MapProps {
  center: LatLngTuple;
  markerPosition?: LatLngTuple;
  markers?: IssueMarker[];
  zoom?: number;
  onMapClick?: (latlng: { lat: number; lng: number }) => void;
  flyTo?: LatLngTuple;
  scrollWheelZoom?: boolean;
}


// This internal component uses the `useMap` hook from `react-leaflet`
// to control the map instance imperatively. This is the correct way to
// trigger actions like flying to a new location without re-rendering the
// entire MapContainer, which helps prevent initialization errors.
const MapController = ({ flyTo, zoom }: { flyTo?: LatLngTuple, zoom: number}) => {
    const map = useMap();
    useEffect(() => {
        if(flyTo) {
             map.flyTo(flyTo, zoom);
        }
    }, [flyTo, zoom, map]);

    return null;
}

// This component handles map click events. It's separated to keep concerns
// clean and avoid adding too many props to the main component.
const MapClickHandler = ({ onMapClick }: { onMapClick?: (latlng: { lat: number; lng: number }) => void }) => {
    useMap({
        click: (e) => {
            if(onMapClick) {
                onMapClick(e.latlng);
            }
        },
    });
    return null;
}

const LeafletMap: React.FC<MapProps> = ({ 
    center, 
    markerPosition, 
    markers,
    zoom = 13, 
    onMapClick,
    flyTo,
    scrollWheelZoom = true,
}) => {
  const router = useRouter();
  
  // The "Map container is already initialized" error occurs because in React's StrictMode (used in Next.js development),
  // components can render twice to detect side effects. If a library like Leaflet initializes a map on a DOM element,
  // the second render will try to initialize it again, causing the error.
  // By using `useState` and `useEffect` to only render the `<MapContainer>` *after* the component has mounted
  // on the client-side, we guarantee it only runs once in the browser, which is the definitive fix for this issue.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
        <div className="h-full w-full bg-muted flex items-center justify-center">
            <p>Loading map...</p>
        </div>
    );
  }

  return (
    <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={scrollWheelZoom} 
        style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController flyTo={flyTo} zoom={zoom} />
      <MapClickHandler onMapClick={onMapClick} />

      {/* Marker for selecting a location on the report page */}
      {markerPosition && <Marker position={markerPosition} />}
      
      {/* In a real application, you would replace this `markers` prop
          with data fetched from a database like Firestore. */}
      {markers && markers.map(issue => (
        <Marker key={issue.id} position={[issue.lat, issue.lng]}>
          <Popup>
            <div className="p-1 space-y-2">
                <h4 className="font-bold text-base">{issue.title}</h4>
                <Button 
                    size="sm"
                    className="w-full"
                    onClick={() => router.push(`/citizen/issues/${issue.id}`)}
                >
                    View Details
                </Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

// It's good practice to provide a display name for components, especially
// when using React DevTools or for debugging.
LeafletMap.displayName = 'LeafletMap';

export default LeafletMap;
