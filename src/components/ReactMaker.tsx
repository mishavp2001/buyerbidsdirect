import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export const ReactMaker = ({ center, isProgrammaticMove}: { center: [number, number], isProgrammaticMove: boolean }) => {
  const map = useMap();

  useEffect(() => {
    if (center && isProgrammaticMove) {
      map.setView(center);  // Recenter the map
    }
  }, [center, map]);

  return null;
};
