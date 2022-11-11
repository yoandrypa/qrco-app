import {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

import Common from '../helperComponents/Common';
import RenderEasiness from "./helpers/RenderEasiness";
import RenderSocials from "./helpers/RenderSocials";
import RenderOpeningTime from "./helpers/RenderOpeningTime";
import Expander from "./helpers/Expander";
import {DataType} from "../types/types";
import {isValidUrl} from "../../../utils";
import RenderTextFields from "./helpers/RenderTextFields";
import {EMAIL, PHONE, ZIP} from "../constants";
import Topics from "./helpers/Topics";
import socialsAreValid from "./validator";
import RenderProposalsTextFields from "./helpers/RenderProposalsTextFields";

interface BusinessProps {
  data: DataType;
  setData: Function;
  handleValues: Function;
  setIsWrong: (isWrong: boolean) => void;
}

export default function BusinessData({data, setData, handleValues, setIsWrong}: BusinessProps) {
  const [expander, setExpander] = useState<string | null>(null);

  const renderItem = (item: string, label: string, required?: boolean) => {
    let isError = false as boolean;
    // @ts-ignore
    const value = data?.[item] || '' as string;

    if ((value.trim().length === 0 && ['urlOptionLabel', 'urlOptionLink'].includes(item)) ||
      (item === 'urlOptionLink' && !isValidUrl(value))) {
      isError = true;
    } else if (value.trim().length && ((item === 'web' && !isValidUrl(value)) ||
      (item === 'email' && !EMAIL.test(value)) || (item === 'phone' && !PHONE.test(value)) ||
      (item === 'zip' && !ZIP.test(value)))) {
        isError = true;
    }

    if (item === 'urlOptionLabel') {
      return (<RenderProposalsTextFields
        options={['View menu', 'Shop online', 'Book now', 'Apply now', 'Learn more']}
        value={value}
        item={item}
        label={label}
        isError={isError}
        handleValues={handleValues}
      />);
    }

    return <RenderTextFields item={item} label={label} isError={isError} value={value} handleValues={handleValues} required={required} />;
  };

  const handleOptionButton = () => {
    setData((prev: DataType) => {
      const tempo = {...prev};
      if (tempo.urlOptionLabel !== undefined) {
        delete tempo.urlOptionLabel;
        delete tempo.urlOptionLink;
      } else {
        tempo.urlOptionLabel = '';
        tempo.urlOptionLink = '';
      }
      return tempo;
    });
  };

  useEffect(() => {
    let errors = false;
    if (data.urlOptionLabel !== undefined && data.urlOptionLink !== undefined) {
      if (!data.urlOptionLabel.trim().length || !data.urlOptionLink.trim().length || !isValidUrl(data.urlOptionLink)) {
        errors = true;
      }
    } else if ((data.web?.trim().length && !isValidUrl(data.web)) ||
      (data.email?.trim().length && !EMAIL.test(data.email)) || (data.phone?.trim().length && !PHONE.test(data.phone)) ||
      (data.zip?.trim().length && !ZIP.test(data.zip))) {
      errors = true;
    } else if (!data.company?.trim().length) {
      errors = true;
    } else {
      errors = !socialsAreValid(data);
    }
    setIsWrong(errors);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Common
      msg="Your business or company details. Users can contact your business or company right the way.">
      <Topics message={'Business info'}/>
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
          {renderItem('web', 'Web')}
        </Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('email', 'Email')}
        </Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('contact', 'Contact')}
        </Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('phone', 'Phone')}
        </Grid>
        <Grid item xs={12} style={{paddingTop: 0}}>
          {renderItem('about', 'About')}
        </Grid>
      </Grid>
      <Paper elevation={2} sx={{ p: 1, mt: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ my: 'auto' }}>{'Option button'}</Typography>
          <Button sx={{ mb: '5px' }} variant="contained"
            color={data.urlOptionLabel === undefined ? 'primary' : 'error'} onClick={handleOptionButton}>
            {data.urlOptionLabel === undefined ? 'Add an option button' : 'Remove option button'}
          </Button>
        </Box>
        {data.urlOptionLabel !== undefined && (
          <Grid container spacing={1}>
            <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
              {renderItem('urlOptionLabel', 'Label')}
            </Grid>
            <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
              {renderItem('urlOptionLink', 'Link')}
            </Grid>
          </Grid>
        )}
      </Paper>
      <Paper elevation={2} sx={{ p: 1, mt: 1 }}>
        <Expander expand={expander} setExpand={setExpander} item="address" title="Address" />
        {expander === "address" && (
          <Grid container spacing={1}>
            <Grid item sm={8} xs={12} style={{paddingTop: 0}}>
              {renderItem('address', 'Address')}
            </Grid>
            <Grid item sm={4} xs={6} style={{paddingTop: 0}}>
              {renderItem('city', 'City')}
            </Grid>
            <Grid item sm={4} xs={6} style={{paddingTop: 0}}>
              {renderItem('zip', 'Zip code')}
            </Grid>
            <Grid item sm={4} xs={6} style={{paddingTop: 0}}>
              {renderItem('state', 'State/Province')}
            </Grid>
            <Grid item sm={4} xs={6} style={{paddingTop: 0}}>
              {renderItem('country', 'Country')}
            </Grid>
          </Grid>
        )}
      </Paper>
      <Paper elevation={2} sx={{ p: 1, mt: 1 }}>
        <Expander expand={expander} setExpand={setExpander} item="opening" title="Opening Time" />
        {expander === "opening" && <RenderOpeningTime data={data} setData={setData} />}
      </Paper>
      <Paper elevation={2} sx={{ p: 1, my: 1 }}>
        <Expander expand={expander} setExpand={setExpander} item="easiness" title="Business Easiness" />
        {expander === "easiness" && <RenderEasiness data={data} setData={setData} />}
      </Paper>
      <Paper elevation={2} sx={{ p: 1, mt: 1 }}>
        <Expander expand={expander} setExpand={setExpander} item="socials" title="Social networks" />
        {expander === "socials" && (
          <Grid item xs={12}>
            <RenderSocials data={data} setData={setData} />
          </Grid>
        )}
      </Paper>
    </Common>
  );
}
