import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import messaging from "@ebanux/ebanux-utils/messaging";

const mSubscriptions: any[] = [];

let waiting: number = 0;

const Waiting = ({ text = "Please wait..." }) => {
  const [active, setActive] = useState<boolean>(false);

  function onStartWaiting() {
    waiting += 1;
    setActive(waiting > 0);
  }

  function onReleaseWaiting() {
    waiting = Math.max(waiting - 1, 0);
    setActive(waiting > 0);
  }

  useEffect(() => {
    // Anything in here is fired on component mount.

    mSubscriptions.push(messaging.setListener('startWaiting', onStartWaiting));
    mSubscriptions.push(messaging.setListener('releaseWaiting', onReleaseWaiting));

    return () => {
      // Anything in here is fired on component unmount.
      messaging.delListener(mSubscriptions);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Backdrop sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }} open={active}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CircularProgress color="inherit" sx={{ mx: 'auto' }} />
        <Typography>{text}</Typography>
      </Box>
    </Backdrop>
  );
}

export const startWaiting = () => messaging.emit('startWaiting');
export const releaseWaiting = () => messaging.emit('releaseWaiting');

export default Waiting;
