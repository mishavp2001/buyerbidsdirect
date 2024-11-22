import React, { useEffect, useState } from 'react';
import { Icon, useAuthenticator } from '@aws-amplify/ui-react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Logout, House } from '@mui/icons-material/index';
import { fetchUserAttributes } from 'aws-amplify/auth';

export default function AccountMenu() {
    const [email, setEmail ] =  useState<string>('User');
    const { authStatus, signOut } = useAuthenticator((context) => [
        context.authStatus,
        context.signOut
    ]);
    // Fetch user attributes when the component mounts
    useEffect(() => {
        const fetchAttributes = async () => {
        try {
            const userAttributes = await fetchUserAttributes();
            const email = userAttributes?.email ?? 'Guest';
            setEmail(email);
        } catch (err) {
            console.error('Error fetching user attributes:', err);
        }
        };
    
        fetchAttributes();
    }, []);
  
    function handleLogOut() {
        setAnchorEl(null);
        signOut();
    }

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <React.Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                {authStatus !== 'authenticated' ?
                    <Link to='/login'>Login</Link> :
                    <Tooltip title="Account settings">
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Avatar sx={{ width: 32, height: 32 }}>{email?.[0]}</Avatar>
                        </IconButton>
                    </Tooltip>
                }
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        backgroundColor: 'white',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleClose} {...{ component: Link, to: "/profile" }} >
                    <ListItemIcon>
                        <Avatar />
                    </ListItemIcon>
                    <ListItemText>
                        {email || 'Guest'}
                    </ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose} {...{ component: Link, to: "/offers" }} >
                    <ListItemIcon>
                        <Icon
                            ariaLabel="Flag"
                            pathData="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"
                            color="rebeccapurple" />
                    </ListItemIcon>
                    <ListItemText>
                        Offers
                    </ListItemText>
                </MenuItem>
                <MenuItem onClick={handleClose} {...{ component: Link, to: "/sales" }} >
                    <ListItemIcon>
                        <House />
                    </ListItemIcon>

                    <ListItemText>
                        Properties
                    </ListItemText>

                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogOut}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>
                        Logout
                    </ListItemText>

                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}
