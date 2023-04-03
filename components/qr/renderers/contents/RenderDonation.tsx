import React, { useEffect } from 'react'
import session from "@ebanux/ebanux-utils/sessionStorage";
import messaging from "@ebanux/ebanux-utils/messaging";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Coffee from "@mui/icons-material/Coffee";

import { UrlFormat } from "../../../forms/helpers/validations";

import TextBox from "../../../forms/fields/TextBox";
import NumberBox from "../../../forms/fields/NumberBox";
import ProposalsTextBox from "../../../forms/fields/ProposalsTextBox";
import Caption from "../helpers/Caption";

export interface DataType {
  title: string;
  buttonText: string;
  message: string;
  website: string;
  unitAmount: number;
  email: string;
  ownerId: string;
}

export interface PropsType {
  index: number;
  data: DataType;
}

function RenderDonation({ data, index }: PropsType) {
  const onChange = (item: string) => (value: any) => {
    // @ts-ignore
    data[item] = value;
    messaging.emit('onChangeQrData');
  }

  useEffect(() => {
    if (data.email === undefined) data.email = session.currentUser.email;
    if (data.ownerId === undefined) data.ownerId = session.currentUser.cognito_user_id;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { title = '', buttonText = '', message = '', website = '', unitAmount = 1 } = data || {};

  return (
    <Box sx={{ width: '100%' }}>
      <Caption text="Give your supporters a quick and touch-free checkout option." />
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <TextBox
            index={index} item="title" label="Title" value={title}
            placeholder="Enter the donation section title"
            handleValues={onChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ProposalsTextBox
            index={index} item="buttonText" label="Button text" value={buttonText}
            options={['Donate', 'Give', 'Contribute']}
            handleValues={onChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Caption text="Add a small text here:" />
          <TextBox
            index={index} item="message" label="Message" value={message}
            placeholder="Would you like to buy me a coffee?"
            handleValues={onChange}
            rows={5}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Alert severity='info'>
            Note: When you receive a donation, your supporters will be redirected to this website or social link page,
            you can use this to provide some content as a sign of appreciation or just leave it blank and they
            will be redirected to a &quot;thank you page&quot;.
          </Alert>
        </Grid>
        <Grid item xs={12} sm={8}>
          <TextBox
            index={index} item="website" label="Website or social link" value={website}
            placeholder="Enter your website or social link"
            handleValues={onChange}
            format={UrlFormat}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <NumberBox
            index={index} item="unitAmount" label="Coffee Price" value={unitAmount}
            min={1} max={100}
            placeholder="5"
            handleValues={onChange}
            startAdornment={<Coffee sx={{ color: 'primary.main' }} />}
            required
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default RenderDonation
