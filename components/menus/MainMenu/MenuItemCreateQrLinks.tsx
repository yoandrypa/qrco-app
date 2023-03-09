import React from "react";
import { useRouter } from "next/router";

import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import QrCodeIcon from "@mui/icons-material/QrCode";

import classes from "./classes.sx";
import { releaseWaiting, startWaiting } from "../../Waiting";

export default function MenuItemCreateQrLinks() {
  const router = useRouter();
  const { iconSmall } = classes;

  const onClick = () => {
    startWaiting();
    router.push('/qr/type').finally(releaseWaiting);
  }

  return (
    <MenuItem onClick={onClick}>
      <ListItemIcon>{<QrCodeIcon sx={iconSmall} />}</ListItemIcon>
      <ListItemText>Create QR Link</ListItemText>
    </MenuItem>
  );
}