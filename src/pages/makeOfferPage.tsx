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

const client = generateClient<Schema>();

const MakeOffer: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthenticator((context) => [context.user]);

  const [error, setError] = useState<string | null>(null);
  const [offers, setOffers] = useState<Array<any>>([]); // Adjust the type according to your schema
  const [open, setOpen] = React.useState<boolean>(false);

  const { offerId, address, propertyId, ownerId } = useParams();
  const [userAttr, setUserAttr] = useState<any>({});

  useEffect(() => {
    async function fetchUserProfiles() {
      //const filter = userId  ? { id: { eq: userId } } : null;
      const { data: itemsBuyer, errors: errorsB } = await client.models.UserProfile.list({
        filter: { id: { eq: user.userId } }, // Proper conditional for filter
        authMode: "identityPool"
      })
      const { data: itemsSeller, errors: errorsS } = await client.models.UserProfile.list({
        filter: { id: { eq: ownerId } }, // Proper conditional for filter
        authMode: "identityPool"
      })
      if (!errorsS && !errorsB) {
        //console.dir(items);
        //const filteredItems = items.filter(item => item !== null);
        setUserAttr({ buyer: itemsBuyer?.[0], seller: itemsSeller?.[0] });

      } else {
        const error = (errorsS ? errorsS.toString() : '' + errorsB ? errorsB?.toString() : '') || 'Unknown';
        setError(error);
        //console.dir(errors);
      }
    }
    fetchUserProfiles();
  }, []);

  useEffect(() => {
    const getOffers = async () => {
      const filter = {
        and: [
          { buyer: { contains: user.userId } },
          ...(typeof offerId === 'string' ? [{ id: { eq: offerId } }] : [])
        ]
      };
      try {
        const { data: offers } = await client.models.UserProfile.list({
          filter,
          authMode: "userPool"
        })
        setOffers(offers)
      }
      catch (error) {
        console.error("Error getting opffers:", error);
        setOffers([]); // Fallback to false on error
      };
      if (offerId === 'null' || typeof (offerId) === 'string') {
        setOpen(true);
      } else {
        setOpen(false);
      }
    }
    getOffers();
  }, [offerId]);


  const handleRowClick = (params: {
    row: any; id: any;
  }) => {
    navigate(`/offers/${params.row.id}/${params.row.propertyAddress}`);

  }

  const columns: GridColDef[] = [
    { field: 'propertyAddress', headerName: 'Address', flex: 200 },
    { field: 'buyerPhone', headerName: 'Buyer Phone', flex: 150 },
    { field: 'buyerEmail', headerName: 'Buyer Email', flex: 150 },
    { field: 'offerAmmount', headerName: 'Offer Ammount', flex: 110, type: 'number' },
    { field: 'conditions', headerName: 'Conditions', flex: 90, type: 'string' },
    { field: 'offerType', headerName: 'Type', flex: 80, type: 'string' },
    { field: 'appointment', headerName: 'Apointment', flex: 80, type: 'date', valueFormatter: (value) => new Date(value).toLocaleString() }
  ];
  return (
    <Container component="main">
      <Paper elevation={3} sx={{ padding: 3, margin: 3 }}>
        <h3>Offer Sent</h3>
        <Paper elevation={3} sx={{ padding: 2, height: 500, width: '100%' }}>
          <DataGrid
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
        <h3>Property Saved</h3>
        <Paper elevation={3} sx={{ padding: 2, height: 500, width: '100%' }}>
          <DataGrid
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
      </Paper>
      <Modal open={open} onClose={() => { navigate(-1); }}>
        <ModalDialog maxWidth='950px'>
          <ModalClose />
          <DialogTitle> Offer</DialogTitle>
          <div style={{ padding: 10, margin: 0, backgroundColor: 'var(--amplify-components-fieldcontrol-disabled-background-color)' }}>
            <p> {`Property address: ${address || "Unknown address"}`}</p>
            <p> {`To: ${userAttr?.seller?.name + '(' + userAttr?.seller?.email + ')' || 'unknown'}`}</p>
          </div>
          <DialogContent>
            {error && <p>{error}</p>}
            <p style={{ 'display': 'none' }}>{user.userId} - {ownerId}</p>

            {offerId === 'null' ?
              <OfferCreateForm
                overrides={
                  {
                    buyer: { value: user?.userId },
                    propertyId: { value: propertyId },
                    propertyAddress: { value: address },
                    ownerName: { value: ownerId },
                    ownerEmail: { value: address },
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
