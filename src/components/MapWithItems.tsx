import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import ListItems from './ListItems';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { icon } from "leaflet"
import { useAuthenticator } from '@aws-amplify/ui-react';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import { NumericFormat } from 'react-number-format';

const ICON = icon({
  iconUrl: "/marker.png",
})

const client = generateClient<Schema>();


const MapWithItems: React.FC = () => {
  const [itemsForSale, setItemsForSale] = useState<any[]>([]);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false); // State to toggle map view
  const [properties, setProperties] = useState<Array<any>>([]); // Adjust the type according to your schema
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    const subscription = client.models.Property.observeQuery(
      { authMode: "identityPool" }
    ).subscribe({
      next: (data) => setProperties(data.items),
      error: (err) => setError(err.message),
    });

    // Cleanup the subscription on unmount
    return () => subscription.unsubscribe();
  }, []);



  useEffect(() => {
    if (showMap) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (geoPosition) => {
            const userPosition: [number, number] = [geoPosition.coords.latitude, geoPosition.coords.longitude];
            setPosition(userPosition);
          })
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    }

    setItemsForSale(properties);

  }, [showMap, properties]);



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
      <button style={{'zIndex': 9000}} onClick={toggleView}>
        {showMap ? 'Show List' : 'Show Map'}
      </button>
      {showMap && position ? (
        <MapContainer center={position} zoom={13} style={{ height: '50vh', width: '100%' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.carto.com/attributions">CARTO</a>'
          />
          {
            itemsForSale.map(item => (
              item?.position && <Marker icon={ICON} key={item.id} position={[JSON.parse(item?.position).latitude, JSON.parse(item?.position).longitude]}>
                <p>{item?.position}</p>
                <Popup maxWidth={600} keepInView>
                  <div style={{
                    marginTop: "30px"
                  }}>
                    <h1>
                      <NumericFormat value={item?.price.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                    </h1>
                    <h2>
                      <NumericFormat value={item.squareFootage.toFixed(0)} displayType={'text'} thousandSeparator={true} suffix={'sqft'} />
                    </h2>
                    <p>{item?.description}</p>
                    <StorageImage key={item?.photos?.[0]} alt={item.description} style={{ float: 'left'}} path={item?.photos?.[0]} />
                    <p>
                      {user?.username === item.owner ? (
                        <Link to={`/sales/${item.id}`}>
                          Edit
                        </Link>
                      ) : (
                        <Link to={`/offers/null/${item?.address}/${item.id}/${item.owner}`}>
                          Make Offer
                        </Link>
                      )}
                    </p>
                  </div>
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
