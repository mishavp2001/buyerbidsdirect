import { useParams, useNavigate } from 'react-router-dom';
import OfferCreateForm from "../../ui-components/OfferCreateForm";
import OfferUpdateForm from "../../ui-components/OfferUpdateForm"
import { Container, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import {Paper, Link } from '@mui/material';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import { Link as RouterLink } from 'react-router-dom';
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
  useEffect(() => {
    const filter = {
      and: [
        { buyer: { contains: user.userId } },
        ...(typeof offerId === 'string' ? [{ id: { contains: offerId } }] : [])
      ]
    };
  
    const subscription = client.models.Offer.observeQuery({
      filter,
      authMode: "userPool"
    }).subscribe({
      next: (data) => setOffers(data.items),
      error: (err) => setError(err.message),
    });
  
    // Cleanup the subscription on unmount
    return () => subscription.unsubscribe();
  }, [offerId]);
  


  useEffect(() => {
    if (offerId === 'null' || typeof (offerId) === 'string') {
      setOpen(true);
    } else {
      setOpen(false);
    }

  }, [offerId]);



  const columns: GridColDef[] = [
    { field: 'propertyAddress', headerName: 'Address', width: 300 },
    { field: 'phone', headerName: 'Phone', width: 150 },
    { field: 'email', headerName: 'Email', width: 150 },
    { field: 'offerAmmount', headerName: 'Price', width: 110, type: 'number' },
    { field: 'conditions', headerName: 'Conditions', width: 110, type: 'string' },
    { field: 'offerType', headerName: 'Type', width: 100, type: 'string' },
    { field: 'appointment', headerName: 'Apointment', width: 80, type: 'date', valueFormatter: (value) => new Date(value).toLocaleString() },
    {
      field: 'action',
      headerName: 'Action',
      width: 60,
      renderCell: (params: GridRenderCellParams) => <Link component={RouterLink} to={`/offers/${params.row.id}/${params.row.propertyAddress}`}>
        Edit
      </Link>,
    },
  ];
  return (
    <Container component="main">
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography component="h1" variant="h5">Offers:</Typography>
        <Paper elevation={3} sx={{ padding: 2, height: 400, width: '100%' }}>
          <DataGrid
            rows={offers}
            columns={columns}
          />
        </Paper>
      </Paper>
      <Modal open={open} onClose={() => { navigate("/offers", { replace: true }); }}>
        <ModalDialog >
          <DialogTitle> {offerId ? `Offer for:" ${address || ""} from ${user.signInDetails?.loginId}` : 'New offer'}</DialogTitle>
          <DialogContent>
            {error && <p>{error}</p>}
            <p>{user.userId} - {ownerId}</p>

            {offerId === 'null' ?
              <OfferCreateForm
                overrides={
                  {
                    buyer: { value: user?.userId },
                    propertyId: { value: propertyId },
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
