import {ChangeEvent, useMemo, useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from "@mui/material/Paper";

import Common from '../helperComponents/Common';
import {EMAIL, PHONE, SOCIALS, ZIP} from "../constants";

import RenderSocials from "./helpers/RenderSocials";
import Expander from "./helpers/Expander";
import {DataType} from "../types/types";
import {isValidUrl} from "../../../utils";

interface CardDataProps {
  data: DataType;
  setData: Function;
  setIsWrong: (isWrong: boolean) => void;
}

export default function CardData({data, setData, setIsWrong}: CardDataProps) {
  const [expander, setExpander] = useState<string | null>(null);

  const handleValues = (item: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    const tempo = JSON.parse(JSON.stringify(data));
    if (value.length) {
      // @ts-ignore
      tempo[item] = value;
      // @ts-ignore
    } else if (tempo[item]) {
      // @ts-ignore
      delete tempo[item];
    }
    setData(tempo);
  };

  const isDynamic = useMemo(() => Boolean(data?.isDynamic), []) as boolean;  // eslint-disable-line react-hooks/exhaustive-deps

  const renderItem = (item: string, label: string) => {
    let isError = false as boolean;
    // @ts-ignore
    const value = data?.[item] || '' as string;

    if (value.trim().length) {
      if (['phone', 'fax'].includes(item) && !PHONE.test(value)) {
        isError = true;
      } else if (item === 'cell' && !PHONE.test(value)) {
        isError = true;
      } else if (item === 'zip' && !ZIP.test(value)) {
        isError = true;
      } else if (item === 'web' && !isValidUrl(value)) {
        isError = true;
      } else if (item === 'email' && !EMAIL.test(value)) {
        isError = true;
      }
    }

    return (<TextField
      label={label}
      size="small"
      fullWidth
      error={isError}
      margin="dense"
      value={value}
      onChange={handleValues(item)}/>);
  };

  useEffect(() => {
    let errors = false;
    // @ts-ignore
    if (data.phone?.trim().length && !PHONE_FAX.test(data.phone)) {
      errors = true;
    }
    // @ts-ignore
    if (!errors && data.fax?.trim().length && !PHONE_FAX.test(data.fax)) {
      errors = true;
    }
    // @ts-ignore
    if (!errors && data.cell?.trim().length && !PHONE.test(data.cell)) {
      errors = true;
    }
    // @ts-ignore
    if (!errors && data.zip?.trim().length && !ZIP.test(data.zip)) {
      errors = true;
    }
    // @ts-ignore
    if (!errors && data.web?.trim().length && !isValidUrl(data.web)) {
      errors = true;
    }
    // @ts-ignore
    if (!errors && data.email?.trim().length && !EMAIL.test(data.email)) {
      errors = true;
    }

    if (!errors && data?.isDynamic) {
      SOCIALS.every((x: string) => {
        // @ts-ignore
        if (data[x] !== undefined && !data[x].trim().length) {
          errors = true;
          return false;
        }
        return true;
      });
      // if (!errors && (data.web !== undefined && isValidUrl(data.web))) {
      //   errors = true;
      // }
    }

    setIsWrong(errors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.phone, data.fax, data.cell, data.zip, data.web, data.email, data.facebook, data.whatsapp, data.twitter, data.instagram, data.linkedin, data.pinterest, data.telegram, data.youtube]);

  return (
    <Common msg="Your contact details. Users can store your info or contact you right away.">
      <Typography sx={{fontWeight: 'bold'}}>{'Presentation'}</Typography>
      <Grid container spacing={1}>
        <Grid item sm={2} xs={12} style={{paddingTop: 0}}>
          {renderItem('prefix', 'Prefix')}
        </Grid>
        <Grid item sm={5} xs={12} style={{paddingTop: 0}}>
          {renderItem('firstName', 'First name')}
        </Grid>
        <Grid item sm={5} xs={12} style={{paddingTop: 0}}>
          {renderItem('lastName', 'Last name')}
        </Grid>
      </Grid>
      <Typography sx={{fontWeight: 'bold'}}>{'Phones'}</Typography>
      <Grid container spacing={1}>
        <Grid item sm={4} xs={12} style={{paddingTop: 0}}>
          {renderItem('cell', 'Cell number')}
        </Grid>
        <Grid item sm={4} xs={12} style={{paddingTop: 0}}>
          {renderItem('phone', 'Phone number')}
        </Grid>
        <Grid item sm={4} xs={12} style={{paddingTop: 0}}>
          {renderItem('fax', 'Fax')}
        </Grid>
      </Grid>
      <Typography sx={{fontWeight: 'bold'}}>{'Organization'}</Typography>
      <Grid container spacing={1}>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('organization', 'Organization')}
        </Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('position', 'Position')}
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 1, mt: 1 }}>
            <Expander expand={expander} setExpand={setExpander} item="other" title="Other info" />
            {expander === "other" && (
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
                <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
                  {renderItem('email', 'Email')}
                </Grid>
                <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
                  {renderItem('web', 'Web')}
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
        {isDynamic && (
          <Grid item xs={12}>
            <Divider sx={{my: 1}}/>
            <Paper elevation={2} sx={{ p: 1, mt: 1 }}>
              <Expander expand={expander} setExpand={setExpander} item="socials" title="Social information" />
              {expander === "socials" && <RenderSocials data={data} setData={setData}/>}
            </Paper>
            <Divider sx={{my: 1}}/>
          </Grid>
        )}
      </Grid>
    </Common>
  );
}
