import React, { useState, useEffect } from "react";

import Alert, { AlertColor } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import LinearProgress from '@mui/material/LinearProgress';

import parseHtml from 'html-react-parser';
import messaging from "@ebanux/ebanux-utils/messaging";

import classes from "./styles.sx";

const mSubscriptions: any[] = [];

interface NotificationData {
  message: string | string[];
  severity?: AlertColor;
}

type NotificationType = NotificationData | Error | string | string[];
type CloseOptionType = boolean | number;

interface NotificationState {
  notification: NotificationData
  open: boolean;
  closeOption?: CloseOptionType;
}

const Notification = () => {
  const [state, setState] = useState<NotificationState>({ notification: { message: '' }, open: false });
  const { notification: { message, severity }, open, closeOption } = state;

  function onClose() {
    setState(({ notification: { severity } }: NotificationState) => (
      { notification: { message: '', severity }, open: false }
    ));
  }

  function onSetNotification(notification: NotificationType | null, closeOption: CloseOptionType) {
    if (!notification) return onClose();

    let message: string | string[];
    let severity: AlertColor | undefined;

    if (Array.isArray(notification)) notification = notification.join('<br/>');

    if (typeof notification === 'string') {
      message = notification;
      severity = 'info';
    } else if (notification instanceof Error) {
      message = notification.message;
      severity = 'error';
    } else {
      message = notification.message;
      severity = notification.severity;
    }

    if (Array.isArray(message)) message = message.join('<br/>');
    message = message.replace(/\n/, '<br/>');

    setState({ notification: { message, severity }, open: true, closeOption });
  }

  useEffect(() => {
    // Anything in here is fired on component mount.
    mSubscriptions.push(messaging.setListener('setNotification', onSetNotification));

    return () => {
      // Anything in here is fired on component unmount.
      messaging.delListener(mSubscriptions);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const closeHandle = closeOption ? onClose : undefined;
  const autoHide = typeof closeOption === 'number';

  return (
    <Snackbar open={open}
              autoHideDuration={autoHide ? closeOption : undefined}
              onClose={autoHide ? closeHandle : undefined}
              sx={{ zIndex: 3000 }}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert variant="standard" sx={{ width: "100%" }} severity={severity} onClose={closeHandle}>
        {parseHtml(message as string)}
        {autoHide && <LinearProgress color={severity} sx={classes.progress(closeOption)} />}
      </Alert>
    </Snackbar>
  );
}

export const setNotification = (notification: NotificationType, closeOption: CloseOptionType = 8000) => {
  messaging.emit('setNotification', [notification, closeOption]);
}

export const setError = (message: Error | string | string[], closeOption: CloseOptionType = 8000) => {
  setNotification(typeof message === 'string' ? new Error(message) : message, closeOption);
}

export const setWarning = (message: string | string[], closeOption: CloseOptionType = 8000) => {
  setNotification({ message, severity: 'warning' }, closeOption);
}

export const setInfo = (message: string | string[], closeOption: CloseOptionType = 8000) => {
  setNotification({ message, severity: 'info' }, closeOption);
}

export const setSuccess = (message: string | string[], closeOption: CloseOptionType = 8000) => {
  setNotification({ message, severity: 'success' }, closeOption);
}

export const hideNotification = () => messaging.emit('setNotification', [null]);

export default Notification;
