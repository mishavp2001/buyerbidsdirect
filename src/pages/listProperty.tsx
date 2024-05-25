// src/components/Makeproperty.tsx
import React from 'react';
import { Container, Paper } from '@mui/material';
import PropertyCreateForm from '../../ui-components/PropertyCreateForm';
 
const ListProperty: React.FC = () => {

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: 3 }}>
      <h3>Sell your property </h3>

      <PropertyCreateForm />
      </Paper>
    </Container>
  );
};

export default ListProperty;
