import {ChangeEvent} from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import {isValidUrl} from "../../../../utils";
import {EMAIL} from "../../constants";

import RenderTextFields from "../helpers/RenderTextFields";
import RenderPhones from "./RenderPhones";
import {ContentProps} from "../custom/helperFuncs";
import RenderEmailWeb from "./RenderEmailWeb";

export default function RenderCompanyData({data, handleValues, index}: ContentProps) {
  const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string) => {
    handleValues(item, index)(payload);
  }

  const renderItem = (item: string, label: string, required?: boolean) => {
    let isError = false as boolean; // @ts-ignore
    const value = data?.[item] || '' as string;

    if (value.trim().length && ((item === 'companyWebSite' && !isValidUrl(value)) ||
      (item === 'companyEmail' && !EMAIL.test(value)))) {
      isError = true;
    }

    return (
      <RenderTextFields
        item={item}
        index={index}
        label={label}
        isError={isError}
        value={value}
        handleValues={beforeSend}
        required={required}
        multiline={item === 'about'} />
    );
  };

  return (
    <Box sx={{width: '100%'}}>
      <Grid container spacing={1}>
        <Grid item xs={12} style={{paddingTop: 0}}>{renderItem('company', 'Company', true)}</Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>{renderItem('title', 'Title')}</Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>{renderItem('subtitle', 'Subtitle')}</Grid>
        <Grid item xs={12} sx={{pt: 1}}>
          <RenderEmailWeb data={data} handleValues={handleValues} isCompany index={index} />
        </Grid>
        <Grid item xs={12} style={{paddingTop: 0}}>{renderItem('contact', 'Contact name')}</Grid>
        <Grid item xs={12} sx={{pt: 1}}>
          <RenderPhones data={data} handleValues={handleValues} isCompany index={index} />
        </Grid>
        <Grid item xs={12} style={{paddingTop: 0}}>{renderItem('about', 'About')}</Grid>
      </Grid>
    </Box>
  );
}
