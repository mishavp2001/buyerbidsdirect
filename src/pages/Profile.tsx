import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Grid, Paper, Alert } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { fetchUserAttributes, updateUserAttributes } from 'aws-amplify/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { StorageManager, StorageImage } from '@aws-amplify/ui-react-storage';


const processFile = async ({file}:any) => {
  const fileExtension = file.name.split('.').pop();

  return file
    .arrayBuffer()
    .then((filebuffer: BufferSource) => window.crypto.subtle.digest('SHA-1', filebuffer))
    .then((hashBuffer: Iterable<number>) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((a) => a.toString(16).padStart(2, '0'))
        .join('');
      return { file, key: `${hashHex}.${fileExtension}` };
    });
};


interface UserProfileAttributes {
  name?: string;
  family_name?: string;
  given_name?: string;
  middle_name?: string;
  nickname?: string;
  preferred_username?: string;
  profile?: string;
  picture?: string;
  website?: string;
  gender?: string;
  birthdate?: string;
  zoneinfo?: string;
  locale?: string;
  updated_at?: string;
  address?: string;
  email?: string;
  phone_number?: string;
  sub?: string;
}

const defaultAttributes: UserProfileAttributes = {
  name: '',
  family_name: '',
  given_name: '',
  middle_name: '',
  nickname: '',
  preferred_username: '',
  profile: '',
  picture: '',
  website: '',
  gender: '',
  birthdate: '',
  zoneinfo: '',
  locale: '',
  address: '',
  email: '',
  phone_number: '',
};

const UserProfileUpdateForm: React.FC = () => {
  const [error, setError] = useState<String>('');
  const [attributes, setAttributes] = useState<UserProfileAttributes>(defaultAttributes);
  const [loading, setLoading] = useState<boolean>(true);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null); // Store the image URL
  const navigate = useNavigate();
  const { update } = useParams();

  // Fetch user attributes when the component mounts
  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        const userAttributes = await fetchUserAttributes();

        // Assuming userAttributes is an object, we map it to state
        const mappedAttributes: UserProfileAttributes = { ...defaultAttributes };

        Object.keys(userAttributes).forEach((key) => {
          const value = userAttributes[key];
          if (mappedAttributes.hasOwnProperty(key)) {
            mappedAttributes[key as keyof UserProfileAttributes] = value;
          }
        });

        setAttributes(mappedAttributes);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user attributes:', err);
        setLoading(false);
      }
    };

    fetchAttributes();
  }, []);

  // Update attributes on form submit
  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
      
     if(profileImageUrl) attributes.picture = profileImageUrl;

    try {
      const updateResult = await updateUserAttributes({'userAttributes': {...attributes}});
      console.log('Attributes updated successfully:', updateResult);
      navigate("/profile/success");
      //alert('User attributes updated successfully.');
    } catch (err) {
      setError(err as String);
      console.error('Error updating user attributes:', err);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAttributes({ ...attributes, [name]: value });
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ padding: 3, maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Update Profile
      </Typography>
      {update === 'success' ? 
        <Alert style={{'marginBottom': '2em'}} variant="filled" icon={<CheckIcon fontSize="inherit" />} severity="success">
        Profile Updated Successfuly
      </Alert> : ''}

      {error && <Alert style={{'marginBottom': '2em'}} variant="filled" icon={<CheckIcon fontSize="inherit" />} severity="error">
        {error.toString()}
      </Alert>}

      <Box component="form" onSubmit={handleUpdate}>
        {attributes?.picture && <StorageImage alt={attributes.picture} path={attributes.picture} />}
        <Grid container spacing={2}>
        {/* Display the profile picture if it exists */}
    
          {/* Iterate over the attributes and render input fields for each */}
          {Object.entries(attributes).map(([key, value]) => {
            if (key !== 'picture')

            return (
            <Grid item xs={12} sm={6} key={key}>
              <TextField
                label={key.replace(/_/g, ' ')} // Display the attribute names in a readable format
                name={key}
                value={value || ''}
                onChange={handleInputChange}
                fullWidth
                disabled={key === 'email' || key === 'sub'} // Make email and sub readonly (Cognito does not allow updating these)
                InputProps={{
                  readOnly: key === 'email' || key === 'sub',
                }}
              />
            </Grid>
          )})}
          <Grid item xs={12} sm={12} key='profile_picture'>
            Profile picture: 
          <StorageManager
              path={({ identityId }) => `profile-pictures/${identityId}/`}
              maxFileCount={1}
              acceptedFileTypes={['image/*']}
              processFile={processFile}
              onUploadSuccess={({key}) => {
                // assuming you have an attribute called 'images' on your data model that is an array of strings
                key && setProfileImageUrl(key)
              }}
              onFileRemove={() => {
                setProfileImageUrl('')
              }}
              onUploadError={(error, {key} ) => {
                console.log(error, key)
                setProfileImageUrl('')
              }}
            />
          </Grid>
        </Grid>  

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
          Update
        </Button>
      </Box>
    </Paper>
  );
};

export default UserProfileUpdateForm;
