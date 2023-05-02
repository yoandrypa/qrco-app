import React, { ElementType } from "react";
import { useRouter } from "next/router";

import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import classes from "./classes.sx";
import { releaseWaiting, startWaiting } from "../../Waiting";

interface IProps {
  module: string;
  title: string;
  Icon: ElementType;
}

export default function MItem({module, title, Icon}: IProps) {
  const router = useRouter();
  const { iconSmall } = classes;

  const onClick = () => {
    const withWaiting = router.pathname !== '/management/[module]';

    withWaiting && startWaiting();
    router.push(`/management/${module}`).finally(() => {
      withWaiting && releaseWaiting();
    });
  }

  return (
    <MenuItem onClick={onClick}>
      <ListItemIcon><Icon sx={iconSmall} /></ListItemIcon>
      <ListItemText>{title}</ListItemText>
    </MenuItem>
  );
}