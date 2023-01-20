import { useMemo, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';

import Common from '../helperComponents/Common';
import { EMAIL, PHONE, YEAR, ZIP } from '../constants';

import RenderSocials from './contents/RenderSocials';
import Expander from './helpers/Expander';
import { DataType } from '../types/types';
import { isValidUrl, validate } from '../../../utils';
import Topics from './helpers/Topics';
import socialsAreValid from './validator';
import MultipleField from '../helperComponents/MultipleField';
import RenderSelectField from './helpers/RenderSelectField';
import RenderPresentation from './contents/RenderPresentation';
import RenderAddressData from './contents/RenderAddressData';
import RenderContactForm from '../helperComponents/smallpieces/RenderContactForm';
//@ts-ignore
import session from "@ebanux/ebanux-utils/sessionStorage";

interface FindMeDataProps {
  data: DataType;
  handlePayload: Function;
  handleValues: Function;
  setIsWrong: (isWrong: boolean) => void;
}

interface RenderType {
  key: 'otherDetails' | 'urls';
}

export default function FindMeData({
  data,
  handlePayload,
  handleValues,
  setIsWrong
}: FindMeDataProps) {
  const [expander, setExpander] = useState<string | null>(null);
  const { currentAccount } = session;
  const isDynamic = useMemo(() => Boolean(data?.isDynamic), []) as boolean; // eslint-disable-line react-hooks/exhaustive-deps
  
  const renderSelectItem = (item: string, label: string, options: {value: string, label: string}[], whatSave?:'label'|'value' ) => {
    let isError = false as boolean;
    // @ts-ignore
    const value = data?.[item] || ('' as string);

    return (<RenderSelectField item={item} label={label} isError={isError} value={value} handleValues={handleValues} options={options} whatSave={whatSave} /> )
  }

  const checkData = () => { 
    let band = false;
    if (!data?.firstName?.trim().length)
      band = true;

    return band;
  };
  useEffect(() => {
    let errors = false;
    if (checkData()) {
      errors = true;
    } else if (isDynamic) {
      errors = !socialsAreValid(data);
    }


    setIsWrong(errors);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Common msg="Information to make easy to find you">
      <Topics message={'Presentation'} />
      <Grid container spacing={1} sx={{mt:1}}>
        <RenderPresentation data={data} handleValues={handleValues} />
      </Grid>
      <Topics message={'Address'} />
      <Grid container item spacing={1} sx={{mt:1}}>
        <RenderAddressData data={data} handleValues={handleValues} />
      </Grid>
      <Grid container spacing={1} >
        <Grid item xs={12} sx={{ml:-1}}>
          <Paper elevation={2} sx={{ p: 1, mt: 1}}>
            <Expander
              expand={expander}
              setExpand={setExpander}
              item="other"
              title="More Details"
            />
            {expander === 'other' && (
              <Grid container spacing={1}>
                <Grid item xs={12} sx={{ mt:1 }}>
                  <MultipleField
                    item={{ key: 'otherDetails', label: 'Detail', requireValue: true }}
                  />
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sx={{ml:-1}}>
          <Paper elevation={2} sx={{ p: 1, mt: 1 }}>
            <Expander
              expand={expander}
              setExpand={setExpander}
              item="urls"
              title="Links"
            />
            {expander === 'urls' && (
              <Grid container spacing={1}>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <MultipleField
                    item={{ key: 'urls', label: 'URL', type: 'url', requireLabel: true, requireValue: true }}
                  />
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sx={{ml:-1}}>
          <Paper elevation={2} sx={{ p: 1, mt: 1 }}>
            <Expander
              expand={expander}
              setExpand={setExpander}
              item="contactForm"
              title="Contact Form"
            />
            {expander === 'contactForm' && (
              <Grid container spacing={1}>
                <Grid item xs={12} sx={{ mt: 1 }}>
                <RenderContactForm
                  // email={item.email}
                  title={data.contactForm?.title||''}
                  buttonText={data.contactForm?.buttonText||''}
                  messagePlaceholder={data.contactForm?.message||''}
                  handleChange={(type:string, index:number, value:string) => {
                    const newData = {...data};
                    if(!newData.contactForm)
                      newData.contactForm = {type: 'contact', email: currentAccount.email, [type]: value};
                    else
                      newData.contactForm = { ...newData.contactForm, [type]:value }
                    handlePayload(newData);
                    }}
                  index={0}
                />
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
        {isDynamic && (
          <Grid item xs={12} sx={{ml:-1}}>
            <Paper elevation={2} sx={{ p: 1, mt: 1 }}>
              <Expander
                expand={expander}
                setExpand={setExpander}
                item="socials"
                title="Social information"
              />
              {expander === 'socials' && (
                <RenderSocials data={data} setData={handlePayload} />
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
    </Common>
  );
}
