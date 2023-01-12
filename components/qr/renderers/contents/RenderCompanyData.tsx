import Grid from "@mui/material/Grid";
import {isValidUrl} from "../../../../utils";
import {EMAIL, PHONE} from "../../constants";
import RenderTextFields from "../helpers/RenderTextFields";
import {DataType} from "../../types/types";
import Box from "@mui/material/Box";
import Topics from "../helpers/Topics";

interface CompanyProps {
  data: DataType;
  message?: string;
  handleValues: Function;
}

export default function RenderCompanyData({data, handleValues, message}: CompanyProps) {
  const renderItem = (item: string, label: string, required?: boolean) => {
    let isError = false as boolean; // @ts-ignore
    const value = data?.[item] || '' as string;
    if (value.trim().length && ((item === 'companyWebSite' && !isValidUrl(value)) ||
      (item === 'companyEmail' && !EMAIL.test(value)) || (item === 'companyPhone' && !PHONE.test(value)))) {
      isError = true;
    }
    return <RenderTextFields item={item} label={label} isError={isError} value={value} handleValues={handleValues}
                             required={required}/>;
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
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('contact', 'Contact name')}
        </Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('companyPhone', 'Phone')}
        </Grid>
        <Grid item xs={12} style={{paddingTop: 0}}>
          {renderItem('about', 'About')}
        </Grid>
      </Grid>
    </Box>
  );
}
