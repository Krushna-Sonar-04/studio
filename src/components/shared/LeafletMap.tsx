'use client';

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
  center: [number, number];
  markerPosition?: [number, number];
  onMapClick?: (latlng: { lat: number; lng: number }) => void;
  flyTo?: [number, number];
  isInteractive?: boolean;
  scrollWheelZoom?: boolean;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  markerPosition,
  onMapClick,
  flyTo,
  isInteractive = true,
  scrollWheelZoom = true,
}) => {
  const mapRef = useRef<any>(null); // L.Map
  const markerRef = useRef<any>(null); // L.Marker
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const LRef = useRef<any>(null); // To store the leaflet module

  useEffect(() => {
    import('leaflet').then(L => {
      LRef.current = L;

      if (mapContainerRef.current && !mapRef.current) {
        // Webpack icon fix
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
            iconUrl: require('leaflet/dist/images/marker-icon.png').default,
            shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
        });

        const map = L.map(mapContainerRef.current, {
          center: center,
          zoom: 13,
          scrollWheelZoom: scrollWheelZoom,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
        
        mapRef.current = map;
      }
    });

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Run only once on mount

  useEffect(() => {
    if (mapRef.current && LRef.current) {
      if (!isInteractive) {
        mapRef.current.dragging.disable();
        mapRef.current.touchZoom.disable();
        mapRef.current.doubleClickZoom.disable();
        mapRef.current.scrollWheelZoom.disable();
        mapRef.current.boxZoom.disable();
        mapRef.current.keyboard.disable();
        if (mapRef.current.tap) mapRef.current.tap.disable();
      } else {
        mapRef.current.dragging.enable();
        mapRef.current.touchZoom.enable();
        mapRef.current.doubleClickZoom.enable();
        mapRef.current.scrollWheelZoom.enable();
        mapRef.current.boxZoom.enable();
        mapRef.current.keyboard.enable();
        if (mapRef.current.tap) mapRef.current.tap.enable();
      }

      const map = mapRef.current;
      map.off('click'); // Remove previous listeners
      if (onMapClick) {
        map.on('click', (e: any) => {
          onMapClick(e.latlng);
        });
      }
    }
  }, [isInteractive, onMapClick]);


  useEffect(() => {
    if (mapRef.current && LRef.current && markerPosition) {
      if (markerRef.current) {
        markerRef.current.setLatLng(markerPosition);
      } else {
        markerRef.current = LRef.current.marker(markerPosition).addTo(mapRef.current);
      }
    }
  }, [markerPosition]);

  useEffect(() => {
    if (mapRef.current && flyTo) {
      mapRef.current.flyTo(flyTo, mapRef.current.getZoom());
    }
  }, [flyTo]);
  
  useEffect(() => {
    if (mapRef.current) {
        if (!scrollWheelZoom) {
            mapRef.current.scrollWheelZoom.disable();
        } else {
            mapRef.current.scrollWheelZoom.enable();
        }
    }
  }, [scrollWheelZoom]);


  return <div ref={mapContainerRef} className="h-[400px] w-full" />;
};

export default LeafletMap;
