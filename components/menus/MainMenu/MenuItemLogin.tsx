import React from "react";
import { useRouter } from "next/router";

import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from "@mui/icons-material/Logout";
import classes from "./classes.sx";

import { startAuthorizationFlow } from "../../../libs/utils/auth";

export default function MenuItemLogin() {
  const router = useRouter();
  const { iconSmall } = classes;

  const onLogin = () => startAuthorizationFlow(router);

  return (
    <MenuItem onClick={onLogin}>
      <ListItemIcon><LogoutIcon sx={iconSmall} /></ListItemIcon>
      <ListItemText>Login</ListItemText>
    </MenuItem>
  );
}