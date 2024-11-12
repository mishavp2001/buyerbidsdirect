// src/components/Makeproperty.tsx
import React, { useEffect, useState } from 'react';
import { Container, Paper,  } from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { NumericFormat } from 'react-number-format';
import Carousel from 'react-material-ui-carousel';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import { useAuthenticator, Button } from '@aws-amplify/ui-react';
import  {NavigateNext, NavigateBefore} from '@mui/icons-material';
import  { Grid} from '@mui/material';
import Chat from '../components/Chat';
import { fetchUserAttributes } from 'aws-amplify/auth';

const client = generateClient<Schema>();


const PropertyPage: React.FC = () => {
  const { propertyId } = useParams();
  const [name, setName ] =  useState<string>('User');

  const [error, setError] = useState<string | null>(null);
  const [property, setProperties] = useState<Array<any>>([]); // Adjust the type according to your schema
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
        console.dir(items);
        setProperties(items);
      } else {
        setError(errors.toString)
        console.dir(errors);
      }
    }
    fetchPropertie();
  }, [propertyId]);


  return (
    <Container component="main">
      <Paper elevation={3} sx={{ padding: 6 }}>
        <Paper elevation={3} sx={{ padding: 2, width: '100%' }}>
          <Link to={'..'}>Go back</Link>
          {
            !error && property.length ?
              <Grid container spacing={1} display="flex">
                <Grid item xs={6} md={6}>
                <h1>
                    <NumericFormat value={property[0]?.price.toFixed(0)} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                  </h1>
                  <p>
                    {property[0]?.address}
                  </p>
                  <p>
                    {property[0].bedrooms} bds | {property[0].bathrooms} ba | {property[0].propertyType} |
                    Interior: <NumericFormat value={property[0].squareFootage.toFixed(0)} displayType={'text'} thousandSeparator={true} suffix={' sqft '}/>
                  </p>
                  <p>
                    Interior: <NumericFormat value={property[0].squareFootage.toFixed(0)} displayType={'text'} thousandSeparator={true} suffix={' sqft '}/>
                    Lot: <NumericFormat value={property[0].lotSize.toFixed(0)} displayType={'text'} thousandSeparator={true} suffix={' sqft '}/>
                  </p>
                  <p>
                  Year built: {property[0]?.yearBuilt}
                  </p>
                  <p>
                    {property[0]?.description}
                  </p>
                  
                  <p>
                    Contact: {property[0]?.ownerContact} | {property[0]?.listingOwner}
                  </p>

                  <p>
                    Ammenities: {property[0]?.ammenities}
                  </p>
                  <p>
                    Status: {property[0]?.listingStatus}
                  </p>
                </Grid>
            
                <Grid 
                  item xs={6} md={6}
                >
                  <Carousel
                    height={'450px'}
                    NextIcon={<NavigateNext/>}
                    PrevIcon={<NavigateBefore/>}
                  >
                  {property[0]?.photos?.length && property[0]?.photos?.map(
                    (image: string, i: number) => {
                      return <StorageImage
                                maxHeight={'450px'}
                                key={i} alt={image} path={image} />
                    })
                  }
                </Carousel>      
                </Grid>

                <Grid item xs={4} md={6}> 
                <div className="merge-col-field">
                {user?.username === property[0]?.owner ? (
                  <Button onClick={() => { navigate(`/sales/${property?.[0].id}`) }}>
                    Edit
                  </Button>
                ) : (
                  <Button variation="primary" onClick={() => { navigate(`/offers/null/${property?.[0].address}/${property?.[0].id}/${property?.[0].owner}`) }}>
                    Make Offer
                  </Button>
                )}
                </div>
                </Grid>
                <Grid item xs={12} md={12}> 
                <Chat name={name} address={property[0]?.address}  owner={property[0]?.owner}  info={JSON.stringify(property[0])} />
                </Grid>  
              </Grid>

              :
              <p>Loading ...</p>
          }
        </Paper>
      </Paper>
    </Container>

  );
};

export default PropertyPage;
