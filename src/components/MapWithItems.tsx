import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import ListItems from './ListItems';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Link } from 'react-router-dom';
import { getGeoLocation } from '../utils/getGeoLocation';
import 'leaflet/dist/leaflet.css';

const client = generateClient<Schema>();


const MapWithItems: React.FC = () => {
  const [itemsForSale, setItemsForSale] = useState<any[]>([]);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false); // State to toggle map view
  const [properties, setProperties] = useState<Array<any>>([]); // Adjust the type according to your schema

  useEffect(() => {
    const subscription = client.models.Property.observeQuery().subscribe({
      next: (data) => setProperties(data.items),
      error: (err) => setError(err.message),
    });

    // Cleanup the subscription on unmount
    return () => subscription.unsubscribe();
  }, []);



  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (geoPosition) => {
          const userPosition: [number, number] = [geoPosition.coords.latitude, geoPosition.coords.longitude];
          setPosition(userPosition);
        })
    } else {
      setError('Geolocation is not supported by this browser.');
    }
    const updateItems = async () => {
      const updatedItems = await Promise.all(
        properties.map(async (item) => {
          if (item?.address) {
            try {
              const geoPosition = await getGeoLocation(item.address);
              return {
                ...item,
                position: [geoPosition?.latitude || position?.[0], geoPosition?.longitude || position?.[1]],
              };
            } catch (geoError) {
              console.error(`Failed to fetch geolocation for address: ${item.address}`, geoError);
              return { ...item, position: position };
            }
          } else {
            return { ...item, position: position };
          }
        })
      );
      setItemsForSale(updatedItems);
    };

    updateItems();
  }, [properties]);




  const toggleView = () => {
    setShowMap(!showMap);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!properties) {
    return <div>Loading...</div>;
  }

  return (
    <div className='list-items'>
      <button onClick={toggleView}>
        {showMap ? 'Show List' : 'Show Map'}
      </button>
      {showMap ? (
        <MapContainer center={position ?? [0, 0]} zoom={13} style={{ height: '50vh', width: '100%' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.carto.com/attributions">CARTO</a>'
          />
          {itemsForSale.map(item => (
            item?.position && <Marker key={item.id} position={item?.position ?? [0, 0]}>
              <Popup>
                <strong>Price: {item?.price}</strong><br />
                <strong>Square Footage: {item.squareFootage}</strong><br />
                <p>{item?.description}</p>
                <p>{item?.photos}</p>
                <p>
                  <Link to={`/offers/${item.id}/${item?.address}`}>
                    Make Offer
                  </Link>
                </p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <ListItems properties={properties} />
      )}
    </div>
  );
};

export default MapWithItems;
