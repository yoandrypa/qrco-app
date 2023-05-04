import React, { useState, MouseEvent, Fragment } from 'react';

import session from '@ebanux/ebanux-utils/sessionStorage';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import MenuIcon from '@mui/icons-material/Settings';
import AdminIcon from '@mui/icons-material/SettingsOutlined';
import DashboardIcon from '@mui/icons-material/LineAxisOutlined';
import CheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import AccountIcon from '@mui/icons-material/ManageAccountsOutlined';

import MItem from './MItem';
import classes from './classes.sx';

export default function AdminMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { isAuthenticated } = session;

  const { paperSx } = classes;

  const onOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const onClose = () => setAnchorEl(null);

  if (!isAuthenticated) return null;

  return (
    <Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <IconButton
          sx={{ ml: 1 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
          onClick={onOpen}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Menu id='account-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            onClick={onClose}
            PaperProps={{ sx: paperSx }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MItem module='home' title='Management' Icon={AdminIcon} />
        <Divider />
        <MItem module='dashboard' title='Dashboard' Icon={DashboardIcon} />
        <MItem module='checkouts' title='Checkouts' Icon={CheckoutIcon} />
        <Divider />
        <MItem module='my-account' title='My Account' Icon={AccountIcon} />
      </Menu>
    </Fragment>
  );
}