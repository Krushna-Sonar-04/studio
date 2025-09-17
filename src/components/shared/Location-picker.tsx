'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { LatLng, Icon } from 'leaflet';
import { Button } from '@/components/ui/button';
import { LocateFixed } from 'lucide-react';
import { Input } from '../ui/input';

interface LocationPickerProps {
  value: string;
  onChange: (value: string) => void;
}

// Default to a central location if geolocation fails or is denied
const defaultPosition: [number, number] = [20.5937, 78.9629]; // India

const customIcon = new Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41]
});


function MapEvents({ onPositionChange }: { onPositionChange: (latlng: LatLng) => void }) {
    const map = useMap();

    useEffect(() => {
        const clickHandler = (e: any) => {
            onPositionChange(e.latlng);
        };
        map.on('click', clickHandler);

        return () => {
            map.off('click', clickHandler);
        };
    }, [map, onPositionChange]);

    return null;
}

function LocationUpdater({ position }: { position: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(position, map.getZoom());
    }, [map, position]);
    return null;
}


export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  
  const parseValue = (val: string): [number, number] | null => {
    try {
        const [lat, lng] = val.split(',').map(s => parseFloat(s.trim()));
        if (!isNaN(lat) && !isNaN(lng)) {
            return [lat, lng];
        }
    } catch(err) {
        // ignore
    }
    return null;
  }

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
        // If user denies location, use the default position
        setPosition(defaultPosition);
        onChange(`${defaultPosition[0].toFixed(6)}, ${defaultPosition[1].toFixed(6)}`);
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    const initialPos = parseValue(value);
    if(initialPos) {
        setPosition(initialPos);
        setIsLocating(false);
    } else {
        handleLocateMe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePositionChange = (latlng: LatLng) => {
      const newPos: [number, number] = [latlng.lat, latlng.lng];
      setPosition(newPos);
      onChange(`${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`);
  }

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    const newPos = parseValue(newValue);
    if (newPos) {
        setPosition(newPos);
    }
  }

  return (
    <div className="space-y-2">
       {isLocating || !position ? (
         <div className="flex items-center justify-center h-[300px] w-full rounded-md border border-dashed">
            <p>Getting your location...</p>
        </div>
       ) : (
        <MapContainer
            center={position}
            zoom={13}
            className="h-[300px] w-full z-0"
            key={position.join('-')} // Add a key to force re-render when position is set
        >
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker 
                position={position} 
                icon={customIcon} 
                draggable={true}
                eventHandlers={{
                    dragend: (e) => {
                        handlePositionChange(e.target.getLatLng());
                    }
                }}
            />
            <MapEvents onPositionChange={handlePositionChange} />
            <LocationUpdater position={position} />
      </MapContainer>
       )}
      
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
