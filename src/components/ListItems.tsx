import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import { Box, Paper, Link } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';

interface Property {
  id: number;
  address: string;
  price: number;
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
        if (user?.username === params.row.owner) {
          return (
            <Link component={RouterLink} to={`/sales/${params.row.id}`}>
              Edit
            </Link>
          );
        }
        return (
          <Link component={RouterLink} to={`/offers/null/${params.row.address}/${params.row.id}/${params.row.owner}`}>
            Make Offer
          </Link>
        );
      },
    },
  ];
  return (
    <Paper elevation={3} sx={{ padding: 2, height: 400, width: '100%' }}>
      <Box sx={{ height: '100%', width: '100%' }}>
        <DataGrid
          onCellClick={(params)=>{ if (params.field !== 'action') {navigate(`/property/${params.id}`, { replace: true });}}}
          rows={properties}
          columns={columns}
          autoPageSize
        />
      </Box>
    </Paper>
  );
};

export default PropertyTable;
