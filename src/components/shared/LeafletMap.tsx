'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngTuple } from 'leaflet';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

// Fix for default icon path issue with webpack
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

// Component to handle map view changes
const MapFlyTo = ({ center, zoom, flyTo }: { center: LatLngTuple, zoom: number, flyTo?: LatLngTuple}) => {
    const map = useMap();
    useEffect(() => {
        if(flyTo) {
             map.flyTo(flyTo, zoom);
        } else {
            map.setView(center, zoom);
        }
    }, [center, zoom, flyTo, map]);

    return null;
}

// Component to handle map click events
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
      <MapFlyTo center={center} zoom={zoom} flyTo={flyTo} />
      <MapClickHandler onMapClick={onMapClick} />

      {markerPosition && <Marker position={markerPosition} />}
      
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

export default LeafletMap;
