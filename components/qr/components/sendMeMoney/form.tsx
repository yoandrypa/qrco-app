import React, { useEffect } from 'react'
import session from "@ebanux/ebanux-utils/sessionStorage";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import TextBox from "../../../forms/fields/TextBox";
import NumberBox from "../../../forms/fields/NumberBox";
import EbxIcon from "../../../icons";
import Caption from "../../renderers/helpers/Caption";

import { IFormProps, IData } from "./types";

export default function Form({ data, index, handleValues }: IFormProps<IData>) {
  const onChange = (attr: string) => (value: any, valid: boolean) => {
    handleValues(attr, index)(value);
  }

  useEffect(() => {
    if (data.email === undefined) data.email = session.currentUser.email;
    if (data.ownerId === undefined) data.ownerId = session.currentUser.cognito_user_id;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    concept = '',
    description = '',
    unitAmount = 1,
  } = data || {};

  return (
    <Box sx={{ width: '100%' }}>
      <Caption text="Receive payments worldwide." />
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <TextBox
            index={index} label="Concept" value={concept}
            placeholder="Concept"
            onChange={onChange('concept')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <NumberBox
            index={index} label="Unit amount" value={unitAmount}
            min={1} max={100}
            placeholder="5"
            onChange={onChange('unitAmount')}
            startAdornment={<EbxIcon iconId="Money" />}
            requiredAdornment
          />
        </Grid>
        <Grid item xs={12}>
          <Caption text="Add a small description here:" />
          <TextBox
            index={index} label="Description" value={description}
            placeholder="Type here the product or service description..."
            onChange={onChange('description')}
            rows={5}
          />
        </Grid>
      </Grid>
    </Box>
  )
}
