import { useParams, useNavigate } from 'react-router-dom';
import OfferCreateForm from "../../ui-components/OfferCreateForm";
import OfferUpdateForm from "../../ui-components/OfferUpdateForm"
import { Container, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Paper, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import React, { useState, useEffect } from 'react';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";


const client = generateClient<Schema>();


const MakeOffer: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [offers, setOffers] = useState<Array<any>>([]); // Adjust the type according to your schema

  useEffect(() => {
    const subscription = client.models.Offer.observeQuery(
      { authMode: "userPool" }
    ).subscribe({
      next: (data) => setOffers(data.items),
      error: (err) => setError(err.message),
    });

    // Cleanup the subscription on unmount
    return () => subscription.unsubscribe();
  }, []);


  const { offerId, address, propertyId, ownerId } = useParams();
  const { user } = useAuthenticator((context) => [context.user]);

  const columns: GridColDef[] = [
    { field: 'propertyAddress', headerName: 'Address', width: 200 },
    { field: 'phone', headerName: 'Phone', width: 200 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'offerAmmount', headerName: 'Price', width: 150, type: 'number' },
    { field: 'conditions', headerName: 'Conditions', width: 120, type: 'string' },
    { field: 'offerType', headerName: 'Type', width: 120, type: 'string' },
    { field: 'appointment', headerName: 'Apointment', width: 150, type: 'date', valueFormatter: (value) => new Date(value).toLocaleString() },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params: GridRenderCellParams) => <Link component={RouterLink} to={`/offers/${params.row.id}`}>
        Edit
      </Link>,
    },
  ];
  return (
    <Container component="main" maxWidth="sm">

      <Paper elevation={3} sx={{ padding: 3 }}>
        {error && <p>{error}</p>}
        <p>{user.userId} - {ownerId}</p>
        <Typography component="h1" variant="h6">Offer for: <span> {address} <br />from {user.signInDetails?.loginId}</span></Typography>
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
          <OfferUpdateForm id={offerId} />
        }
      </Paper>

      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography component="h1" variant="h5">Submited Offers:</Typography>

        <Paper elevation={3} sx={{ padding: 2, height: 400, width: '100%' }}>
          <Box sx={{ height: '100%', width: '100%' }}>
            <DataGrid
              rows={offers}
              columns={columns}
            />
          </Box>
        </Paper>
      </Paper>
    </Container>
  );
};

export default MakeOffer;
