import React, { useState, useEffect } from "react";

import Alert, { AlertColor } from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import messaging from "@ebanux/ebanux-utils/messaging";

const mSubscriptions: any[] = [];

interface NotificationData {
  message: string;
  severity?: AlertColor;
}

type NotificationType = NotificationData | Error | string

interface NotificationState {
  notification: NotificationData
  open: boolean;
}

const Notification = () => {
  const [state, setState] = useState<NotificationState>({ notification: { message: '' }, open: false });
  const { notification: { message, severity }, open } = state;

  function onSetNotification(notification: NotificationType) {
    let message: string;
    let severity: AlertColor | undefined;

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

    setState({ notification: { message, severity }, open: true });
  }

  function onClose() {
    setState(({ notification: { severity } }: NotificationState) => (
      { notification: { message: '', severity }, open: false }
    ));
  }

  useEffect(() => {
    // Anything in here is fired on component mount.
    mSubscriptions.push(messaging.setListener('setNotification', onSetNotification));

    return () => {
      // Anything in here is fired on component unmount.
      messaging.delListener(mSubscriptions);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert variant="filled" sx={{ width: "100%" }} severity={severity} onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export const setNotification = (notification: NotificationType) => {
  messaging.emit('setNotification', [notification]);
}

export const setError = (message: Error | string) => {
  setNotification(typeof message === 'string' ? new Error(message) : message);
}

export const setWarning = (message: string) => setNotification({ message, severity: 'warning' });
export const setInfo = (message: string) => setNotification({ message, severity: 'info' });
export const setSuccess = (message: string) => setNotification({ message, severity: 'success' });

export default Notification;
