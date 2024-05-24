import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { AppBar, Toolbar, Typography } from '@mui/material';

const NavigationBar: React.FC = () => {
    const { user, authStatus, signOut } = useAuthenticator((context) => [
        context.authStatus,
        context.signOut
    ]);

    function handleLogOut() {
        signOut();
    }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ marginRight: '20px',  color: 'inherit', textDecoration: 'none' }}>
            Home
          </Link>
          <Link to="/sales" style={{ marginRight: '20px',  color: 'inherit', textDecoration: 'none' }}>
            Sales
          </Link>
          <Link to="/offers" style={{ marginRight: '20px',  color: 'inherit', textDecoration: 'none' }}>
            Offers
          </Link>
          {authStatus === 'authenticated' ?
            <Link to="/profile"  style={{ marginRight: '20px',  color: 'inherit', textDecoration: 'none' }}>{user?.signInDetails?.loginId}</Link> :
            <Link to='/login'  style={{ marginRight: '20px',  color: 'inherit', textDecoration: 'none' }}>Login</Link>
            }
        </Typography>
        {authStatus === 'authenticated' &&
        <Link to='/' onClick={handleLogOut}>Logout</Link>
        }
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar; 
