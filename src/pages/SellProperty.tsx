// src/components/Makeproperty.tsx
import React from 'react';
import { Container, Paper } from '@mui/material';
import PropertyCreateForm from '../../ui-components/PropertyCreateForm';
import { useNavigate } from 'react-router-dom';
 
const SellProperty: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: 3 }}>
      <h3>Sell your property </h3>
      <PropertyCreateForm onSuccess={()=>{ navigate("/", { replace: true });}}/>
      </Paper>
    </Container>
  );
};

export default SellProperty;
