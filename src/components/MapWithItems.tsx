import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, Marker, Popup, useMap, TileLayer } from 'react-leaflet';
import ListItems from './ListItems';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { LatLngBoundsExpression, divIcon } from "leaflet";
import { StorageImage } from '@aws-amplify/ui-react-storage';
import { NumericFormat } from 'react-number-format';
import Carousel from 'react-material-ui-carousel';
import { TextField, Button, Grid } from '@mui/material';
import { geocodeZipCode } from '../utils/getGeoLocation';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { FullscreenControl } from "react-leaflet-fullscreen";
import { ReactMaker } from './ReactMaker';
import Search from '/search.svg';
import _ from 'lodash';
import { filterPropertiesWithinRadius } from '../utils/distanceCalc';
import "react-leaflet-fullscreen/styles.css";
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();
const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
  root.render(<div className='marker-span'></div>);
});

const addMarker = (text: string) => {
  div.getElementsByClassName('marker-span')[0].innerHTML = `$${(parseFloat(text) / 1000).toFixed(0)}K`;
  return div.innerHTML;
};

const MapEventHandler = ({ onCenterChange, isProgrammaticMove, properties }: { onCenterChange: (lat: number, lng: number) => void, isProgrammaticMove: boolean, properties: any[] }) => {
  const map = useMap();

  useEffect(() => {
    const onMoveEnd = () => {
      const newCenter = map.getCenter();
      if (!isProgrammaticMove) {
        onCenterChange(newCenter.lat, newCenter.lng); // Only update on user-initiated move
      }
    };

    map.on('moveend', onMoveEnd);

    return () => {
      map.off('moveend', onMoveEnd);
    };
  }, [map, onCenterChange, isProgrammaticMove]);

  useEffect(() => {
    if (isProgrammaticMove && properties.length > 0) {
      // Collect all marker positions
      const bounds: LatLngBoundsExpression = properties.map(item => {
        const latLng = JSON.parse(item.position);
        return [latLng.latitude, latLng.longitude] as [number, number];
      });

      // Fit the map to the bounds of the markers
      map.fitBounds(bounds, { padding: [50, 50] });

      // Set a specific zoom level after fitting bounds (optional)
      map.setZoom(map.getZoom()); // Adjust as needed
    }
  }, [map, properties, isProgrammaticMove]);


  return null;
};

// Utility function to split photos into chunks of 3
const chunkArray = (array: string[], chunkSize: number) => {
  const results = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    results.push(array.slice(i, i + chunkSize));
  }
  return results;
};


const CustomPopup = (props: { property: any, index: React.Key | null | undefined; }) => {
  const property = props.property;
  const [imageChunks, setImageChunks] = useState(chunkArray(property.photos || [], 3));
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    // Handler to adjust chunks based on screen size
    const handleResize = () => {
      const chunkSize = window.innerWidth < 880 ? 1 : 3;
      setImageChunks(chunkArray(property.photos || [], chunkSize));
    };

    handleResize(); // Initialize chunks based on initial screen size
    window.addEventListener('resize', handleResize); // Adjust chunks on window resize

    return () => window.removeEventListener('resize', handleResize); // Cleanup on unmount
  }, [property.photos]);

  return (
    <Popup key={props.index} className='custom-popup' maxHeight={600} maxWidth={400} minWidth={400} keepInView={true}>
      <Carousel sx={{ width: '400px' }}>
        {imageChunks.map((chunk, index) => (
          <Grid container spacing={1} justifyContent="center" key={`carousel-slide-${index}`}>
            {chunk.length === 1 ? (
              // If only one image, place it in the center column
              <Grid item sm={12} key={0}>
                <Link to={`/property/${property.id}`} key={`link-main-${index}-0`}>
                  <StorageImage style={{ height: '120px' }} alt={chunk[0]} path={chunk[0]} />
                </Link>
              </Grid>
            ) : chunk.length === 2 ? (
              // If two images, place them in the center columns
              <>
                <Grid item xs={12} sm={6} key={0}>
                  <Link to={`/property/${property.id}`} key={`link-main-${index}-0`}>
                    <StorageImage style={{ height: '120px' }} alt={chunk[0]} path={chunk[0]} />
                  </Link>
                </Grid>
                <Grid item xs={12} sm={6} key={1}>
                  <Link to={`/property/${property.id}`} key={`link-main-${index}-1`}>
                    <StorageImage style={{ height: '120px' }} alt={chunk[1]} path={chunk[1]} />
                  </Link>
                </Grid>
              </>
            ) : (
              // If three images, display normally across three columns
              chunk.map((image, i) => (
                <Grid item xs={12} sm={4} key={i}>
                  <Link to={`/property/${property.id}`} key={`link-main-${index}-${i}`}>
                    <StorageImage style={{ height: '120px' }} alt={image} path={image} />
                  </Link>
                </Grid>
              ))
            )}
          </Grid>
        ))}
      </Carousel>
      <Link className="maker-main-link" to={`/property/${property.id}`}>
        <h3>
          <NumericFormat value={property?.price?.toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
        </h3>
        <p>{property.bedrooms} bds | {property.bathrooms} ba | <NumericFormat value={property?.squareFootage?.toFixed(0)} displayType={'text'} thousandSeparator={true} suffix={' sqft '} /> - {property?.description}</p>
      </Link>
      {user?.username === property.owner ? (
        <Link to={`/sales/${property.id}`}>
          Edit
        </Link>
      ) : (
        <Link to={`/offers/null/${property?.address}/${property.id}/${property.owner}`}>
          Make Offer
        </Link>
      )}
    </Popup>
  );
};

const MapWithItems: React.FC = () => {

  // Function to handle fetching markers in parent component
  const handleCenterChange = useCallback(
    _.debounce((lat: number, lng: number) => {
      console.log('New center:', lat, lng);
      setPosition([lat, lng]);
    }, 200), // 300ms delay
    []
  );

  const [zipCode, setZipCode] = useState<string | null>(() => {
    const savedZip = localStorage.getItem('zipCode');
    return savedZip ? JSON.parse(savedZip) : '';
  });

  const [loading, setLoading] = useState<boolean>(true);

  const defaultLocation: [number, number] = [38.76315823280579, -121.16611267496815];
  const [position, setPosition] = useState<[number, number]>(() => {
    const savedPosition = localStorage.getItem('searchPosition');
    if (savedPosition) {
      // Parse the JSON string
      const parsedPosition = JSON.parse(savedPosition);
      // Convert the parsed object to [latitude, longitude] array format
      const positionArray: [number, number] = [parsedPosition.latitude, parsedPosition.longitude];
      return positionArray;
    }
    return defaultLocation;
  });

  const [error, setError] = useState<string | null>(null);
  const [isProgrammaticMove, setIsProgrammaticMove] = useState(false);

  const [properties, setProperties] = useState<Array<any>>([]); // Adjust the type according to your schema

  useEffect(() => {
    if (isProgrammaticMove) {
      setIsProgrammaticMove(false); // Reset after programmatic move finishes
    }
  }, [position, isProgrammaticMove]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await client.models.Property.list({
          authMode: "identityPool"
        });
        if (position) {
          setLoading(false);
          const filteredProperties = filterPropertiesWithinRadius(data?.data, position, 200); // Filter within radius
          setProperties(filteredProperties);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Error message:', err.message);
        } else {
          console.error('Unknown error:', err);
        }
      }
    };

    fetchProperties();
  }, [position]);

  const handleSearchPositionChange = async () => {
    if (zipCode) {
      localStorage.setItem('zipCode', JSON.stringify(zipCode));
      const geoPosition = await geocodeZipCode(zipCode);
      if (geoPosition) {
        localStorage.setItem('searchPosition', JSON.stringify(geoPosition));
        setIsProgrammaticMove(true); // Indicate the next move is programmatic
        setPosition([geoPosition.latitude, geoPosition.longitude]); // Update the map center
      } else {
        alert('Invalid ZIP code. Please enter a valid ZIP code.');
      }
    } else {
      alert('Enter a ZIP code.');
    }
  };


  //Run once on initial render
  useEffect(() => {
    if (!position) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (geoPosition) => {
            const position: [number, number] = [geoPosition.coords.latitude, geoPosition.coords.longitude];
            setPosition(position);
          });
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    }
  }, []);

  if (error) {
    return <div className='list-items' style={{ width: '95vw' }}>Error: {error}</div>;
  }

  if (loading) {
    return <div className='list-items' style={{ width: '95vw' }}>Loading...</div>;
  }

  return (
    <div className='list-items' style={{ width: '95vw' }}>
      <div style={{ margin: '1em', position: 'relative', width: 'fit-content' }}>
        <TextField
          onBlur={handleSearchPositionChange}
          onKeyDown={(event) => {
            if (event.keyCode === 13) {
              handleSearchPositionChange();
            }
          }}
          label="State, County, City, Zip Code..."
          value={zipCode || ''}
          onChange={(e) => setZipCode(e.target.value)}
          sx={{ backgroundColor: 'white', width: '90vw', borderRadius: '1em' }}
        />
        <Button
          variant="contained"
          onClick={handleSearchPositionChange}
          style={{ width: '4em', height: '4em', top: '0em', right: '0em', position: 'absolute', zIndex: 900 }}>
          <img src={Search} style={{ width: '3em' }} />
        </Button>
      </div>

      <div style={{ height: '60vh', width: '90vw', margin: '1em 1em 1em 1em' }}>
        <MapContainer center={position} zoom={13} style={{ height: '60vh' }}>
          <section>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </section>
          {properties?.map((item) => (
            item?.position &&
            <Marker
              icon={divIcon({
                html: addMarker(item?.price.toFixed(0))
              })}
              key={`maker-${item.id}`}
              position={[JSON.parse(item?.position).latitude, JSON.parse(item?.position).longitude]}>
              <CustomPopup index={`popup-${item.id}`} property={item} />
            </Marker>
          ))}
          <FullscreenControl />
          <MapEventHandler onCenterChange={handleCenterChange} isProgrammaticMove={isProgrammaticMove} properties={properties} />
          {/* This will force the map to recenter when `position` changes */}
          <ReactMaker center={position} isProgrammaticMove={isProgrammaticMove} />
        </MapContainer>
        <ListItems properties={properties} />
      </div>
    </div >
  );
};

export default MapWithItems;
