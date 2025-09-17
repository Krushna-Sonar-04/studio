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
    // Dynamically import Leaflet
    import('leaflet').then(L => {
      LRef.current = L;

      // Webpack icon fix
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
        iconUrl: require('leaflet/dist/images/marker-icon.png').default,
        shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
      });

      if (mapContainerRef.current && !mapRef.current) {
        // Initialize map only once
        const map = L.map(mapContainerRef.current, {
          center: center,
          zoom: 13,
          scrollWheelZoom: scrollWheelZoom,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
        
        if (!isInteractive) {
            map.dragging.disable();
            map.touchZoom.disable();
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();
            map.boxZoom.disable();
            map.keyboard.disable();
            if (map.tap) map.tap.disable();
        }

        if (onMapClick) {
          map.on('click', (e: any) => {
            onMapClick(e.latlng);
          });
        }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once

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
    if (mapRef.current && !scrollWheelZoom) {
      mapRef.current.scrollWheelZoom.disable();
    } else if (mapRef.current && scrollWheelZoom){
       mapRef.current.scrollWheelZoom.enable();
    }
  }, [scrollWheelZoom]);


  return <div ref={mapContainerRef} className="h-[400px] w-full" />;
};

export default LeafletMap;
