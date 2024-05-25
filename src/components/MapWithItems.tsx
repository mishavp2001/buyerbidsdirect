import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import ListItems from './ListItems';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import 'leaflet/dist/leaflet.css';

const client = generateClient<Schema>();

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

  const [properties, setProperties] = useState<Array<Schema["Property"]["type"]>>([]);

  useEffect(() => {
    client.models.Property.observeQuery().subscribe({
      next: (data) => setProperties([...data.items]),
    });
  }, []);
  
  function createProperty() {
    client.models.Property.create({address: {'street': '92 second street'}, propertyType: 'house', price: 400000});
  }
  

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (geoPosition) => {
          const userPosition: [number, number] = [geoPosition.coords.latitude, geoPosition.coords.longitude];
          setPosition(userPosition);

          // Update item positions to be near the user's position
          const updatedItems = initialItemsForSale.map((item) => ({
            ...item,
            position: [
              userPosition[0] + getRandomOffset(),
              userPosition[1] + getRandomOffset()
            ] as [number, number]
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
    <div className='list-items'>
      <button onClick={toggleView}>
        {showMap ? 'Show List' : 'Show Map'}
      </button>
      <button onClick={createProperty}>
          Add house for sale
      </button>
      {properties.map(prop => 
        <li
          key={prop.id}>
          {prop?.address?.street} {prop.propertyType} {prop.price}
        </li>)}
      {showMap ? (
        <MapContainer center={position} zoom={13} style={{ height: '50vh', width: '100%' }}>
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
        <ListItems />
      )}
    </div>
  );
};

export default MapWithItems;
