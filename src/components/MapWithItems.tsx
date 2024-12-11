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
import { TextField, Button, Grid, MenuItem, Select, SelectChangeEvent, FormControl, Paper } from '@mui/material';
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
import TuneSharpIcon from '@mui/icons-material/TuneSharp';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { LikeButton } from './LikeButton';
import { useUserProfile } from './Auth/UserProfileContext';

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

const MapEventHandler = ({ onCenterChange, isProgrammaticMove, properties, zoom }: { onCenterChange: (lat: number, lng: number) => void, isProgrammaticMove: boolean, properties: any[], zoom: number }) => {
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
  }, [map, onCenterChange, isProgrammaticMove, zoom]);

  useEffect(() => {
    if (isProgrammaticMove && properties.length > 0) {
      // Collect all marker positions
      const bounds: LatLngBoundsExpression = properties.map(item => {
        const latLng = JSON.parse(item.position);
        return [latLng.latitude, latLng.longitude] as [number, number];
      });

      // Fit the map to the bounds of the markers
      map.fitBounds(bounds, { padding: [100, 100] });

      // Set a specific zoom level after fitting bounds (optional)
      map.setZoom(zoom); // Adjust as needed
    }
  }, [map, properties, zoom, isProgrammaticMove]);


  return null;
};

const CustomPopup = (props: { property: any, favorites: string[], user: any, index: React.Key | null | undefined; }) => {
  const property = props.property;
  const favorites = props.favorites;
  const user = props.user;

  return (
    <Popup
      key={props.index}
      className='custom-popup'
      maxWidth={450}
      keepInView={true}
    >

      <Carousel
        navButtonsAlwaysVisible={true}
        sx={{ maxWidth: '450px' }}
        height={250}
        autoPlay={false}
        navButtonsWrapperProps={{   // Move the buttons to the bottom. Unsetting top here to override default style.
          style: {
            bottom: '0',
            top: 'unset'
          }
        }}
      >
        {property.photos.map((item: string, index: any) => (
          <Grid
            container spacing={1}
            justifyContent="center"
            key={`carousel-slide-${index}`}
            style={{ display: 'flex', flexDirection: 'column', alignContent: 'center', height: '350px' }}
          >
            <Grid item sm={12} key={0}>
              <Link
                to={`/property/${property.id}`}
                state={{ isModal: true, backgroundLocation: '/2' }}
                key={`link-main-${index}-0`}>
                <StorageImage width='100%' objectFit='cover' height='250px' alt={item} path={`compressed/${item}`} />
              </Link>
            </Grid>
          </Grid>
        ))}
      </Carousel>
      <Link className="maker-main-link" to={`/property/${property.id}`}>
        <h3>
          <NumericFormat value={property?.price?.toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
        </h3>
        <p>{property.bedrooms} bds | {property.bathrooms} ba | <NumericFormat value={property?.squareFootage?.toFixed(0)} displayType={'text'} thousandSeparator={true} suffix={' sqft '} /> - {property?.description}</p>
        <p>{property.address}</p>
      </Link>

      {user?.username === property.owner ? (
        <Button
          variant="contained"
          color="primary"
          component={Link}
          state={{ isModal: true, backgroundLocation: '/2' }}
          to={`/sales/${property.id}`}>
          Edit
        </Button>
      ) : (
        <Button
          variant="contained"
          color="primary"
          component={Link}
          state={{ isModal: true, backgroundLocation: '/2' }}
          to={`/offers/null/${property?.address}/${property.id}/${property.owner}`}>
          Offer
        </Button>

      )}
      <span
        style={{ color: 'black', cursor: 'pointer', paddingLeft: 32, fontSize: '18px' }}
      >
        <LikeButton
          propertyId={property.id} user={user} favorites={favorites} property={property} />

        {`Likes: ${property?.likes || 0}`}
        </span>
    </Popup>
  );
};

const MapWithItems: React.FC<any> = ({ offers, mapOnly, width, header }) => {

  // Function to handle fetching markers in parent component
  const handleCenterChange = useCallback(
    _.debounce((lat: number, lng: number) => {
      console.log('New center:', lat, lng);
      setPosition([lat, lng]);
    }, 200), // 300ms delay
    []
  );
  const { user } = useAuthenticator((context) => [context.user]);
  const { profile } = useUserProfile();


  const [zipCode, setZipCode] = useState<string | null>(() => {
    const savedZip = localStorage.getItem('zipCode');
    return savedZip ? JSON.parse(savedZip) : '';
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [maxPrice, setMaxPrice] = useState<number>();
  const [minPrice, setMinPrice] = useState<number>();

  const defaultLocation: [number, number] = [38.76315823280579, -121.16611267496815];
  const zoom = 10;
  const radius = 400;
  const [showFilter, setShowFilter] = useState<boolean>(false);

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
  const ptypes = [
    'House',
    'Condo',
    'Land',
    'Multi-family',
    'Manufactured'
  ];
  const [propertyType, setPropertyType] = React.useState<string[]>([]);
  const handlePtypeChange = (event: SelectChangeEvent<typeof propertyType>) => {
    const {
      target: { value },
    } = event;
    setPropertyType(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const ITEM_HEIGHT = 68;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        minWidth: 350,
      },
    },
  };

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
          const filteredProperties = filterPropertiesWithinRadius(data?.data, position, radius, maxPrice, minPrice, propertyType); // Filter within radius
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
  }, [position, minPrice, maxPrice, propertyType, profile]);

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
    <div className='list-items'>
      <h3>{header}</h3>
      <div style={{ margin: '1em', position: 'relative' }}>
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
          sx={{ backgroundColor: 'white', minWidth: '20vw', borderRadius: '1em' }}
        />
        {showFilter && <span>
          <NumericFormat
            label="Min Price"
            customInput={TextField}
            prefix="$"
            thousandSeparator
            allowNegative={false}
            color='primary'
            className='search-filter'
            value={minPrice}
            style={{ backgroundColor: 'white', borderRadius: '1em', minWidth: 200 }}
            onBlur={(evt) => { setMinPrice(parseFloat(evt.target.value.slice(1).replace(/,/g, ""))) }}
          />
          <NumericFormat
            label="Max Price"
            customInput={TextField}
            prefix="$"
            thousandSeparator
            allowNegative={false}
            color='primary'
            className='search-filter'
            value={maxPrice}
            style={{ backgroundColor: 'white', borderRadius: '1em', minWidth: 200 }}
            onBlur={(evt) => { setMaxPrice(parseFloat(evt.target.value.slice(1).replace(/,/g, ""))) }}
          />
          <FormControl
            style={{ backgroundColor: 'white', borderRadius: '1em', minWidth: 200 }}
            variant="outlined">
            <InputLabel>Home Type</InputLabel>
            <Select
              multiple
              value={propertyType}
              onChange={handlePtypeChange}
              input={<OutlinedInput label="Home Type" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {ptypes.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={propertyType.includes(name)} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}

            </Select>
          </FormControl>
        </span>}
        <Button
          variant="contained"
          style={{ width: '4em', height: '4em' }}
          onClick={() => { setShowFilter(!showFilter) }}
        >
          <TuneSharpIcon />
        </Button>
        <Button
          variant="contained"
          onClick={handleSearchPositionChange}
          style={{ width: '4em', height: '4em' }}>
          <img src={Search} style={{ width: '3em' }} />
        </Button>
      </div>
      <div style={{ width: `${width || '98vw'}`, marginTop: '35px', padding: '1em' }}>
        <Paper
          elevation={3}
          sx={{ height: "99vh", width: 'auto', padding: '1em' }}
        >
          <Grid
            container spacing={2}
            justifyContent="center"
            style={{ display: 'flex', flexDirection: 'row' }}
          >
            <Grid item xs={12} sm={12} md={!mapOnly ? 6 : 12} height='90vh' key={0}>
              <MapContainer
                center={position}
                zoom={zoom}
                style={{ width: `${width}`, height: "90vh" }}
              >
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
                    <CustomPopup index={`popup-${item.id}`} property={item} user={user} favorites={profile?.favorites || []} />
                  </Marker>
                ))}
                {offers?.map((item: { position: string; price: number; id: any; }) => (
                  item?.position &&
                  <Marker
                    icon={divIcon({
                      html: addMarker(item?.price.toFixed(0))
                    })}
                    key={`maker-${item.id}`}
                    position={[JSON.parse(item?.position).latitude, JSON.parse(item?.position).longitude]}>
                    <CustomPopup index={`popup-${item.id}`} property={item} user={user} favorites={profile?.favorites || []} />
                  </Marker>
                ))}
                <FullscreenControl />
                <MapEventHandler onCenterChange={handleCenterChange} isProgrammaticMove={isProgrammaticMove} properties={properties} zoom={zoom} />
                {/* This will force the map to recenter when `position` changes */}
                <ReactMaker center={position} isProgrammaticMove={isProgrammaticMove} />
              </MapContainer>
            </Grid>
            {!mapOnly &&
              <Grid item xs={12} sm={12} md={6} key={1}>
                <ListItems
                  properties={properties}
                />
              </Grid>
            }
          </Grid>
        </Paper>
      </div>
    </div >
  );
};

export default MapWithItems;
