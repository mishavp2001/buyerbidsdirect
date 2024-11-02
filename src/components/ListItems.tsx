import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import { Box, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
  
  const handleRowClick = ( params: {
    row: any; id: any; 
  }) => {
    if (user?.username === params.row.owner) {
      navigate(`/sales/${params.row.id}`);
    } else {
      navigate(`/property/${params.row.id}`);
    }  
  }
  const columns: GridColDef[] = [
    { field: 'address', headerName: 'Address', flex: 250, headerClassName: 'header-grid'},
    { field: 'price', headerName: 'Price', flex: 90, type: 'number', headerClassName: 'header-grid' },
    { field: 'bedrooms', headerName: 'Bedrooms', flex: 90,type: 'number', headerClassName: 'header-grid' },
    { field: 'bathrooms', headerName: 'Bathrooms', flex: 90, type: 'number', headerClassName: 'header-grid' },
    { field: 'squareFootage', headerName: 'Square Footage', flex: 90, type: 'number', headerClassName: 'header-grid' },
    { field: 'ownerContact', headerName: 'Contact', flex: 150, headerClassName: 'header-grid',
      renderCell: (params: GridRenderCellParams) => {
        return (
            <>{params.row.ownerContact}</>
        )  
      }
    },
  ];
  return (
    <Paper elevation={3} sx={{ padding: 2, height: 400, width: '100%' }}>
      <Box sx={{height: '100%'}}>
        <DataGrid
          onRowClick={handleRowClick}
          rows={properties}
          columns={columns}
        />
      </Box>
    </Paper>
  );
};

export default PropertyTable;
