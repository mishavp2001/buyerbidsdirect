import React from 'react';
import { Link } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';
import { AppBar, Toolbar } from '@mui/material';
import AccountMenu from './AccountMenu';
import { useAuthenticator } from '@aws-amplify/ui-react';

const NavigationBar: React.FC = () => {
    const { user } = useAuthenticator((context) => [context.user]);

    function getCoreDomain(url: string) {
        let hostname;

        // Check if the input is already a hostname (e.g., localhost) or a URL
        if (url.startsWith('http://') || url.startsWith('https://')) {
            hostname = new URL(url).hostname; // Extract hostname from a full URL
        } else {
            hostname = url; // Assume it's a raw hostname like "localhost"
        }

        // Remove 'www.' if it exists
        const stripped = hostname.replace(/^www\./, '');

        // Handle localhost or cases without TLD
        if (stripped === 'localhost') {
            return capitalize('BuyerBidsDirect');
        }

        // Remove the TLD (e.g., .com, .org, etc.)
        const coreDomain = stripped.split('.').slice(0, -1).join('.');
        switch (coreDomain) {
            case 'buyerbidsdirect':
                return 'BuyerBidsDirect';
                break;
            case 'salesboter':
                return 'SalesBoter'
                break;
            default:
                return capitalize(coreDomain);
        }
    }

    // Helper function to capitalize the first letter
    function capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <Link to="/" style={{ marginRight: '2em', color: 'inherit', textDecoration: 'none' }}>
                    {getCoreDomain(window.location.hostname) || 'BuyerBidsDirect'}
                </Link>
                <Link to="/profiles" style={{ marginRight: '2em', color: 'inherit', textDecoration: 'none' }}>
                            Experts
                        </Link>
                        <Link to="/posts" style={{ marginRight: '2em', color: 'inherit', textDecoration: 'none' }}>
                            Posts
                        </Link>
                {!user &&
                    <>
                        <Link to="/calc" style={{ marginRight: '2em', color: 'inherit', textDecoration: 'none' }}>
                            Tools
                        </Link>
                    </>
                }

                <AccountMenu />
            </Toolbar>
        </AppBar>
    );
};

export default NavigationBar; 
