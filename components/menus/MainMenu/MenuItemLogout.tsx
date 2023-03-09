import React from "react";

import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import LogoutIcon from "@mui/icons-material/Logout";

import { startWaiting } from "../../Waiting";

import classes from "./classes.sx";
import { logout } from "@ebanux/ebanux-utils/auth";
import { waitConfirmation } from "../../ConfirmDialog";

export default function MenuItemLogout() {
  const { iconSmall } = classes;

  const onLogout = () => {
    startWaiting();
    logout();
  }

  const onConfirmLogout = () => waitConfirmation(
    'Please confirm if you really want to log out.',
    (confirmed) => confirmed && onLogout(),
  );

  return (
    <MenuItem onClick={onConfirmLogout}>
      <ListItemIcon><LogoutIcon sx={iconSmall} /></ListItemIcon>
      <ListItemText>Logout</ListItemText>
    </MenuItem>
  );
}