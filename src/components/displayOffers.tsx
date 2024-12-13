import { useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import React from 'react';

const displayOffers: React.FC<any> = ({ gOffers }) => {
  const navigate = useNavigate();

  const handleCellClick = (params: {
    row: any; id: any;
  }) => {
    navigate(`/offers/${params.row.id}/${params.row.propertyAddress}`);

  }

  let columns: GridColDef[] = [
    { field: 'ownerName', headerName: 'Name', flex: 150 },
    { field: 'ownerEmail', headerName: 'Email', flex: 150 },
    { field: 'ownerPhone', headerName: 'Phone', flex: 150 },
    { field: 'offerAmmount', headerName: 'Offer', flex: 110, type: 'number' },
    { field: 'offerType', headerName: 'Type', flex: 80, type: 'string' },
  ];
  return (
    <>
        {gOffers && <Paper elevation={3} sx={{ padding: 3, margin: 3 }}>
        <Paper elevation={3} sx={{ padding: 2, width: '100%' }}>
          <h3>Offers received</h3>
        <DataGrid
                autoHeight
                getRowId={(row) => row.propertyAddress || 1}
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
                onCellClick={handleCellClick}
                rows={gOffers}
                columns={columns}
              ></DataGrid>
        </Paper>
      </Paper>}
    </>
  );
};

export default displayOffers;
