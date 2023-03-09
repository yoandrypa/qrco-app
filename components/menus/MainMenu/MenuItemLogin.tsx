import React from "react";
import { useRouter } from "next/router";

import session from "@ebanux/ebanux-utils/sessionStorage";

import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from "@mui/icons-material/Logout";

import classes from "./classes.sx";

import { startAuthorizationFlow } from "@ebanux/ebanux-utils/auth";
import { startWaiting } from "../../Waiting";

export default function MenuItemLogin() {
  const router = useRouter();
  const { iconSmall } = classes;

  const onLogin = () => {
    startWaiting();
    const { pathname, query } = router;
    session.set('CALLBACK_ROUTE', { pathname, query });
    startAuthorizationFlow();
  }

  return (
    <MenuItem onClick={onLogin}>
      <ListItemIcon><LogoutIcon sx={iconSmall} /></ListItemIcon>
      <ListItemText>Login</ListItemText>
    </MenuItem>
  );
}