'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { LatLng, Icon } from 'leaflet';
import { Button } from '@/components/ui/button';
import { LocateFixed } from 'lucide-react';
import { Input } from '../ui/input';

interface LocationPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const defaultPosition: [number, number] = [20.5937, 78.9629]; // India

const customIcon = new Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});

function LocationHandler({ onPositionChange, position }: { onPositionChange: (latlng: LatLng) => void; position: [number, number] }) {
    const map = useMap();

    useMapEvents({
        click(e) {
            onPositionChange(e.latlng);
        },
    });

    useEffect(() => {
        map.flyTo(position, map.getZoom());
    }, [position, map]);

    return (
        <Marker 
            position={position} 
            icon={customIcon} 
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                    onPositionChange(e.target.getLatLng());
                }
            }}
        />
    );
}

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(true);

  const parseValue = (val: string): [number, number] | null => {
    if (!val) return null;
    const parts = val.split(',');
    if (parts.length === 2) {
        const lat = parseFloat(parts[0].trim());
        const lng = parseFloat(parts[1].trim());
        if (!isNaN(lat) && !isNaN(lng)) {
            return [lat, lng];
        }
    }
    return null;
  };
  
  useEffect(() => {
    const initialPos = parseValue(value);
    if (initialPos) {
      setPosition(initialPos);
      setIsLocating(false);
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setPosition(newPos);
          onChange(`${newPos[0]}, ${newPos[1]}`);
          setIsLocating(false);
        },
        () => {
          setPosition(defaultPosition);
          onChange(`${defaultPosition[0]}, ${defaultPosition[1]}`);
          setIsLocating(false);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  const handlePositionChange = (latlng: LatLng) => {
    const newPos: [number, number] = [latlng.lat, latlng.lng];
    setPosition(newPos);
    onChange(`${newPos[0].toFixed(6)}, ${newPos[1].toFixed(6)}`);
  };

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    const newPos = parseValue(newValue);
    if (newPos) {
        setPosition(newPos);
    }
  };
  
  const handleLocateMe = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos: [number, number] = [latitude, longitude];
        setPosition(newPos);
        onChange(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setIsLocating(false);
      },
      (error) => {
        console.error(error);
        setIsLocating(false);
      }
    );
  };

  if (!position) {
    return (
      <div className="flex items-center justify-center h-[400px] w-full rounded-md border border-dashed">
        <p>Getting your location...</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
       <MapContainer center={position} zoom={13} className="h-[300px] w-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationHandler onPositionChange={handlePositionChange} position={position} />
      </MapContainer>
      
      <div className="flex gap-2">
         <Input
            type="text"
            value={value}
            onChange={handleManualInputChange}
            placeholder="lat, lng or click the map"
        />
        <Button type="button" variant="outline" onClick={handleLocateMe} disabled={isLocating}>
            <LocateFixed className={`mr-2 h-4 w-4 ${isLocating ? 'animate-pulse' : ''}`} />
            Locate Me
        </Button>
      </div>

    </div>
  );
}
