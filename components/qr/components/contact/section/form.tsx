import React, { ChangeEvent, useEffect } from 'react'

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";

import TextBox from "../../../../forms/fields/TextBox";
import Caption from "../../../renderers/helpers/Caption";

import { IFormProps, ISectionData } from "./types";
import Switch from "@mui/material/Switch";

export default function Form({ data, index, handleValues }: IFormProps<ISectionData>) {
  const onChange = (attr: string) => (value: any, valid: boolean) => {
    handleValues(attr, index)(value);
  }

  const handleReceipt = (event: ChangeEvent<HTMLInputElement>) => {
    handleValues('visibleReceipt', index)(event.target.checked);
  }

  const {
    title = '',
    email = '',
    message = '',
    buttonText = '',
    visibleReceipt = false,
  } = data || {};

  return (
    <Box sx={{ width: '100%' }}>
      <Caption text="Use this address to receive the message from your contact form." />
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextBox
            index={index} label="Receipt email" value={email} required
            placeholder="Enter your email address here"
            onChange={onChange('email')}
            format={/^\w+(\.\w+)*(\+\w+(\.\w+)*)?@\w+(\.\w+)+$/}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch checked={visibleReceipt || false} onChange={handleReceipt} />}
            label="Visible receipt's email in in microsite" sx={{ mt: '-5px' }}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextBox
            index={index} label="Subject placeholder" value={title}
            placeholder="Enter the email subject placeholder here"
            onChange={onChange('title')}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextBox
            index={index} label="Button text" value={buttonText}
            placeholder="Send message"
            onChange={onChange('buttonText')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextBox
            index={index} label="Message placeholder" value={message}
            placeholder="Enter the email message placeholder here"
            onChange={onChange('message')}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
