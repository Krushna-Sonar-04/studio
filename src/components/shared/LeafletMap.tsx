'use client';

import React, { useEffect, useState, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L, { LatLngTuple, Map as LeafletMapInstance } from 'leaflet';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

// This is a common fix for a known issue with Webpack and Leaflet.
// It ensures that the default marker icons can be found and displayed correctly.
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

const LeafletMap: React.FC<MapProps> = ({ 
    center, 
    markerPosition, 
    markers,
    zoom = 13, 
    onMapClick,
    flyTo,
    scrollWheelZoom = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMapInstance | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const router = useRouter();

  useEffect(() => {
    // This effect hook handles the entire lifecycle of the Leaflet map.
    // It creates the map instance, adds layers, and importantly, cleans up
    // by calling `map.remove()` on unmount.

    // The "Map container is already initialized" error happens when React's StrictMode
    // (in development) causes a component to re-mount, and a new map tries to initialize
    // on the same div. The cleanup function (`return () => ...`) is the definitive
    // fix because it properly destroys the old map instance before the new one can be created.
    if (mapContainerRef.current && !mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
            center: center,
            zoom: zoom,
            scrollWheelZoom: scrollWheelZoom
        });
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        if (onMapClick) {
          map.on('click', (e) => {
            onMapClick(e.latlng);
          });
        }
    }

    return () => {
        // Cleanup on unmount
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    };
  }, []); // Empty dependency array ensures this runs only once on mount and unmount.

  // Effect for updating markers
  useEffect(() => {
    if (mapInstanceRef.current) {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // In a real application, you would replace this `markers` prop
      // with data fetched from a database like Firestore.
      if (markers) {
        const newMarkers = markers.map(issue => {
            const popupContent = document.createElement('div');
            popupContent.className = 'p-1 space-y-2';
            
            const title = document.createElement('h4');
            title.className = 'font-bold text-base';
            title.innerText = issue.title;

            const button = document.createElement('button');
            button.innerText = 'View Details';
            // Use Tailwind classes via a regular class attribute
            button.className = 'w-full h-9 px-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm';
            button.onclick = () => router.push(`/citizen/issues/${issue.id}`);
            
            popupContent.appendChild(title);
            popupContent.appendChild(button);

            const marker = L.marker([issue.lat, issue.lng]).bindPopup(popupContent);
            return marker;
        });
        
        newMarkers.forEach(marker => marker.addTo(mapInstanceRef.current!));
        markersRef.current = newMarkers;
      }
      
      // Handle the single, draggable-like marker for the report page
      if (markerPosition) {
         const newMarkers = [L.marker(markerPosition)];
         newMarkers.forEach(marker => marker.addTo(mapInstanceRef.current!));
         markersRef.current = newMarkers;
      }
    }
  }, [markers, markerPosition, router]);
  
  // Effect for flying to a new location
   useEffect(() => {
        if (mapInstanceRef.current && flyTo) {
            mapInstanceRef.current.flyTo(flyTo, zoom);
        }
    }, [flyTo, zoom]);


  // The component returns a simple div. The map is injected into it by the useEffect hook.
  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />;
};

LeafletMap.displayName = 'LeafletMap';

export default LeafletMap;
