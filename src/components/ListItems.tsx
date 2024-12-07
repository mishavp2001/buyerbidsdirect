import React, { useEffect, useState } from 'react';
import { DataGrid, GridCellParams, GridColDef, GridEventListener, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import { Mail, CurrencyExchange, Chat } from '@mui/icons-material';
import { LikeButton } from './likeButton';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from "../../amplify/data/resource";

interface Property {
  id: number;
  address: string;
  description: string;
  price: number;
  photos: string[];
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  listingOwner: string;
  owner: string;
  ownerContact: string
}

interface PropertyTableProps {
  properties: Property[];
}

const client = generateClient<Schema>();

const PropertyTable: React.FC<PropertyTableProps> = ({ properties }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Array<any>>([]); // Adjust the type according to your schema

  useEffect(() => {
    const getProfileFavorites = async () => {
      if (!user?.userId) {
        return;
      }

      try {
        // Query to check if a profile exists
        const { data: profile } = await client.models.UserProfile.list({
          filter: { id: { eq: user.userId } },
        });
        // Update state based on the result
        profile?.[0]?.favorites !== null && setFavorites(profile[0].favorites);
      } catch (error) {
        console.error("Error checking profile existence:", error);
      }
    };

    getProfileFavorites();
  }, []);

  const handleCellClick: GridEventListener<'cellClick'> = (
    params: GridCellParams,
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    const target = event?.target as HTMLElement;
    const isLinkClicked = target.tagName === 'A';
    if (isLinkClicked) {
      // Prevent DataGrid from handling the click if the link was clicked
      event?.stopPropagation(); // Stop the click from propagating to the DataGrid
      return;
    }
    if (user?.username === params.row.owner) {
      navigate(`/property/${params.row.id}`, { state: { isModal: true, backgroundLocation: '/2' } });
    } else {
      navigate(`/property/${params.row.id}`, { state: { isModal: true, backgroundLocation: '/2' } });
    }
  }

  const columns: GridColDef[] = [
    {
      field: 'photos', headerName: '', renderCell: (params) => {
        return <>
              <LikeButton 
               style={{ 
                 left: 45, bottom: 25, color: 'white', cursor: 'pointer' }}
                propertyId={params.row.id} user={user} favorites={favorites} property={params.row}/>
              <StorageImage style={{}} alt={params?.value[0]} path={params?.value[0]} />
        </>
        
      }, flex: 320, type: 'number', headerClassName: 'header-grid'
    },
    {
      field: 'summary', headerName: 'Description', renderCell: (params) => {
        const { address, description, ownerContact } = params.row;
        return (
          <div style={{ lineHeight: '1', textAlign: 'left' }}>
            <span  title='E-mail to the owner'>
              <Mail sx={{marginRight: 2}} onClick={(evt) => { evt.stopPropagation(); window.location.href = `mailto:${ownerContact}` }} />
            </span>
            <span  title='Make Offer'>
              <CurrencyExchange sx={{marginRight: 2}} onClick={(evt) => { evt.stopPropagation(); alert('Hi') }} />
            </span>
            <span  title='Chat with the owner'>
              <Chat onClick={(evt) => { evt.stopPropagation(); alert('Hi') }} />
            </span>
            <p>{address}</p>
            <p>{description}</p>
          </div>)
      }, flex: 350, headerClassName: 'header-grid'
    },
    { field: 'address', headerName: 'Address', flex: 250, headerClassName: 'header-grid' },
    { field: 'description', headerName: 'Description', flex: 250, headerClassName: 'header-grid' },
    { field: 'price', headerName: 'Price', flex: 120, type: 'number', headerClassName: 'header-grid' },
    { field: 'bedrooms', headerName: 'Beds', flex: 50, type: 'number', headerClassName: 'header-grid' },
    { field: 'bathrooms', headerName: 'Bath', flex: 50, type: 'number', headerClassName: 'header-grid' },
    { field: 'squareFootage', headerName: 'SqFt', flex: 50, type: 'number', headerClassName: 'header-grid' },
    {
      field: 'yield', headerName: 'Yield', valueGetter: (_value, row) => {
        return `${((row?.arvprice - row?.price) * 120 / row?.arvprice).toFixed(2)}%`;
      }, flex: 130, headerClassName: 'header-grid'
    },
    {
      field: 'ownerContact', headerName: 'Contact', flex: 150, headerClassName: 'header-grid',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <>{user?.username === params.row.owner ? 'Yours' : params.row.ownerContact}</>
        )
      }
    },
  ];
  const [visibilityModel] = useState({
    address: false,
    description: false,
    ownerContact: false
  });

  return (
    <Paper elevation={3}
    >
      <Box sx={{ height: '100%' }}>
        <DataGrid
          autoHeight={true}
          rowHeight={120}
          columnVisibilityModel={visibilityModel}
          sx={{
            // disable cell selection style
            '.MuiDataGrid-cell:focus': {
              outline: 'none'
            },
            '& .MuiDataGrid-cell': {
              display: 'flex',        // Use flexbox for vertical alignment
              alignItems: 'center',   // Vertically align to the middle
              justifyContent: 'middle', // Optional: horizontally center content
            },
            // pointer cursor on ALL rows
            '& .MuiDataGrid-row:hover': {
              cursor: 'pointer'
            }
          }}
          onCellClick={handleCellClick}
          getRowId={(row) => row.id}
          rows={properties}
          columns={columns}
        />
      </Box>
    </Paper>
  );
};

export default PropertyTable;
