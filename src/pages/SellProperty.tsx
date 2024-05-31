// src/components/Makeproperty.tsx
import React from 'react';
import { Container, Paper } from '@mui/material';
import PropertyCreateForm from '../../ui-components/PropertyCreateForm';
import PropertyUpdateForm from '../../ui-components/PropertyUpdateForm';

import { useNavigate, useParams } from 'react-router-dom';

const SellProperty: React.FC = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: 3 }}>
        {
          propertyId ?
            <>
              <h3>Edit your property details </h3>
              <PropertyUpdateForm id={propertyId}  onSuccess={() => { navigate("/", { replace: true }); }} />
            </>
            :
            <>
              <h3>Sell your property </h3>
              <PropertyCreateForm onSuccess={() => { navigate("/", { replace: true }); }} />

            </>
        }
      </Paper>
    </Container>
  );
};

export default SellProperty;
