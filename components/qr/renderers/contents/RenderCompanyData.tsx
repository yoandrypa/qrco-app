import {ChangeEvent} from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import {isValidUrl} from "../../../../utils";
import {EMAIL} from "../../constants";
import {Type} from "../../types/types";

import RenderTextFields from "../helpers/RenderTextFields";
import Topics from "../helpers/Topics";
import RenderPhones from "./RenderPhones";

interface CompanyProps {
  index: number;
  data?: Type;
  message?: string;
  handleValues: Function;
}

export default function RenderCompanyData({data, handleValues, message, index}: CompanyProps) {
  const renderItem = (item: string, label: string, required?: boolean) => {
    let isError = false as boolean; // @ts-ignore
    const value = data?.[item] || '' as string;

    if (value.trim().length && ((item === 'companyWebSite' && !isValidUrl(value)) ||
      (item === 'companyEmail' && !EMAIL.test(value)))) {
      isError = true;
    }

    const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string | boolean) => {
      handleValues(item, index)(payload);
    }

    return (
      <RenderTextFields
        item={item}
        label={label}
        isError={isError}
        value={value}
        handleValues={beforeSend}
        required={required} />
    );
  };

  return (
    <Box sx={{width: '100%'}}>
      {message && <Topics message={message}/>}
      <Grid container spacing={1}>
        <Grid item xs={12} style={{paddingTop: 0}}>
          {renderItem('company', 'Company', true)}
        </Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('title', 'Title')}
        </Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('subtitle', 'Subtitle')}
        </Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('companyWebSite', 'Web')}
        </Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('companyEmail', 'Email')}
        </Grid>
        <Grid item xs={12} style={{paddingTop: 0}}>
          {renderItem('contact', 'Contact name')}
        </Grid>
        <Grid item xs={12} sx={{pt: 1}}>
          <RenderPhones data={data} handleValues={handleValues} isCompany index={index} />
        </Grid>
        <Grid item xs={12} style={{paddingTop: 0}}>
          {renderItem('about', 'About')}
        </Grid>
      </Grid>
    </Box>
  );
}
