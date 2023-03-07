import React, { useState, useEffect } from "react";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import parseHtml from 'html-react-parser';
import messaging from "@ebanux/ebanux-utils/messaging";

const mSubscriptions: any[] = [];

type CloseEventType = (value: boolean) => void | null;

interface ConfirmData {
  content: string;
  onClose: CloseEventType | null;
}

interface ConfirmState extends ConfirmData {
  open: boolean;
}

const ConfirmDialog = () => {
  const [state, setState] = useState<ConfirmState>({ content: '', onClose: null, open: false });
  const { content, onClose, open } = state;

  function onOpen(content: string, onClose: CloseEventType) {
    setState({ content, onClose, open: true });
  }

  function onAccept() {
    onClose && onClose(true);
    setState({ content: '', onClose: null, open: false });
  }

  function onCancel() {
    onClose && onClose(false);
    setState({ content: '', onClose: null, open: false });
  }

  useEffect(() => {
    // Anything in here is fired on component mount.
    mSubscriptions.push(messaging.setListener('confirm', onOpen));

    return () => {
      // Anything in here is fired on component unmount.
      messaging.delListener(mSubscriptions);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog maxWidth="sm" fullWidth open={open}>
      <DialogTitle>
        {'Confirmation:'}
      </DialogTitle>
      <DialogContent>{parseHtml(content)}</DialogContent>
      <DialogActions>
        <Button color="primary" variant="outlined" onClick={onCancel} autoFocus>
          {'Cancel'}
        </Button>
        <Button color="primary" variant={"outlined"} onClick={onAccept}>
          {'Accept'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const waitConfirmation = (content: string, onClose: CloseEventType) => {
  messaging.emit('confirm', [content, onClose]);
}

export default ConfirmDialog;
