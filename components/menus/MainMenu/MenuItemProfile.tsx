import React from "react";

import session from "@ebanux/ebanux-utils/sessionStorage";

import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import UserIcon from '@mui/icons-material/PersonOutlineOutlined';

import classes from "./classes.sx";

export default function MenuItemProfile() {
  const { name, email } = session.currentUser;
  const { iconSmall } = classes;

  return (
    <MenuItem>
      <ListItemIcon><UserIcon sx={iconSmall} /></ListItemIcon>
      <ListItemText primaryTypographyProps={{ variant: 'subtitle2' }}>{name || email}</ListItemText>
    </MenuItem>
  );
}