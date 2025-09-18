
'use client';

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L, { LatLngTuple, Map as LeafletMapInstance } from 'leaflet';
import { useRouter } from 'next/navigation';

// FIX: This is a common and necessary fix for a known issue with Webpack and Leaflet.
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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMapInstance | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    // Initialize the map only if the container ref is available and a map instance doesn't already exist.
    if (mapContainerRef.current && !mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapContainerRef.current, {
            center: center,
            zoom: zoom,
            scrollWheelZoom: scrollWheelZoom,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstanceRef.current);

        // Add click handler if provided
        if (onMapClick) {
            mapInstanceRef.current.on('click', (e) => {
                onMapClick(e.latlng);
            });
        }
    }

    // Cleanup function to run when the component unmounts
    return () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this effect runs only once on mount.


  // Effect to handle flying to a new location
  useEffect(() => {
      if (mapInstanceRef.current && flyTo) {
          mapInstanceRef.current.flyTo(flyTo, zoom);
      }
  }, [flyTo, zoom]);

  // Effect to handle updating markers
  useEffect(() => {
      const map = mapInstanceRef.current;
      if (map) {
          // Clear existing markers from the map
          markersRef.current.forEach(marker => marker.removeFrom(map));
          markersRef.current = [];

          // Add single marker for the report page
          if (markerPosition) {
             const marker = L.marker(markerPosition).addTo(map);
             markersRef.current.push(marker);
          }

          // Add multiple markers for the nearby issues page
          if (markers) {
            markers.forEach(issue => {
              const popupContent = document.createElement('div');
              popupContent.innerHTML = `<b>${issue.title}</b><br/>`;
              const button = document.createElement('button');
              button.innerHTML = 'View Details';
              button.className = 'w-full mt-2 p-1 bg-primary text-primary-foreground rounded text-sm';
              button.onclick = () => router.push(`/citizen/issues/${issue.id}`);
              popupContent.appendChild(button);
              
              const marker = L.marker([issue.lat, issue.lng])
                .addTo(map)
                .bindPopup(popupContent);
              markersRef.current.push(marker);
            });
          }
      }
  }, [markerPosition, markers, router]);


  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />;
};

LeafletMap.displayName = 'LeafletMap';

export default LeafletMap;
