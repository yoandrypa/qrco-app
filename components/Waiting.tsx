import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// @ts-ignore
import messaging from "@ebanux/ebanux-utils/messaging";

const mSubscriptions: any[] = [];

const Waiting = ({ text = "Please wait..." }) => {
  const [waiting, setWaiting] = useState<number>(0);

  function onStartWaiting() {
    setWaiting(waiting + 1);
  }

  function onReleaseWaiting() {
    setWaiting(Math.max(waiting - 1, 0));
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
    <Backdrop sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }} open={waiting !== 0}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography align="center" sx={{ top: 32, position: 'relative' }}>{waiting}</Typography>
        <CircularProgress color="inherit" sx={{ mx: 'auto' }} />
        <Typography>{text}</Typography>
      </Box>
    </Backdrop>
  );
}

export const startWaiting = () => messaging.emit('startWaiting');
export const releaseWaiting = () => messaging.emit('releaseWaiting');

export default Waiting;
