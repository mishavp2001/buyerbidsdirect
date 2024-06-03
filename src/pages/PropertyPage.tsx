// src/components/Makeproperty.tsx
import React, { useEffect, useState } from 'react';
import { Container, Paper } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { NumericFormat } from 'react-number-format';
import Carousel from 'react-material-ui-carousel';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import { useAuthenticator } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();


const PropertyPage: React.FC = () => {
  const { propertyId } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [property, setProperties] = useState<Array<any>>([]); // Adjust the type according to your schema
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    const filter = {
      id: { contains: propertyId }
    };
    const subscription = client.models.Property.observeQuery({
      filter,
      authMode: "identityPool"
    }).subscribe({
      next: (data) => setProperties(data.items),
      error: (err) => setError(err.message),
    });

    // Cleanup the subscription on unmount
    return () => subscription.unsubscribe();
  }, [propertyId]);


  return (
    <Container component="main">
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Paper elevation={3} sx={{ padding: 2, height: '100vh', width: '100%' }}>
          {
            !error && property.length ?
              <>
                <Link to={'..'}>Go back</Link>
                <h1>
                  <NumericFormat value={property[0]?.price.toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                </h1>

                <span>{property[0].description}</span>
                <p>{property[0].bedrooms} bds | {property[0].bathrooms} ba | <NumericFormat value={property[0].squareFootage.toFixed(0)} displayType={'text'} thousandSeparator={true} suffix={' sqft '} />
                  - {property[0]?.description}</p>
                  <Carousel height={'50vh'}>
                      {property[0]?.photos?.length && property[0]?.photos?.map(
                        (image: string, i: number) => {
                          return <StorageImage key={i} alt={image} style={{ float: 'left' }} path={image} />
                        })
                      }
                    </Carousel> 
                    {user?.username === property[0]?.owner ? (
                        <Link to={`/sales/${property?.[0].id}`}>
                          Edit
                        </Link>
                      ) : (
                        <Link to={`/offers/null/${property?.[0].address}/${property?.[0].id}/${property?.[0].owner}`}>
                          Make Offer
                        </Link>
                      )}
              </>
              :
              <span>Loading ...</span>
          }
        </Paper>
      </Paper>
    </Container>

  );
};

export default PropertyPage;
