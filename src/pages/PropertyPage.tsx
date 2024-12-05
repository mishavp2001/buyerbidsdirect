// src/components/Makeproperty.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { NumericFormat } from 'react-number-format';
import Carousel from 'react-material-ui-carousel';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import { useAuthenticator, Button } from '@aws-amplify/ui-react';
import { ArrowBack } from '@mui/icons-material';
import { Grid, Paper } from '@mui/material';
import Chat from '../components/Chat';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { Modal } from '@mui/material';
import ModalDialog from '@mui/joy/ModalDialog';

const client = generateClient<Schema>();


const PropertyPage: React.FC = () => {
  const { propertyId } = useParams();
  const [name, setName] = useState<string>('User');

  const [error, setError] = useState<string | null>(null);
  const [property, setProperties] = useState<any>(); // Adjust the type according to your schema
  const { user } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();

  // Fetch user attributes when the component mounts
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const userAttributes = await fetchUserAttributes();
        const userName = userAttributes?.name ?? 'Guest';
        setName(userName);
      } catch (err) {
        console.error('Error fetching user attributes:', err);
      }
    };

    fetchAttributes();
  }, []);


  useEffect(() => {
    async function fetchPropertie() {
      const filter = {
        id: { eq: propertyId }
      };
      const { data: items, errors } = await client.models.Property.list({
        filter,
        authMode: "identityPool"
      })
      if (!errors) {
        //console.dir(items);
        setProperties(items?.[0]);
      } else {
        setError(errors.toString)
        //console.dir(errors);
      }
    }
    fetchPropertie();
  }, [propertyId]);

  const handleClose = () => {
    navigate(-1); // Go back to the previous route
  };

  return (
    <Modal open onClose={handleClose}>
      <ModalDialog minWidth='80%' >
        {
          !error && property?.id ?
            <Grid
              container
              spacing={2}
              overflow='scroll'
              display="flex">
              <Grid item
                xs={12}
                md={12}>
                <Button
                  width='12px'
                  style={{ position: 'absolute', top: 30, left: 30, backgroundColor: 'white', zIndex: '11111' }}
                  onClick={() => navigate(-1)}>
                  <ArrowBack />
                </Button>
                <Carousel
                  navButtonsAlwaysVisible={true}
                  height={550}
                  autoPlay={false}
                >
                  {property?.photos?.map((image: string, i: number) => (
                    <StorageImage
                      key={i}
                      alt={image}
                      path={image} />
                  ))}
                </Carousel>
              </Grid>
              <Grid item xs={12} md={12}>
                {user?.username === property?.owner ? (
                  <Button onClick={() => { navigate(`/sales/${property?.id}`) }}>
                    Edit
                  </Button>
                ) : (
                  <Button variation="primary" onClick={() => { navigate(`/offers/null/${property?.address}/${property?.id}/${property?.owner}`) }}>
                    Make Offer
                  </Button>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{ padding: '20px' }}
                  elevation={3} >
                  <h1>
                    <NumericFormat value={property?.price.toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                  </h1>
                  <p>
                    {property?.address}
                  </p>
                  <p>
                    {property.bedrooms} bds | {property.bathrooms} ba | {property.propertyType} |
                    Interior: <NumericFormat value={property.squareFootage.toFixed(0)} displayType={'text'} thousandSeparator={true} suffix={' sqft '} />
                  </p>
                  <p>
                    Interior: <NumericFormat value={property.squareFootage.toFixed(0)} displayType={'text'} thousandSeparator={true} suffix={' sqft '} />
                    Lot: <NumericFormat value={property.lotSize.toFixed(0)} displayType={'text'} thousandSeparator={true} suffix={' sqft '} />
                  </p>
                  <p>
                    Year built: {property?.yearBuilt}
                  </p>
                  <p>
                    {property?.description}
                  </p>

                  <p>
                    Contact: {property?.ownerContact} | {property?.listingOwner}
                  </p>

                  <p>
                    Ammenities: {property?.ammenities}
                  </p>
                  <p>
                    Status: {property?.listingStatus}
                  </p>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Chat name={name} address={property?.address} owner={property?.owner} info={JSON.stringify(property)} />
              </Grid>
            </Grid>
            :
            <p>Loading ...</p>
        }
      </ModalDialog>
    </Modal>
  );
};

export default PropertyPage;
