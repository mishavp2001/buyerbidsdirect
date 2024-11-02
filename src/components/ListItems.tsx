import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import { Box, Paper } from '@mui/material';
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
    { field: 'address', headerName: 'Address', minWidth: 250, flex: 1, headerClassName: 'header-grid'},
    { field: 'price', headerName: 'Price', width: 150, type: 'number', headerClassName: 'header-grid' },
    { field: 'bedrooms', headerName: 'Bedrooms', width: 120,type: 'number', headerClassName: 'header-grid' },
    { field: 'bathrooms', headerName: 'Bathrooms', width: 120, type: 'number', headerClassName: 'header-grid' },
    { field: 'squareFootage', headerName: 'Square Footage', width: 150, type: 'number', headerClassName: 'header-grid' },
    { field: 'ownerContact', headerName: 'Contact', minWidth: 150, headerClassName: 'header-grid',
      renderCell: (params: GridRenderCellParams) => {
        return (
            <>{params.row.ownerContact}</>
        )  
      }
    },
  ];
  return (
    <Paper elevation={3} sx={{ padding: 2, height: 400 }}>
      <Box sx={{ height: '100%'}}>
        <DataGrid
          onRowClick={handleRowClick}
          rows={properties}
          columns={columns}
          autoPageSize
        />
      </Box>
    </Paper>
  );
};

export default PropertyTable;
