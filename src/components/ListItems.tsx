import React from 'react';
import { DataGrid, GridColDef, GridRenderCellParams} from '@mui/x-data-grid';
import { Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { StorageImage } from '@aws-amplify/ui-react-storage';

interface Property {
  id: number;
  address: string;
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
  
  const handleRowClick = ( params: {
    row: any; id: any; 
  }) => {
    if (user?.username === params.row.owner) {
      navigate(`/property/${params.row.id}`);
    } else {
      navigate(`/property/${params.row.id}`);
    }  
  }
  const columns: GridColDef[] = [
    { field: 'photos', headerName: '', renderCell: (params) => {
      return  <StorageImage alt={params?.value[0]} path={params?.value[0]} />
    },flex: 200, type: 'number', headerClassName: 'header-grid' },
    { field: 'address', headerName: 'Address', flex: 150, headerClassName: 'header-grid'},
    { field: 'price', headerName: 'Price', flex: 120, type: 'number', headerClassName: 'header-grid' },
    { field: 'bedrooms', headerName: 'Beds', flex: 90,type: 'number', headerClassName: 'header-grid' },
    { field: 'bathrooms', headerName: 'Bath', flex: 90, type: 'number', headerClassName: 'header-grid' },
    { field: 'squareFootage', headerName: 'SqFt', flex: 100, type: 'number', headerClassName: 'header-grid' },
    {
      field: 'yield', headerName: 'Yield', valueGetter: (_value, row) => {
        return `${((row?.arvprice - row?.price) * 100 / row?.arvprice).toFixed(2)}%`;
      }, flex: 120,  headerClassName: 'header-grid'
    },
    { field: 'ownerContact', headerName: 'Contact', flex: 150, headerClassName: 'header-grid',
      renderCell: (params: GridRenderCellParams) => {
        return (
            <>{user?.username === params.row.owner ? 'Yours' : params.row.ownerContact}</>
        )  
      }
    },
  ];
  return (
    <Paper elevation={3} 
      sx={{height: "90vh" }}
      >
      <Box sx={{height: '100%'}}>
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
          onRowClick={handleRowClick}
          rows={properties}
          columns={columns}
        />
      </Box>
    </Paper>
  );
};

export default PropertyTable;
