// src/components/Makeproperty.tsx
import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Link } from '@mui/material';
import PropertyCreateForm from '../../ui-components/PropertyCreateForm';
import PropertyUpdateForm from '../../ui-components/PropertyUpdateForm';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Link as RouterLink } from 'react-router-dom';


const client = generateClient<Schema>();

const SellProperty: React.FC = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const { user } = useAuthenticator((context) => [context.user]);
  const [error, setError] = useState<string | null>(null);
  const [properties, setProperties] = useState<Array<any>>([]); // Adjust the type according to your schema
  const [open, setOpen] = React.useState<boolean>(false);

  useEffect(() => {
    const filter = {
      and: [
        { owner: { contains: user.userId } },
        ...(typeof propertyId === 'string' ? [{ id: { contains: propertyId } }] : [])
      ]
    };
    const subscription = client.models.Property.observeQuery({
      filter,
      authMode: "userPool"
    }).subscribe({
      next: (data) => setProperties(data.items),
      error: (err) => setError(err.message),
    });

    // Cleanup the subscription on unmount
    return () => subscription.unsubscribe();
  }, [propertyId]);



  useEffect(() => {
    if (propertyId === 'new' || typeof (propertyId) === 'string') {
      setOpen(true);
    } else {
      setOpen(false);
    }

  }, [propertyId]);


  const columns: GridColDef[] = [
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'listingOwner', headerName: 'Owner', width: 200 },
    { field: 'ownerContact', headerName: 'Contact', width: 200 },
    { field: 'price', headerName: 'Price', width: 150, type: 'number' },
    { field: 'bedrooms', headerName: 'Bedrooms', width: 120, type: 'number' },
    { field: 'bathrooms', headerName: 'Bathrooms', width: 120, type: 'number' },
    { field: 'squareFootage', headerName: 'Square Footage', width: 150, type: 'number' },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Link component={RouterLink} to={`/sales/${params.row.id}`}>
            Edit
          </Link>
        );
      },
    },
  ];

  return (
    <Container component="main">
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography component="h1" variant="h5">My properties for sale:</Typography>
        <Paper elevation={3} sx={{ padding: 2, height: 400, width: '100%' }}>
          <Link component={RouterLink} to={`/sales/new`}>
            Sell new
          </Link>
          <DataGrid
            rows={properties}
            columns={columns}
          />
        </Paper>
      </Paper>
      <Modal open={open} onClose={() => { navigate("/sales", { replace: true }); }}>
        <ModalDialog minWidth='90%'>
          <ModalClose />
          <DialogTitle style={{ 'display': 'none' }}> {user.username} please add details for {propertyId}</DialogTitle>
          <DialogContent>
            {error && <p>{error}</p>}
            {
              propertyId !== 'new' ?
                <>
                  <h3>Edit your property details </h3>
                  <PropertyUpdateForm id={propertyId} onSuccess={() => { navigate("/sales", { replace: true }); }} />
                </>
                :
                <>
                  <h3>Sell your property </h3>
                  <PropertyCreateForm onSuccess={() => { navigate("/sales", { replace: true }); }} />

                </>
            }
          </DialogContent>
        </ModalDialog>
      </Modal>
    </Container>

  );
};

export default SellProperty;
