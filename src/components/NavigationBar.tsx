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
          <Link to="/" style={{ marginRight: '2em',  color: 'inherit', textDecoration: 'none' }}>
            Home
          </Link>
          <Link to="/sales" style={{ marginRight: '2em',  color: 'inherit', textDecoration: 'none' }}>
            Sales
          </Link>
          <Link to="/offers" style={{ marginRight: '2em',  color: 'inherit', textDecoration: 'none' }}>
            Offers
          </Link>
          {authStatus === 'authenticated' ?
            <Link to="/profile"  style={{ marginRight: '2em',  color: 'inherit', textDecoration: 'none' }}>{user?.signInDetails?.loginId}</Link> :
            <Link to='/login'  style={{ marginRight: '2em',  color: 'inherit', textDecoration: 'none' }}>Login</Link>
            }
        {authStatus === 'authenticated' &&
        <Link to='/' onClick={handleLogOut}>Logout</Link>
        }
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar; 
