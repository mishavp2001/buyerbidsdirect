import { useParams, useNavigate } from 'react-router-dom';
import OfferCreateForm from "../ui-components/OfferCreateForm";
import OfferUpdateForm from "../ui-components/OfferUpdateForm"
import { Container, Typography } from '@mui/material';
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
import MapWithItems from '../components/MapWithItems';

const client = generateClient<Schema>();

const MakeOffer: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthenticator((context) => [context.user]);

  const [error, setError] = useState<string | null>(null);
  const [offers, setOffers] = useState<Array<any>>([]); // Adjust the type according to your schema
  const [open, setOpen] = React.useState<boolean>(false);

  const { offerId, address, propertyId, ownerId } = useParams();
  useEffect(() => {
    const filter = {
      and: [
        { buyer: { contains: user.userId } },
        ...(typeof offerId === 'string' ? [{ id: { eq: offerId } }] : [])
      ]
    };

    const subscription = client.models.Offer.observeQuery({
      filter,
      authMode: "userPool"
    }).subscribe({
      next: (data) => setOffers(data.items),
      error: (err) => {
        console.dir(err)
        ; setError(err.message)
      },
    });
    if (offerId === 'null' || typeof (offerId) === 'string') {
      setOpen(true);
    } else {
      setOpen(false);
    }
    // Cleanup the subscription on unmount
    return () => subscription.unsubscribe();
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
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography component="h1" variant="h5">My Buy Offers:</Typography>
        <Paper elevation={3} sx={{ padding: 2, height: 400, width: '100%' }}>
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
        <MapWithItems offers={offers} width='70vw' mapOnly/> 
      </Paper>
      <Modal open={open} onClose={() => { navigate(-1); }}>
        <ModalDialog minWidth='90%'>
          <ModalClose />
          <DialogTitle> {offerId ? `Offer for: ${address || "No address"} from ${user.signInDetails?.loginId}` : 'New offer'}</DialogTitle>
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
