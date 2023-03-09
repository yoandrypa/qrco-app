import React from "react";

import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import LogoutIcon from "@mui/icons-material/Logout";

import classes from "./classes.sx";
import { startAuthorizationFlow } from "@ebanux/ebanux-utils/auth";
import { startWaiting } from "../../Waiting";

export const onLogin = () => {
  startWaiting();
  startAuthorizationFlow();
}

export default function MenuItemLogin() {
  const { iconSmall } = classes;

  return (
    <MenuItem onClick={onLogin}>
      <ListItemIcon><LogoutIcon sx={iconSmall} /></ListItemIcon>
      <ListItemText>Login</ListItemText>
    </MenuItem>
  );
}