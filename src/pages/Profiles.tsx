
import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper } from '@mui/material';
import UserProfileView from '../ui-components/UserProfileView';
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


const client = generateClient<Schema>();

const Profiles: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthenticator((context) => [context.user]);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Array<any>>([]); // Adjust the type according to your schema
  const [open, setOpen] = React.useState<boolean>(false);

  useEffect(() => {
    async function fetchUserProfiles() {
      //const filter = userId  ? { id: { eq: userId } } : null;
      const { data: items, errors } = await client.models.UserProfile.list({
        filter: userId ? { id: { eq: userId } } : undefined, // Proper conditional for filter
        authMode: "identityPool"
      })
      if (!errors) {
        //console.dir(items);
        setProfiles(items);
      } else {
        setError(errors.toString)
        //console.dir(errors);
      }
    }
    fetchUserProfiles();
  }, [user?.userId, userId]);

  useEffect(() => {
    if (userId !== '' && typeof (userId) === 'string') {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [userId]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 300 },
    { field: 'name', headerName: 'Name', flex: 300 },
    { field: 'email', headerName: 'Email', flex: 200 },
    { field: 'user_role', headerName: 'Role', flex: 150 },
  ];

  const handleRowClick = (params: {
    row: any; id: any;
  }) => {
    navigate(`/profiles/${params.row.id}`);
  }

  return (
    <Container component="main">
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography component="h1" variant="h5">Contacts:
        </Typography>

        <Paper elevation={3} sx={{ marginTop: '15px', padding: '15px 10px', height: 400, width: '100%' }}>
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
            initialState={{
              columns: {
                columnVisibilityModel: {
                  id: false,
                },
              },
            }}
            onRowClick={handleRowClick}
            rows={profiles}
            columns={columns}
          />

        </Paper>
      </Paper>

      <Modal
        open={open}
        onClose={() => { navigate("/profiles", { replace: true }); }}
      >
        <ModalDialog minWidth='90%' >
          <ModalClose style={{ margin: '10px' }} />
          <DialogTitle>User Profile:</DialogTitle>
          <DialogContent>
            {error && <p>{error}</p>}
              <UserProfileView id={userId} />
          </DialogContent>
        </ModalDialog>
      </Modal>
    </Container>

  );
};

export default Profiles;
