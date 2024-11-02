// src/components/Makeproperty.tsx
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
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Link as RouterLink } from 'react-router-dom';
import { fetchUserAttributes } from 'aws-amplify/auth';


const client = generateClient<Schema>();

const SellProperty: React.FC = () => {
  const { propertyId } = useParams();

  const navigate = useNavigate();
  const { user } = useAuthenticator((context) => [context.user]);
  const [error, setError] = useState<string | null>(null);
  const [properties, setProperties] = useState<Array<any>>([]); // Adjust the type according to your schema
  const [open, setOpen] = React.useState<boolean>(false);
  const [owner, setOwner] = React.useState<{ name?: string, email?: string }>({});

  useEffect(() => {
    async function fetchUserData() {
      const userAttributes = await fetchUserAttributes();
      setOwner({ name: userAttributes?.name, email: userAttributes?.email });
    }
    fetchUserData();

  }, []);

  useEffect(() => {
    async function fetchProperties() {
      const filter = typeof propertyId === 'string' ? { id: { eq: propertyId } } : { owner: { contains: user.userId } }
      const { data: items, errors } = await client.models.Property.list({
        filter,
        authMode: "userPool"
      })
      if (!errors) {
        console.dir(items);
        setProperties(items);
      } else {
        setError(errors.toString)
        console.dir(errors);
      }
    }
    fetchProperties();
  }, [user.userId, propertyId]);

  useEffect(() => {
    if (propertyId === 'new' || typeof (propertyId) === 'string') {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [propertyId]);

  const columns: GridColDef[] = [
    { field: 'address', headerName: 'Address', flex: 300 },
    { field: 'description', headerName: 'Description', flex: 200 },
    { field: 'price', headerName: 'Price', flex: 150, type: 'number' },
    { field: 'bedrooms', headerName: 'Bedrooms', flex: 120, type: 'number' },
    { field: 'bathrooms', headerName: 'Bathrooms', flex: 120, type: 'number' },
    { field: 'squareFootage', headerName: 'Square Footage', flex: 150, type: 'number' },
    { field: 'amenities', headerName: 'Amenities', flex: 200 }
  ];

  const handleRowClick = ( params: {
    row: any; id: any; 
}) => {
    navigate(`/sales/${params.row.id}`);
  }

  return (
    <Container component="main">
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography component="h1" variant="h5">My properties:
          <Button variant="contained" style={{ float: 'right' }} component={RouterLink} to={`/sales/new`}>
            Add new
          </Button>
        </Typography>

        <Paper elevation={3} sx={{ marginTop: '15px', padding: '15px 10px', height: 400, width: '100%' }}>
          <DataGrid
            onRowClick={handleRowClick}
            rows={properties}
            columns={columns}
          />

        </Paper>
      </Paper>

      <Modal
        open={open}
        onClose={() => { navigate("/sales", { replace: true }); }}
      >
        <ModalDialog minWidth='90%' >
          <ModalClose style={{ margin: '10px' }} />
          <DialogTitle>Edit property details</DialogTitle>
          <DialogContent>
            {error && <p>{error}</p>}
            {
              propertyId !== 'new' ?
                <>
                  <PropertyUpdateForm
                    id={propertyId}
                    overrides={
                      {
                        listingOwner: { value: owner.name, isReadOnly: true },
                        ownerContact: { value: owner.email, isReadOnly: true },
                      }}
                    onSuccess={() => { navigate("/sales", { replace: true }); }} />
                </>
                :
                <>
                  <PropertyCreateForm
                    onSuccess={() => { navigate("/sales", { replace: true }); }}
                    overrides={
                      {
                        listingOwner: { value: owner.name, isReadOnly: true },
                        ownerContact: { value: owner.email, isReadOnly: true },
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
