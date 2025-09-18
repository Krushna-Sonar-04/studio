'use client';

import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

// This is a common and necessary fix for a known issue with Webpack and Leaflet.
// It ensures that the default marker icons can be found and displayed correctly
// by manually setting the paths to the icon images. This code runs once when
// the module is imported, before any components are rendered.
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

// A helper component to programmatically control the map (e.g., fly to a new location)
// without causing the main MapContainer to re-render, which is a common source of errors.
const MapController = ({ flyTo, zoom }: { flyTo: LatLngTuple; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    if (flyTo) {
      map.flyTo(flyTo, zoom);
    }
  }, [flyTo, zoom, map]);
  return null;
};

// A helper component to handle map click events without adding the event listener
// directly to the MapContainer, which can also cause re-render issues.
const MapClickHandler = ({ onMapClick }: { onMapClick: (latlng: { lat: number; lng: number }) => void }) => {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
};


interface MapProps {
  center: LatLngTuple;
  markerPosition?: LatLngTuple;
  markers?: IssueMarker[];
  zoom?: number;
  onMapClick?: (latlng: { lat: number; lng: number }) => void;
  flyTo?: LatLngTuple;
  scrollWheelZoom?: boolean;
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

  // The "Map container is already initialized" error occurs because React's StrictMode
  // (in development) re-mounts components to detect side effects. This causes Leaflet
  // to try to initialize a new map on the same div.
  //
  // THE FIX:
  // 1. Use `useState` (`isMounted`) to track if the component has mounted on the client.
  // 2. The `useEffect` with an empty dependency array `[]` runs ONLY ONCE after the
  //    initial client-side render, where we safely set `isMounted` to true.
  // 3. We conditionally render `<MapContainer>` only when `isMounted` is true.
  //
  // This two-step process ensures that `MapContainer` is only ever rendered a single
  // time on the client, completely avoiding the double-initialization problem.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // While the component is not yet mounted on the client, render nothing or a placeholder.
    // This prevents any server-side rendering attempts for the map.
    return null;
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

        {/* In a real application, you would replace this `markers` prop
            with data fetched from a database like Firestore. */}
        {markers && markers.map(issue => {
            return (
              <Marker key={issue.id} position={[issue.lat, issue.lng]}>
                 <Popup>
                    {issue.title}
                    <br/>
                    <Button size="sm" className="w-full mt-2" onClick={() => router.push(`/citizen/issues/${issue.id}`)}>
                        View Details
                    </Button>
                </Popup>
              </Marker>
            )
        })}
        
        {/* Handle the single, draggable-like marker for the report page */}
        {markerPosition && <Marker position={markerPosition} />}

        {/* Use helper components to manage map state and events */}
        {flyTo && <MapController flyTo={flyTo} zoom={zoom} />}
        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
      </MapContainer>
  );
};

LeafletMap.displayName = 'LeafletMap';

export default LeafletMap;
