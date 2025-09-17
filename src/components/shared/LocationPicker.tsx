'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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
        map.on('click', (e) => {
            onPositionChange(e.latlng);
        });

        return () => {
            map.off('click');
        };
    }, [map, onPositionChange]);

    return null;
}

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const mapRef = useRef<any>(null);

  const markerPosition: [number, number] | null = useMemo(() => {
    if (value) {
      try {
        const [lat, lng] = value.split(',').map(Number);
        if(!isNaN(lat) && !isNaN(lng)) return [lat, lng];
      } catch (error) {
         console.error("Invalid value for position", error);
      }
    }
    return position || defaultPosition;
  }, [value, position]);
  

  const handleLocateMe = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos: [number, number] = [latitude, longitude];
        setPosition(newPos);
        onChange(`${latitude}, ${longitude}`);
        if(mapRef.current) {
          mapRef.current.flyTo(newPos, 15);
        }
        setIsLocating(false);
      },
      (error) => {
        console.error(error);
        alert('Could not get your location. Please allow location access.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handlePositionChange = (latlng: LatLng) => {
      const newPos: [number, number] = [latlng.lat, latlng.lng];
      setPosition(newPos);
      onChange(`${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`);
  }

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    try {
        const [lat, lng] = e.target.value.split(',').map(s => parseFloat(s.trim()));
        if (!isNaN(lat) && !isNaN(lng)) {
            const newPos: [number, number] = [lat, lng];
            setPosition(newPos);
             if(mapRef.current) {
                mapRef.current.flyTo(newPos, mapRef.current.getZoom());
            }
        }
    } catch(err) {
        console.log("Waiting for valid coordinates");
    }
  }

  useEffect(() => {
    // Try to set position from value on initial load
    if (value) {
      try {
        const [lat, lng] = value.split(',').map(Number);
        if(!isNaN(lat) && !isNaN(lng)) setPosition([lat, lng]);
        else handleLocateMe(); // If invalid value, fetch current location
      } catch (e) {
        handleLocateMe(); // If parsing fails, fetch current location
      }
    } else {
        handleLocateMe();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once

  if (!position) {
    return (
        <div className="flex items-center justify-center h-[400px] w-full rounded-md border border-dashed">
            <p>Getting your location...</p>
        </div>
    )
  }

  return (
    <div className="space-y-2">
      <MapContainer
        whenCreated={(mapInstance) => { mapRef.current = mapInstance }}
        center={position}
        zoom={13}
        className="h-[300px] w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markerPosition && (
            <Marker 
                position={markerPosition} 
                icon={customIcon} 
                draggable={true}
                eventHandlers={{
                    dragend: (e) => {
                        handlePositionChange(e.target.getLatLng());
                    }
                }}
            />
        )}
        <MapEvents onPositionChange={handlePositionChange} />
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
