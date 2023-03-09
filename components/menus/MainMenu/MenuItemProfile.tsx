import React from "react";

import session from "@ebanux/ebanux-utils/sessionStorage";

import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import UserIcon from '@mui/icons-material/PersonOutlineOutlined';

import classes from "./classes.sx";

export default function MenuItemProfile() {
  const { name, email } = session.currentUser;
  const { iconSmall, profile } = classes;
  const text = (name || email).replace(/@.*/, '');

  return (
    <MenuItem divider disabled sx={profile}>
      <ListItemIcon><UserIcon sx={iconSmall} /></ListItemIcon>
      <ListItemText primaryTypographyProps={{ variant: 'subtitle2' }}>{text}</ListItemText>
    </MenuItem>
  );
}