import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';

interface Offer {
  price: number;
  conditions: string;
}

const MakeOffer: React.FC = () => {
  const [offer, setOffer] = useState<Offer>({ price: 0, conditions: '' });
  const [errors, setErrors] = useState<{ price?: string, conditions?: string }>({});
  const { offerId, address } = useParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOffer(prev => ({ ...prev, [name]: value }));
  };

  const validate = (): boolean => {
    const newErrors: { price?: string, conditions?: string } = {};
    if (offer.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!offer.conditions) newErrors.conditions = 'Conditions are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Offer submitted:', offer);
      // Submit the offer data to the server or handle it accordingly
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      {offerId ?  
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography component="h1" variant="h5">Make an Offer for property:  <h3>{address}</h3> </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            variant="outlined"
            fullWidth
            id="price"
            label="Offer Price"
            name="price"
            type="number"
            value={offer.price}
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
            value={offer.conditions}
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
            Send Offer
          </Button>
        </Box>
      </Paper>
       :
       <Paper elevation={3} sx={{ padding: 3 }}>
       <Typography component="h1" variant="h5">ALl your offers:</Typography>
       <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
         <TextField
           variant="outlined"
           fullWidth
           id="price"
           label="Offer Price"
           name="price"
           type="number"
           value={offer.price}
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
           value={offer.conditions}
           onChange={handleChange}
           error={Boolean(errors.conditions)}
           helperText={errors.conditions}
           sx={{ mb: 2 }}
         />
       </Box>
     </Paper>   
      } 
    </Container>
  );
};

export default MakeOffer;
