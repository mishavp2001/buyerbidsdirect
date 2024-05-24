// src/components/Makeproperty.tsx
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';

interface property {
  price: number;
  conditions: string;
}

const ListProperty: React.FC = () => {
  const [property, setProperty] = useState<property>({ price: 0, conditions: '' });
  const [errors, setErrors] = useState<{ price?: string, conditions?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProperty(prev => ({ ...prev, [name]: value }));
  };

  const validate = (): boolean => {
    const newErrors: { price?: string, conditions?: string } = {};
    if (property.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!property.conditions) newErrors.conditions = 'Conditions are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('property submitted:', property);
      // Submit the property data to the server or handle it accordingly
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography component="h1" variant="h5">Make an property</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            variant="outlined"
            fullWidth
            id="price"
            label="Price"
            name="price"
            type="number"
            value={property.price}
            onChange={handleChange}
            error={Boolean(errors.price)}
            helperText={errors.price}
            sx={{ mb: 2 }}
          />
          <TextField
            variant="outlined"
            fullWidth
            id="conditions"
            label="Conditions"
            name="conditions"
            value={property.conditions}
            onChange={handleChange}
            error={Boolean(errors.conditions)}
            helperText={errors.conditions}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Publish
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ListProperty;
