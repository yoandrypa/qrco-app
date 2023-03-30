import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {PHONE} from "../../constants";
import RenderTextFields from "../helpers/RenderTextFields";
import React, {ChangeEvent} from "react";
import {ContentProps} from "../custom/helperFuncs";
import Topics from "../helpers/Topics";
import RenderAsButton from "../../helperComponents/smallpieces/RenderAsButton";

interface RenderPhonesProps extends ContentProps {
  isCompany?: boolean;
  message?: string;
}

export default function RenderPhones({data, handleValues, isCompany, index, message}: RenderPhonesProps) {
  const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string | boolean) => {
    handleValues(item, index)(payload);
  }

  const renderItem = (item: string, label: string) => {
    let isError = false as boolean; // @ts-ignore
    const value = data?.[item] || '' as string;

    if (value.trim().length && !PHONE.test(value)) {
      isError = true;
    }

    return (
      <RenderTextFields item={item} label={label} isError={isError} value={value} includeIcon // @ts-ignore
                        handleValues={beforeSend} index={index} customValue={data?.[`${item}_Custom`] || ''}
                        options={Boolean(data?.extras?.phoneButton)} />
    );
  };

  return (
    <Box sx={{width: '100%'}}>
      {message && <Topics message={message}/>}
      <Grid container spacing={1}>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem(!isCompany ? 'cell' : 'companyCell', 'Cell number')}
        </Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem(!isCompany ? 'phone' : 'companyPhone', `${!isCompany ? 'Alternative p' : 'P'}hone number`)}
        </Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('whatsapp', 'Whatsapp')}
        </Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem(!isCompany ? 'fax' : 'companyFax', 'Fax')}
        </Grid>
        <Grid item xs={12}>
          <RenderAsButton sendData={beforeSend} extras={data?.extras} message="Phones as buttons" item="phoneButton" />
        </Grid>
      </Grid>
    </Box>
  );
}
