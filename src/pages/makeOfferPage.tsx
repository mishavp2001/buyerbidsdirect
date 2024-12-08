import { useParams, useNavigate } from 'react-router-dom';
import OfferCreateForm from "../ui-components/OfferCreateForm";
import OfferUpdateForm from "../ui-components/OfferUpdateForm"
import { Container } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import { useAuthenticator } from '@aws-amplify/ui-react';
import React, { useState, useEffect } from 'react';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import PropertyPage from './PropertyPage';
import PropertyTable from '../components/ListItems';

const client = generateClient<Schema>();

const MakeOffer: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthenticator((context) => [context.user]);

  const [error, setError] = useState<string | null>(null);
  const [offers, setOffers] = useState<Array<any>>([]); // Adjust the type according to your schema
  const [faivorites, setFaivorites] = useState<Array<any>>([]); // Adjust the type according to your schema
  const [open, setOpen] = React.useState<boolean>(false);

  const { offerId, address, propertyId, ownerId } = useParams();
  const [userAttr, setUserAttr] = useState<any>({});

  useEffect(() => {
    async function fetchUserProfiles() {
      try {
        const [buyerResponse, sellerResponse] = await Promise.all([
          client.models.UserProfile.list({
            filter: { id: { eq: user.userId } },
            authMode: "identityPool",
          }),
          client.models.UserProfile.list({
            filter: { id: { eq: ownerId } },
            authMode: "identityPool",
          }),
        ]);
    
        const buyer = buyerResponse?.data?.[0] || null;
        const seller = sellerResponse?.data?.[0] || null;
    
        if (!buyerResponse.errors && !sellerResponse.errors) {
          setUserAttr({ buyer, seller });
        } else {
          const errorMessages = [
            buyerResponse.errors?.toString(),
            sellerResponse.errors?.toString(),
          ]
            .filter(Boolean)
            .join(" | ");
          throw new Error(errorMessages || "Unknown error occurred");
        }
      } catch (error) {
        setError(error?.toString() || "An unexpected error occurred");
      }
    }
    fetchUserProfiles();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Define promises for parallel fetching
        const promises = [];
  
        // Fetch Favorites if `userAttr?.buyer` is available
        if (userAttr?.buyer?.favorites) {
          const favs = userAttr?.buyer?.favorites;
          if (!favs.length) {
            setFaivorites([]);
            return null;
          }

          const propertyFilter = {
            or: favs.map((id: any) => ({ id: { eq: id } })),
          };
          promises.push(
            client.models.Property
                  .list({
                    filter: propertyFilter,
                    authMode: "identityPool",
                  })
                  .then(({ data: properties }) => setFaivorites(properties || []))
          );
        }
        // Fetch Offers
          const offerFilter = {
            and: [
              { buyer: { contains: user?.userId } },
              ...(typeof offerId === "string" && offerId !== "null"  ? [{ id: { eq: offerId } }] : []),
            ],
          };
    
          promises.push(
            client.models.Offer
              .list({
                filter: offerFilter,
                authMode: "userPool",
              })
              .then(({ data: offers }) => setOffers(offers || []))
          );  
        
       
        // Wait for all promises to complete
        await Promise.all(promises);
  
        setOpen(
          (offerId === "null" || typeof offerId === "string")
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        setFaivorites([]);
        setOffers([]);
      }
    };
  
    if (userAttr?.buyer || user?.userId) {
      fetchData();
    }
  }, [userAttr, user?.userId, propertyId, offerId]);
  
  const handleRowClick = (params: {
    row: any; id: any;
  }) => {
    navigate(`/offers/${params.row.id}/${params.row.propertyAddress}`);

  }

  const columns: GridColDef[] = [
    { field: 'propertyAddress', headerName: 'Address', flex: 200 },
    { field: 'ownerName', headerName: 'Name', flex: 150 },
    { field: 'ownerEmail', headerName: 'Email', flex: 150 },
    { field: 'ownerPhone', headerName: 'Phone', flex: 150 },
    { field: 'offerAmmount', headerName: 'Offer', flex: 110, type: 'number' },
    { field: 'offerType', headerName: 'Type', flex: 80, type: 'string' },
  ];
  
  return (
    <Container component="main">
      <Paper elevation={3} sx={{ padding: 3, margin: 3 }}>
        <h3>Offers Sent</h3>
        <Paper elevation={3} sx={{ padding: 2, width: '100%' }}>
          <DataGrid
            autoHeight
            getRowId={(row) => row.propertyAddress|| 1}
            sx={{
              // disable cell selection style
              '.MuiDataGrid-cell:focus': {
                outline: 'none'
              },
              // pointer cursor on ALL rows
              '& .MuiDataGrid-row:hover': {
                cursor: 'pointer'
              }
            }}
            onRowClick={handleRowClick}
            rows={offers}
            columns={columns}
          />
        </Paper>
        <h3>Faivorites</h3>
        <PropertyTable properties={faivorites} />
      </Paper> 
      <Modal open={open} onClose={() => { navigate(-1); }}>
        <ModalDialog maxWidth='950px'>
          <ModalClose />
          <DialogTitle> Offer</DialogTitle>
          <div style={{ padding: 10, margin: 0, backgroundColor: 'var(--amplify-components-fieldcontrol-disabled-background-color)' }}>
            <p> {`Property address: ${address || "Unknown address"}`}</p>
            <p> {`To: ${userAttr?.seller?.email  || 'unknown'}`}</p>
            <p> {`${userAttr?.seller?.name + '(' + (userAttr?.seller?.phone_number || 'unknown') + ')'}`}</p>
          </div>
          <DialogContent>
            {error && <p>{error}</p>}
            <p style={{ 'display': 'none' }}>{user.userId} - {ownerId}</p>
            {offerId === null && typeof propertyId === 'string' &&
                <PropertyPage id={propertyId}/>
            }
            {typeof offerId === 'string' && offerId === 'null' ?
              <OfferCreateForm
                overrides={
                  {
                    buyer: { value: user?.userId },
                    propertyId: { value: propertyId },
                    propertyAddress: { value: address },
                    ownerName: { value: userAttr?.seller?.name || 'Unknown' },
                    ownerEmail: { value:  userAttr?.seller?.email || 'Unknown'},
                    ownerPhone: { value: userAttr?.seller?.phone_number || 'Unknown' },
                    buyerEmail: { value: userAttr?.buyer?.email },
                    buyerName: { value: userAttr?.buyer?.name },
                    buyerPhone: { value: userAttr?.buyer?.phone_number },
                    seller: { value: ownerId }
                  }
                }
                onSuccess={() => { navigate("/offers", { replace: true }); }}
              />
              :
              <OfferUpdateForm id={offerId} onSuccess={() => { navigate("/offers", { replace: true }); }} />
            }
          </DialogContent>
        </ModalDialog>
      </Modal>
    </Container>
  );
};

export default MakeOffer;
