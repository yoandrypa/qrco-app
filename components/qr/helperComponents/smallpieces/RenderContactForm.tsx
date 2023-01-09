/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import Grid from "@mui/material/Grid";
import RenderTextFields from '../../renderers/helpers/RenderTextFields';
import Stack from '@mui/material/Stack';
import { TextField, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';



interface ContactFormProps {
  title: string;
  messagePlaceholder: string;
  buttonText: string;
  email?: string;
  handleChange: Function;
  index: Number
}

function RenderContactForm({ title, buttonText, messagePlaceholder, handleChange, index }: ContactFormProps) {



  return (
    <Stack spacing={2}>
      <Alert severity='info' sx={{ mb: 1 }}>
        The message will be sent to your account's email
      </Alert>
      <TextField
        label='Title'
        fullWidth
        size='small'
        placeholder='Let me know what you think about...'
        variant='outlined'
        value={title}
        onChange={(e) => handleChange('title', index, e.target.value)}
      />
      <TextField
        label='Message placeholder'
        size='small'
        multiline
        fullWidth
        placeholder='Use this text as a placeholder for the message'
        rows={4}
        value={messagePlaceholder}
        onChange={(e) => handleChange('message', index, e.target.value)}
      />
      <TextField
        fullWidth
        size='small'
        placeholder='Send message'
        variant='outlined'
        label='Button Text'
        value={buttonText}
        onChange={(e) => handleChange('buttonText', index, e.target.value)}
      />
    </Stack >
  )
}

export default RenderContactForm