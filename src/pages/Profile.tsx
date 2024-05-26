import React, { useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Box,
  Paper,
} from '@mui/material';

const UserProfile: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loanApprovalLetter, setLoanApprovalLetter] = useState<File | null>(null);
  const [sellerFinancingOptions, setSellerFinancingOptions] = useState<string>('');
  const [chargePerHour, setChargePerHour] = useState<string>('');
  const [userType, setUserType] = useState<string>('buyer');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLoanApprovalLetter(event.target.files[0]);
    }
  };

  const handleSave = () => {
    // Handle the save action, e.g., send data to API
    console.log({
      email,
      phone,
      password,
      loanApprovalLetter,
      sellerFinancingOptions,
      chargePerHour,
      userType,
    });
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 500, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        User Profile
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="user-type-label">User Type</InputLabel>
          <Select
            labelId="user-type-label"
            value={userType}
            onChange={(e) => setUserType(e.target.value as string)}
          >
            <MenuItem value="buyer">Buyer</MenuItem>
            <MenuItem value="seller">Seller</MenuItem>
            <MenuItem value="attorney">Attorney</MenuItem>
            <MenuItem value="agent">Agent</MenuItem>
            <MenuItem value="notary">Notary</MenuItem>
          </Select>
        </FormControl>
        {userType === 'buyer' && (
          <>
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ marginTop: 2 }}
            >
              Upload Loan Approval Letter
              <input
                type="file"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            {loanApprovalLetter && (
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Selected file: {loanApprovalLetter.name}
              </Typography>
            )}
          </>
        )}
        {userType === 'seller' && (
          <TextField
            fullWidth
            margin="normal"
            label="Seller Financing Options"
            value={sellerFinancingOptions}
            onChange={(e) => setSellerFinancingOptions(e.target.value)}
          />
        )}
        {(userType !== 'buyer' && userType !== 'seller') && (
          <TextField
            fullWidth
            margin="normal"
            label="Charge Per Hour"
            type="number"
            value={chargePerHour}
            onChange={(e) => setChargePerHour(e.target.value)}
          />
        )}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ marginTop: 3 }}
          onClick={handleSave}
        >
          Save
        </Button>
      </Box>
    </Paper>
  );
};

export default UserProfile;
