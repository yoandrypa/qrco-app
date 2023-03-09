import React, { useContext } from "react";
import { useRouter } from "next/router";

import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import SubscriptionIcon from '@mui/icons-material/CreditCardOutlined';

import { releaseWaiting, startWaiting } from "../../Waiting";

import classes from "./classes.sx";
import Context from "../../context/Context";
import Chip from "@mui/material/Chip";
import plans from "../../../consts/plans";

export default function MenuItemSubscription() {
  const router = useRouter();
  const { subscription } = useContext(Context);
  const { iconSmall } = classes;

  const onClick = () => {
    startWaiting();
    router.push('/plans').finally(releaseWaiting);
  }

  const options = (): any => {
    if (subscription?.status === 'active') {
      //@ts-ignore
      const label: string = plans[subscription.metadata.plan_type].title;

      return {
        text: 'Subscription review',
        title: `You are subscribed to the '${label}' plan. Click here to review your subscription`,
        label,
        color: 'info',
      }
    }

    return {
      text: 'Subscribe to a plan',
      title: 'You are on a free account, Please Upgrade now to get access to more features',
      label: 'Free',
      color: 'warning',
    }
  }

  const { text, label, title, color } = options();

  return (
    <MenuItem onClick={onClick}>
      <ListItemIcon><SubscriptionIcon sx={iconSmall} /></ListItemIcon>
      <ListItemText>{text}</ListItemText>
      <Chip color={color} variant="outlined" label={label} size="small" title={title} sx={{ ml: 1 }} />
    </MenuItem>
  );
}