import React from 'react';
import { Link } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import { AppBar, Toolbar } from '@mui/material';
import AccountMenu from './AccountMenu';

const NavigationBar: React.FC = () => {

    return (
        <AppBar position="static">
            <Toolbar>
                <Link to="/" style={{ marginRight: '2em', color: 'inherit', textDecoration: 'none' }}>
                    Buy
                </Link>
                <Link to="/sales" style={{ marginRight: '2em', color: 'inherit', textDecoration: 'none' }}>
                    Sell
                </Link>
                <Link to="/calc" style={{ marginRight: '2em', color: 'inherit', textDecoration: 'none' }}>
                    Analyze
                </Link>
                <AccountMenu />
            </Toolbar>
        </AppBar>
    );
};

export default NavigationBar; 
