import React, { useState } from 'react';
import { DataGrid, GridCellParams, GridColDef, GridEventListener, GridRenderCellParams } from '@mui/x-data-grid';
import { Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { StorageImage } from '@aws-amplify/ui-react-storage';

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

const PropertyTable: React.FC<PropertyTableProps> = ({ properties }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const navigate = useNavigate();

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
        return <Box sx={{ height: 160, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
          <StorageImage alt={params?.value[0]} path={params?.value[0]} />
        </Box>
      }, flex: 220, type: 'number', headerClassName: 'header-grid'
    },
    {
      field: 'summary', headerName: 'Description', renderCell: (params) => {
        const { address, description, ownerContact } = params.row;
        return (
          <div style={{ lineHeight: '1', textAlign: 'left' }}>
            <p>{address}</p>
            <p>{description}</p>
            <p><a href={`mailto:${ownerContact}`}>{ownerContact}</a></p>
          </div>)
      }, flex: 250, headerClassName: 'header-grid'
    },
    { field: 'address', headerName: 'Address', flex: 250, headerClassName: 'header-grid' },
    { field: 'description', headerName: 'Description', flex: 250, headerClassName: 'header-grid' },
    { field: 'price', headerName: 'Price', flex: 120, type: 'number', headerClassName: 'header-grid' },
    { field: 'bedrooms', headerName: 'Beds', flex: 90, type: 'number', headerClassName: 'header-grid' },
    { field: 'bathrooms', headerName: 'Bath', flex: 90, type: 'number', headerClassName: 'header-grid' },
    { field: 'squareFootage', headerName: 'SqFt', flex: 100, type: 'number', headerClassName: 'header-grid' },
    {
      field: 'yield', headerName: 'Yield', valueGetter: (_value, row) => {
        return `${((row?.arvprice - row?.price) * 100 / row?.arvprice).toFixed(2)}%`;
      }, flex: 120, headerClassName: 'header-grid'
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
      sx={{ height: "90vh" }}
    >
      <Box sx={{ height: '100%' }}>
        <DataGrid
          rowHeight={160}
          columnVisibilityModel={visibilityModel}
          sx={{
            // disable cell selection style
            '.MuiDataGrid-cell:focus': {
              outline: 'none'
            },
            '& .MuiDataGrid-cell': {
              display: 'flex',        // Use flexbox for vertical alignment
              alignItems: 'center',   // Vertically align to the middle
              justifyContent: 'left', // Optional: horizontally center content
            },
            // pointer cursor on ALL rows
            '& .MuiDataGrid-row:hover': {
              cursor: 'pointer'
            }
          }}
          onCellClick={handleCellClick}
          rows={properties}
          columns={columns}
        />
      </Box>
    </Paper>
  );
};

export default PropertyTable;
