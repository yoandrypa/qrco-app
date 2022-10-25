import {useMemo, useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Paper from "@mui/material/Paper";

import Common from '../helperComponents/Common';
import {EMAIL, PHONE, SOCIALS, ZIP} from "../constants";

import RenderSocials from "./helpers/RenderSocials";
import Expander from "./helpers/Expander";
import {DataType} from "../types/types";
import {isValidUrl} from "../../../utils";
import RenderTextFields from "./helpers/RenderTextFields";
import Topics from "./helpers/Topics";

interface CardDataProps {
  data: DataType;
  setData: Function;
  handleValues: Function;
  isWrong: boolean;
  setIsWrong: (isWrong: boolean) => void;
}

export default function CardData({data, setData, handleValues, isWrong, setIsWrong}: CardDataProps) {
  const [expander, setExpander] = useState<string | null>(null);

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

    return <RenderTextFields item={item} label={label} isError={isError} value={value} handleValues={handleValues}
                             required={item === 'firstName'}/>;
  };

  useEffect(() => {
    let errors = false;
    if (!data.firstName?.trim().length || (data.phone?.trim().length && !PHONE.test(data.phone)) ||
      (data.fax?.trim().length && !PHONE.test(data.fax)) || (data.cell?.trim().length && !PHONE.test(data.cell)) ||
      (data.zip?.trim().length && !ZIP.test(data.zip)) || (data.web?.trim().length && !isValidUrl(data.web)) ||
      (data.email?.trim().length && !EMAIL.test(data.email))) {
      errors = true;
    } else if (data?.isDynamic) {
      SOCIALS.every((x: string) => {
        // @ts-ignore
        if (data[x] !== undefined && !data[x].trim().length) {
          errors = true;
          return false;
        }
        return true;
      });
    }

    setIsWrong(errors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.firstName, data.phone, data.fax, data.cell, data.zip, data.web, data.email, data.facebook, data.whatsapp, data.twitter, data.instagram, data.linkedin, data.pinterest, data.telegram, data.youtube]);

  return (
    <Common msg="Your contact details. Users can store your info or contact you right away.">
      <Topics message={'Presentation'}/>
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
      <Topics message={'Phones'}/>
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
      <Topics message={'Organization'}/>
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
          <Paper elevation={2} sx={{p: 1, mt: 1}}>
            <Expander expand={expander} setExpand={setExpander} item="other" title="Other info"/>
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
            <Paper elevation={2} sx={{p: 1, mt: 1}}>
              <Expander expand={expander} setExpand={setExpander} item="socials" title="Social information"/>
              {expander === "socials" &&
                <RenderSocials data={data} setData={setData} setIsWrong={setIsWrong} isWrong={isWrong}/>}
            </Paper>
            <Divider sx={{my: 1}}/>
          </Grid>
        )}
      </Grid>
    </Common>
  );
}
