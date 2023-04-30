import React, { ChangeEvent } from 'react'

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

  const onChangeRecipientVisible = (event: ChangeEvent<HTMLInputElement>) => {
    handleValues('recipientVisible', index)(event.target.checked);
  }

  const { subjectPlaceholder, messagePlaceholder, recipientEmail, recipientVisible, buttonText } = data || {};

  return (
    <Box sx={{ width: '100%' }}>
      <Caption text="Use this address to receive the message from your contact form." />
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextBox
            index={index} label="Recipient email" value={recipientEmail} required
            placeholder="Enter your email address here"
            onChange={onChange('recipientEmail')}
            format={/^\w+(\.\w+)*(\+\w+(\.\w+)*)?@\w+(\.\w+)+$/}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch checked={recipientVisible || false} onChange={onChangeRecipientVisible} />}
            label="Recipient email visible on microsite" sx={{ mt: '-5px' }}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextBox
            index={index} label="Subject placeholder" value={subjectPlaceholder}
            placeholder="Enter the email subject placeholder here"
            onChange={onChange('subjectPlaceholder')}
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
            index={index} label="Message placeholder" value={messagePlaceholder}
            placeholder="Enter the email message placeholder here"
            onChange={onChange('messagePlaceholder')}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
