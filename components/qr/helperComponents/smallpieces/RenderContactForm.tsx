import React from 'react'
import Grid from "@mui/material/Grid";
import RenderTextFields from '../../renderers/helpers/RenderTextFields';
import Stack from '@mui/material/Stack';
import { TextField, Typography } from '@mui/material';
//@ts-ignore
import session from "@ebanux/ebanux-utils/sessionStorage";


interface ContactFormProps {
  title: string;
  messagePlaceholder: string;
  buttonText: string;
  email: string;
}

function RenderContactForm({ title, buttonText, messagePlaceholder }: ContactFormProps) {

  const { currentAccount } = session;

  return (
    <Stack spacing={1}>
      <Typography>Contact form</Typography>
      <TextField
        label='Title'
        fullWidth
        size='small'
        placeholder='Let me know what you think about...'
        variant='outlined'
        value={title}
      />
      <TextField
        label='Message placeholder'
        size='small'
        multiline
        fullWidth
        placeholder='Use this text as a placeholder for the message'
        rows={4}
        value={messagePlaceholder}
      />
      <TextField
        fullWidth
        size='small'
        placeholder='Send message'
        variant='outlined'
        label='Button Text'
        value={buttonText}
      />
    </Stack>
  )
}

export default RenderContactForm