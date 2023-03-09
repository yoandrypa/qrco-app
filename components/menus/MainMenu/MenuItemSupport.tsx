import React from "react";

import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import EmailIcon from "@mui/icons-material/Email";

import classes from "./classes.sx";

export default function MenuItemSupport() {
  const { iconSmall } = classes;

  const onOpenDocumentation = () => {
    window.open('https://docs.theqr.link', '_blank');
  }

  const onOpenMailTo = () => {
    window.open('mailto:info@ebanux.com', '_blank');
  }

  return (
    <div>
      <MenuItem onClick={onOpenDocumentation}>
        <ListItemIcon><ContactSupportIcon sx={iconSmall} /></ListItemIcon>
        <ListItemText>Documentation</ListItemText>
      </MenuItem>
      <MenuItem onClick={onOpenMailTo}>
        <ListItemIcon><EmailIcon sx={iconSmall} /></ListItemIcon>
        <ListItemText>info@ebanux.com</ListItemText>
      </MenuItem>
    </div>
  );
}
