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
import { filterPropertiesWithinRadius } from '../utils/distanceCalc';


const client = generateClient<Schema>();
const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
  root.render(<div className='marker-span'></div>);
});

const addMArker: any = (text: string) => {
  div.getElementsByClassName('marker-span')[0].innerHTML = "$" + ((parseFloat(text) / 1000).toFixed(0)).toString() + 'K';
  return div.innerHTML;
}

const MapWithItems: React.FC = () => {

  const [zipCode, setZipCode] = useState<string | null>(() => {
    const savedZip = localStorage.getItem('zipCode');
    return savedZip ? JSON.parse(savedZip) : '';
  });
  const [position, setPosition] = useState<[number, number] | null>(null);
  //const [number, setNumber] = useState<number>(0);

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
      next: (data) => {
        position && setProperties(filterPropertiesWithinRadius(data?.items, position, 15))
      },
      error: (err) => setError(err.message),
    });

    // Cleanup the subscription on unmount
    return () => subscription.unsubscribe();
  }, [position]);

  const handleSavePosition = async () => {
    if (zipCode) {
      localStorage.setItem('zipCode', JSON.stringify(zipCode));
      const geoPosition = await geocodeZipCode(zipCode);
      if (geoPosition) {
        localStorage.setItem('userPosition', JSON.stringify(geoPosition));
        setUserPosition(geoPosition);
      } else {
        alert('Invalid ZIP code. Please enter a valid ZIP code.');
      }
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (geoPosition) => {
            const userPosition = { latitude: geoPosition.coords.latitude, longitude: geoPosition.coords.longitude };
            localStorage.setItem('userPosition', JSON.stringify(userPosition));
            setUserPosition(userPosition);
          })
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    }
  };

  useEffect(() => {
    if (!userPosition) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (geoPosition) => {
            const userPosition: [number, number] = [geoPosition.coords.latitude, geoPosition.coords.longitude];
            setPosition(userPosition);
          })
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    } else {
      const savedPosition: [number, number] = [userPosition.latitude, userPosition.longitude];
      setPosition(savedPosition);
    }
  }, [userPosition]);


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
    <div className='list-items' style={{'width': '95vw' }}>
      <div style={{ margin: '1em', position: 'relative', 'width': 'fit-content' }}>
        <TextField
          label="State, County, City, Zip Code..."
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
          sx={{ backgroundColor: 'white', width: '90vw', borderRadius: '1em' }}
        />
        <Button variant="contained" onClick={handleSavePosition} style={{ width: '4em', height: '4em', top: '0em', right: '0em', position: 'absolute', zIndex: 900 }}>
          <img src={Search} style={{ width: '3em' }} />
        </Button>
      </div>

      {
        showMap && position ? (
          <MapContainer center={position} zoom={13} style={{ height: '70vh', width: '90vw', margin: '1em 1em 1em 1em' }}>
            <ReactMarker cords={userPosition} />
            {
              properties.map(item => (
                item?.position &&
                <Marker
                  icon={divIcon({
                    html: addMArker(item?.price.toFixed(0))
                  })}
                  key={item.id}
                  position={[JSON.parse(item?.position).latitude, JSON.parse(item?.position).longitude]}>
                  <p>{item?.position}</p>
                  <Popup>
                    <div className='popupDiv'>
                      <Link to={`/property/${item.id}`}>
                        <Carousel className='imgCarousel' height={200}>
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
        )
      }

      <button style={{ 'zIndex': 9000, marginTop: '1em' }} onClick={toggleView}>
        {showMap ? 'Show List' : 'Show Map'}
      </button>
    </div >
  );
};

export default MapWithItems;
