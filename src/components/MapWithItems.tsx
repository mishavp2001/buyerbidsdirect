import React, { useState, useEffect } from 'react';
import ListItems from './ListItems';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Link } from 'react-router-dom';
import { APIProvider, Map, AdvancedMarker, useAdvancedMarkerRef, InfoWindow } from '@vis.gl/react-google-maps';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import { NumericFormat } from 'react-number-format';


const client = generateClient<Schema>();


const MapWithItems: React.FC = () => {
  const [itemsForSale, setItemsForSale] = useState<any[]>([]);
  const [position, setPosition] = useState<{ lat: number, lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState<boolean>(true); // State to toggle map view
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
            const userPosition = { lat: geoPosition.coords.latitude, lng: geoPosition.coords.longitude };
            setPosition(userPosition);
          })
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    }

    setItemsForSale(properties);

  },[properties]);



  const toggleView = () => {
    setShowMap(!showMap);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!properties) {
    return <div>Loading...</div>;
  }
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <div className='list-items'>
      <button onClick={toggleView}>
        {showMap ? 'Show List' : 'Show Map'}
      </button>
      {showMap && position ? (


        <APIProvider apiKey={'AIzaSyC1m92_wrOPapYEQu2JYP919wNartB3kDA'}>
          <Map
            style={{ width: "100vw", height: "100vh" }}
            defaultZoom={14}
            mapId={'cc9ee0ccda8ba6ba'}
            defaultCenter={position}>
            {
              itemsForSale.map((item, index )=> {
                const lat = JSON.parse(item?.position).latitude;
                const lng = JSON.parse(item?.position).longitude;
                console.log(item?.description,lat, lng);
                return (  
                <>
                <AdvancedMarker
                  key={index}
                  position={{ 'lat': lat, 'lng': lng }}
                  title={item?.description}
                  ref={markerRef}
                  onClick={() => setInfowindowOpen(true)}
                >
                  {infowindowOpen && (
                    <InfoWindow
                      anchor={marker}
                      maxWidth={200}
                      onCloseClick={() => setInfowindowOpen(false)}>
                      <p>{item?.position}</p>
                      <div>
                        <p>{item?.description}</p>
                        <strong>Price: </strong>
                        <NumericFormat value={item?.price.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                        <br />
                        <strong>Square Footage: </strong>
                        <NumericFormat value={item.squareFootage.toFixed(0)} displayType={'text'} thousandSeparator={true} suffix={'sqft'} />


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
                    </InfoWindow>)}
                </AdvancedMarker>
                </>
              )})}
          </Map>
        </APIProvider>

      ) : (
        <ListItems properties={properties} />
      )}
    </div>
  );
};

export default MapWithItems;
