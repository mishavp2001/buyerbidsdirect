import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Button } from '@mui/material';
import PropertyCreateForm from '../ui-components/PropertyCreateForm';
import PropertyUpdateForm from '../ui-components/PropertyUpdateForm';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import { Link as RouterLink } from 'react-router-dom';
import { useUserProfile } from '../components/Auth/UserProfileContext';
import DisplayOffers from '../components/displayOffers'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import Carousel from 'react-material-ui-carousel';

const client = generateClient<Schema>();
const SellProperty: React.FC = () => {
  const { propertyId } = useParams();
  const { profile } = useUserProfile();

  const navigate = useNavigate();
  const { user } = useAuthenticator((context) => [context.user]);
  const [error, setError] = useState<string | null>(null);
  const [offers, setOffers] = useState<Array<any>>([]); // Adjust the type according to your schema
  const [properties, setProperties] = useState<Array<any>>([]); // Adjust the type according to your schema
  const [open, setOpen] = React.useState<boolean>(false);

  useEffect(() => {
    async function fetchProperties() {

      try {
        // Define promises for parallel fetching
        const promises = [];

        const filter =
          typeof propertyId === 'string' && propertyId !== 'new'
            ? { id: { eq: propertyId } }
            : { owner: { contains: user.userId } };

        promises.push(
          await client.models.Property.list({
            filter,
            authMode: 'userPool',
          }).then(({ data: items }) => setProperties(items)
          ))


        const offersFilter = { seller: { contains: user.userId } };
        promises.push(
          await client.models.Offer.list({
            filter: offersFilter,
            authMode: 'userPool',
          }).then(({ data: offers }) => {

            // Grouping offers by propertyID
            const groupedOffers = offers.reduce((acc: any, offer: any) => {
              const key = String(offer.propertyId);
              if (!acc[key]) {
                acc[key] = [];
              }
              acc[key].push(offer);
              return acc;
            }, {});
            setOffers(groupedOffers);
          }
          ))

        // Wait for all promises to complete
        await Promise.all(promises);


      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.toString());
        setProperties([]);
      }
    }

    fetchProperties();
  }, [user.userId, propertyId]); // Dependencies for fetching properties

  useEffect(() => setOpen(profile?.name !== '' && typeof propertyId === 'string'), [propertyId, profile?.name]); // Dependency for controlling `setOpen`

  return (
    <Container component="main">
      {!open && <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography component="h1" variant="h5">Your Properties
          <Button variant="contained" style={{ float: 'right' }} component={RouterLink} to={`/sales/new`}>
            Add new
          </Button>
        </Typography>
        <Paper elevation={3} sx={{ marginTop: '15px', padding: '15px 10px', width: '100%' }}>
          {
            properties.map((property: any, index: number) => {
              return <Accordion defaultExpanded={index === 0}  >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id={`'${index}'`}
                >
                  <p style={{ backgroundColor: 'lightgrey', padding: '20px', }}>
                    {property?.address + ` (${offers?.[property?.id]?.length || 0})`}
                    {`Price:  $${property?.price} | bd: ${property?.bedrooms}| bth: ${property?.bathrooms} `}
                  </p>
                </AccordionSummary>
                <AccordionDetails>
                  {property?.photos.length !== 0 && <Carousel
                    height={300}
                    sx={{width: 350}}
                    navButtonsAlwaysVisible={true}
                    autoPlay={false}
                  >
                    {property?.photos?.map((image: string, i: number) => (
                      <StorageImage
                        width={250}
                        key={i}
                        alt={image}
                        path={`compressed/${image}`} />
                    ))}
                  </Carousel>}
                  <DisplayOffers gOffers={Object.values(offers[property?.id] || [])} />
                  <Button variant="contained" component={RouterLink} to={`/sales/${property?.id}`} >
                    Edit
                  </Button>
                </AccordionDetails>
              </Accordion>
            })}

        </Paper>
      </Paper>}

      <Modal open={open} onClose={() => { navigate(-1); }}>
        <ModalDialog minWidth='350px' >
          <DialogTitle>Edit property details</DialogTitle>
          <DialogContent>
            <ModalClose />
            {error && <p>{error}</p>}
            {
              propertyId?.indexOf('new') === -1 ?
                <>
                  <PropertyUpdateForm
                    id={propertyId}
                    overrides={
                      {
                        listingOwner: { value: profile?.name, isReadOnly: true },
                        ownerContact: { value: profile?.email, isReadOnly: true },
                      }}
                    onSuccess={() => { navigate("/sales", { replace: true }); }} />
                </>
                :
                <>
                  <PropertyCreateForm
                    onSuccess={() => { navigate("/sales", { replace: true }); }}
                    overrides={
                      {
                        listingOwner: { value: profile?.name, isReadOnly: true },
                        ownerContact: { value: profile?.email, isReadOnly: true },
                      }
                    }
                  />
                </>
            }
          </DialogContent>
        </ModalDialog>
      </Modal>
    </Container>
  );
};

export default SellProperty;
