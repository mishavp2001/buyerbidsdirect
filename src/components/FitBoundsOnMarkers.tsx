import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { LatLngBoundsExpression } from 'leaflet';

interface MarkerData {
    latitude: number;
    longitude: number;
    price: number;
    id: string;
  }
  
  // Utility to gather bounds from marker positions
  const getBoundsFromMarkers = (markers: MarkerData[]): LatLngBoundsExpression => {
    const latLngs = markers.map(marker => [marker.latitude, marker.longitude]);
    return latLngs as LatLngBoundsExpression;
  };
  
  export const FitBoundsOnMarkers = ({ markers, isProgrammaticMove }: { markers: MarkerData[], isProgrammaticMove: boolean }) => {
    const map = useMap();
  
    useEffect(() => {
      if (isProgrammaticMove && markers.length > 0) {
        const bounds = getBoundsFromMarkers(markers);
        map.fitBounds(bounds, { padding: [50, 50] });  // Adjust the map to fit all markers with padding
      }
    }, [isProgrammaticMove, markers, map]);
  
    return null;
  };
  