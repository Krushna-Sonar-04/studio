'use client';

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

// Fix for default icon path issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface IssueMarker {
  id: string;
  title: string;
  lat: number;
  lng: number;
}

interface IssuesMapProps {
  center: LatLngExpression;
  issues: IssueMarker[];
}

// A component to fly to the new center when it changes
const ChangeView = ({ center }: { center: LatLngExpression }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 14);
    }, [center, map]);
    return null;
}

const IssuesMap: React.FC<IssuesMapProps> = ({ center, issues }) => {
  const router = useRouter();

  return (
    <MapContainer center={center} zoom={14} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ChangeView center={center} />

      {/* Marker for user's location */}
      <Marker position={center}>
        <Popup>Your current location</Popup>
      </Marker>

      {/* Markers for issues */}
      {issues.map(issue => (
        <Marker key={issue.id} position={[issue.lat, issue.lng]}>
          <Popup>
            <div className="p-1">
                <h4 className="font-bold text-base mb-2">{issue.title}</h4>
                <Button 
                    size="sm"
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

export default IssuesMap;
