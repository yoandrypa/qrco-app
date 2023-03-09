import React, { useState, MouseEvent, Fragment, ReactNode } from "react";

import session from "@ebanux/ebanux-utils/sessionStorage";

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import MenuIcon from '@mui/icons-material/Menu';

import MenuItemProfile from "./MenuItemProfile";
import MenuItemSubscription from "./MenuItemSubscription";
import MenuItemSupport from "./MenuItemSupport";
import MenuItemLogout from "./MenuItemLogout";

import classes from "./classes.sx";
import useMediaQuery from "@mui/material/useMediaQuery";

interface MainMenuProps {
  children?: ReactNode;
}

export default function MainMenu({ children }: MainMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const isWide = useMediaQuery("(min-width:600px)", { noSsr: true });
  const { isAuthenticated } = session;

  const { paperSx } = classes;

  const onOpen = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const onClose = () => setAnchorEl(null);

  return (
    <Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <IconButton
          sx={{ ml: 1 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={onOpen}
        >
          {isWide ? <Avatar sx={classes.iconSmall} /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Menu id="account-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            onClick={onClose}
            PaperProps={{ sx: paperSx }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {isAuthenticated && <div><MenuItemProfile /><Divider /></div>}
        {children}
        <MenuItemSubscription />
        <Divider />
        <MenuItemSupport />
        {isAuthenticated && <div><Divider /><MenuItemLogout /></div>}
      </Menu>
    </Fragment>
  );
}