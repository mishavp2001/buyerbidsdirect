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
                    BuyerBidsDirect
                </Link>
                <Link to="/dashboard" style={{ marginRight: '2em', color: 'inherit', textDecoration: 'none' }}>
                    Dashboard
                </Link>
                <Link to="/profiles" style={{ marginRight: '2em', color: 'inherit', textDecoration: 'none' }}>
                    Business Directory
                </Link>
                <Link to="/calc" style={{ marginRight: '2em', color: 'inherit', textDecoration: 'none' }}>
                    Tools
                </Link>
                <AccountMenu />
            </Toolbar>
        </AppBar>
    );
};

export default NavigationBar; 
