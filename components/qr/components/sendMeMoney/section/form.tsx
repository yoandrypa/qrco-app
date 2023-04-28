import React, { useState } from 'react'

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import TextBox from "../../../../forms/fields/TextBox";
import NumberBox from "../../../../forms/fields/NumberBox";
import EbxIcon from "../../../../icons";
import Caption from "../../../renderers/helpers/Caption";

import { IFormProps, ISectionData } from "./types";

export default function Form({ data, index, handleValues }: IFormProps<ISectionData>) {
  const [initData] = useState<ISectionData>(data);

  const onChange = (attr: string) => (value: any, valid: boolean) => {
    if (initData.priceId && attr.match(/unitAmount/)) data.changePrice = initData.unitAmount !== value;
    if (initData.productId && attr.match(/description|concept/)) {
      data.changeProduct = (initData.description !== data.description) && (initData.concept !== data.concept);
    }
    handleValues(attr, index)(value);
  }

  const { concept, description, unitAmount } = data || {};

  return (
    <Box sx={{ width: '100%' }}>
      <Caption text="Receive payments worldwide." />
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <TextBox
            index={index} label="Concept" value={concept} requiredAdornment
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
