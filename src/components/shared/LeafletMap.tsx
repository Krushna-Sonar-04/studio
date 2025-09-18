'use client';

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngTuple, Map } from 'leaflet';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

// Fix for default icon path issue with webpack which is common in Next.js
// This ensures Leaflet can find its marker icon images.
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


// Internal component to handle map view changes like flying to a new location.
const MapController = ({ flyTo, zoom }: { flyTo?: LatLngTuple, zoom: number}) => {
    const map = useMap();
    useEffect(() => {
        if(flyTo) {
             map.flyTo(flyTo, zoom);
        }
    }, [flyTo, zoom, map]);

    return null;
}

// Internal component to handle map click events, used for dropping a pin.
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
  const [isMounted, setIsMounted] = useState(false);

  // The "Map container is already initialized" error occurs because in React's StrictMode (used in Next.js development),
  // components can render twice to detect side effects. If a library like Leaflet initializes a map on a DOM element,
  // the second render will try to initialize it again on the same element, causing the error.
  // By using useEffect with an empty dependency array, we ensure the MapContainer is only rendered *after*
  // the component has mounted on the client-side, and only once. The `isMounted` flag prevents server-side rendering.
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
        // Using a key here is NOT recommended as it can cause the re-initialization error by forcing a remount.
        // The component's internal state should be managed by its props and internal hooks like `useMap`.
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

LeafletMap.displayName = 'LeafletMap';

export default LeafletMap;
