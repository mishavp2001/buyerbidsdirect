import React, { useState, useEffect } from 'react';
import { MapContainer, Marker, Popup } from 'react-leaflet';
import ListItems from './ListItems';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { divIcon } from "leaflet"
import { useAuthenticator } from '@aws-amplify/ui-react';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import { NumericFormat } from 'react-number-format';
import Carousel from 'react-material-ui-carousel';
import { TextField, Button } from '@mui/material';
import { geocodeZipCode } from '../utils/getGeoLocation';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { ReactMarker } from './ReactMaker';
import Search from '/search.svg';


const client = generateClient<Schema>();
const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
  root.render(<div className='marker-span'></div>);
});

const addMArker: any = (text:string) => {
  div.getElementsByClassName('marker-span')[0].innerHTML = "$" + ((parseFloat(text)/1000).toFixed(0)).toString() + 'K';
  return div.innerHTML;
}


const MapWithItems: React.FC = () => {

  const [zipCode, setZipCode] = useState<string>('');
  const [itemsForSale, setItemsForSale] = useState<any[]>([]);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState<boolean>(() => {
    const savedPreference = localStorage.getItem('showMap');
    return savedPreference ? JSON.parse(savedPreference) : false;
  });
  const [userPosition, setUserPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(() => {
    const savedPosition = localStorage.getItem('userPosition');
    return savedPosition ? JSON.parse(savedPosition) : null;
  });

  useEffect(() => {
    localStorage.setItem('showMap', JSON.stringify(showMap));
  }, [showMap]);

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

  const handleSavePosition = async () => {
    const geoPosition = await geocodeZipCode(zipCode);
    if (geoPosition) {
      setUserPosition(geoPosition);
    } else {
      alert('Invalid ZIP code. Please enter a valid ZIP code.');
    }
  };

  useEffect(() => {
    if (showMap && !userPosition) {
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
      <button style={{ 'zIndex': 9000 }} onClick={toggleView}>
        {showMap ? 'Show List' : 'Show Map'}
      </button>
      {showMap && <>
        <TextField
          label="State, County, City, Zip Code..."
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          sx={{ margin: '0em 1em 1em 1em', backgroundColor: 'white', width: '20em'}} />
        <Button variant="contained" onClick={handleSavePosition}>
          <img src={Search} style={{width: '3em'}}/>
        </Button>
      </>
      }
      {showMap && position ? (
        <MapContainer center={position} zoom={13} style={{ height: '50vh', width: '100%' }}>
          <ReactMarker cords={userPosition} />
          {
            itemsForSale.map(item => (
              item?.position && 
              <Marker 
                icon={divIcon({
                  html: addMArker(item?.price.toFixed(0))
                })}
                key={item.id} 
                position={[JSON.parse(item?.position).latitude, JSON.parse(item?.position).longitude]}>
                <p>{item?.position}</p>
                <Popup>
                  <div style={{
                    marginTop: "30px"
                  }}>
                    <Link to={`/property/${item.id}`}>
                      <Carousel height={200}>
                        {item?.photos?.length && item?.photos?.map(
                          (image: string, i: number) => {
                            return <StorageImage key={i} alt={image} style={{ float: 'left' }} path={image} />
                          })
                        }
                      </Carousel>

                      <h1>
                        <NumericFormat value={item?.price.toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                      </h1>

                      <p>{item.bedrooms} bds | {item.bathrooms} ba | <NumericFormat value={item.squareFootage.toFixed(0)} displayType={'text'} thousandSeparator={true} suffix={' sqft '} />
                        - {item?.description}
                      </p>
                    </Link>
                    <>
                      {user?.username === item.owner ? (
                        <Link to={`/sales/${item.id}`}>
                          Edit
                        </Link>
                      ) : (
                        <Link to={`/offers/null/${item?.address}/${item.id}/${item.owner}`}>
                          Make Offer
                        </Link>
                      )}
                    </>
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
