import React, { useContext } from "react";
import { useRouter } from "next/router";

import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import FirstPageIcon from "@mui/icons-material/FirstPage";

import classes from "./classes.sx";
import Context from "../../context/Context";
import { releaseWaiting, startWaiting } from "../../Waiting";

interface ButtonMyQrLynksProp {
  setShowingDetails?: (item: undefined) => void;
}

export default function MenuItemMyQrLynks({setShowingDetails}: ButtonMyQrLynksProp) {
  const router = useRouter();
  const { iconSmall } = classes;
  const { clearData } = useContext(Context);

  const onClick = () => {
    if (setShowingDetails === undefined) {
      startWaiting();
      clearData(true);
      router.push('/').finally(releaseWaiting);
    } else {
      setShowingDetails(undefined);
    }
  }

  return (
    <MenuItem onClick={onClick}>
      <ListItemIcon>{<FirstPageIcon sx={iconSmall} />}</ListItemIcon>
      <ListItemText>My QRLynks</ListItemText>
    </MenuItem>
  );
}
