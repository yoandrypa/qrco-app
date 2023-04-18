import React, { useEffect } from 'react'
import session from "@ebanux/ebanux-utils/sessionStorage";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import TextBox from "../../../forms/fields/TextBox";
import NumberBox from "../../../forms/fields/NumberBox";
import ProposalsTextBox from "../../../forms/fields/ProposalsTextBox";
import Caption from "../helpers/Caption";
import SelectIconBox from "../../../forms/fields/SelectIconBox";
import EbxIcon from "../../../icons";

export interface DataType {
  title: string;
  buttonText: string;
  message: string;
  unitAmount: number;
  email: string;
  ownerId: string;
  iconId: string;
}

export interface PropsType {
  index: number;
  data: DataType;
  handleValues: Function;
}

function RenderDonation({ data, index, handleValues }: PropsType) {
  const onChange = (attr: string) => (value: any, valid: boolean) => {
    handleValues(attr, index)(value);
  }
  useEffect(() => {
    if (data.email === undefined) data.email = session.currentUser.email;
    if (data.ownerId === undefined) data.ownerId = session.currentUser.cognito_user_id;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    title = '',
    buttonText = '',
    message = '',
    unitAmount = 1,
    iconId = 'Coffee1',
  } = data || {};

  return (
    <Box sx={{ width: '100%' }}>
      <Caption text="Give your supporters a quick and touch-free checkout option." />
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <TextBox
            index={index} label="Title" value={title}
            placeholder="Enter the donation section title"
            onChange={onChange('title')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ProposalsTextBox
            index={index} label="Button text" value={buttonText}
            options={['Donate', 'Give', 'Contribute']}
            onChange={onChange('buttonText')}
          />
        </Grid>
        <Grid item xs={12}>
          <Caption text="Add a small text here:" />
          <TextBox
            index={index} label="Message" value={message}
            placeholder="Would you like to buy me a coffee?"
            onChange={onChange('message')}
            rows={5}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <SelectIconBox
            index={index} label="Icon" value={iconId}
            placeholder="5"
            onChange={onChange('iconId')}
            requiredAdornment
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <NumberBox
            index={index} label="Unit amount" value={unitAmount}
            min={1} max={100}
            placeholder="5"
            onChange={onChange('unitAmount')}
            startAdornment={<EbxIcon iconId={iconId} />}
            requiredAdornment
          />
        </Grid>

      </Grid>
    </Box>
  )
}

export default RenderDonation
