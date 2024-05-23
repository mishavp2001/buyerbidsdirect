// src/MapWithItems.tsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Type definition for an item
interface Item {
  id: number;
  name: string;
  position: [number, number];
  description: string;
}

// Initial sample data for items for sale
const initialItemsForSale: Omit<Item, 'position'>[] = [
  { id: 1, name: 'Item 1', description: 'Description for item 1' },
  { id: 2, name: 'Item 2', description: 'Description for item 2' },
  { id: 3, name: 'Item 3', description: 'Description for item 3' },
];

const getRandomOffset = () => (Math.random() - 0.5) * 0.02; // Generates a random offset within a small range

const MapWithItems: React.FC = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [itemsForSale, setItemsForSale] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState<boolean>(true); // State to toggle map view

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPosition: [number, number] = [position.coords.latitude, position.coords.longitude];
          setPosition(userPosition);

          // Update item positions to be near the user's position
          const updatedItems = initialItemsForSale.map((item) => ({
            ...item,
            position: [
              userPosition[0] + getRandomOffset(), 
              userPosition[1] + getRandomOffset()
            ]
          }));
          setItemsForSale(updatedItems);
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  const toggleView = () => {
    setShowMap(!showMap);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!position) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={toggleView}>
        {showMap ? 'Show List' : 'Show Map'}
      </button>
      {showMap ? (
        <MapContainer center={position} zoom={13} style={{ height: '100vh', width: '100%' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.carto.com/attributions">CARTO</a>'
          />
          {itemsForSale.map(item => (
            <Marker key={item.id} position={item.position}>
              <Popup>
                <strong>{item.name}</strong><br />
                {item.description}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <ul>
          {itemsForSale.map(item => (
            <li key={item.id}>
              <strong>{item.name}</strong>: {item.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MapWithItems;
