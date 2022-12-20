import { useMemo, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';

import Common from '../helperComponents/Common';
import { EMAIL, PHONE, YEAR, ZIP } from '../constants';

import RenderSocials from './helpers/RenderSocials';
import Expander from './helpers/Expander';
import { DataType } from '../types/types';
import { isValidUrl, validate } from '../../../utils';
import RenderTextFields from './helpers/RenderTextFields';
import Topics from './helpers/Topics';
import socialsAreValid from './validator';
import MultipleField from '../helperComponents/MultipleField';
import RenderSelectField from './helpers/RenderSelectField';

interface PetIdDataProps {
  data: DataType;
  handlePayload: Function;
  handleValues: Function;
  setIsWrong: (isWrong: boolean) => void;
}

interface RenderType {
  key: 'otherDetails' | 'urls';
}

export default function PetIdData({
  data,
  handlePayload,
  handleValues,
  setIsWrong
}: PetIdDataProps) {
  const [expander, setExpander] = useState<string | null>(null);

  const isDynamic = useMemo(() => Boolean(data?.isDynamic), []) as boolean; // eslint-disable-line react-hooks/exhaustive-deps
  const genders = [
    {
      value:'male',
      label:'Male'
    },
    {
      value:'female',
      label:'Female'
    },
    {
      value:'other',
      label:'Other'
    }
    ];
  const renderSelectItem = (item: string, label: string, options: {value: string, label: string}[], whatSave?:'label'|'value' ) => {
    let isError = false as boolean;
    // @ts-ignore
    const value = data?.[item] || ('' as string);

    return (<RenderSelectField item={item} label={label} isError={isError} value={value} handleValues={handleValues} options={options} whatSave={whatSave} /> )
  }



  const renderItem = (item: string, label: string, placeholder?:string) => {
    let isError = false as boolean;
    // @ts-ignore
    const value = data?.[item] || ('' as string);

    if (value.trim().length) {
      if (['phone', 'fax'].includes(item) && !PHONE.test(value)) {
        isError = true;
      } else if (item === 'cell' && !PHONE.test(value)) {
        isError = true;
      } else if (item === 'zip' && !ZIP.test(value)) {
        isError = true;
      } else if (item === 'website' && !isValidUrl(value)) {
        isError = true;
      } else if (item === 'email' && !EMAIL.test(value)) {
        isError = true;
      }else if (item === 'petYearOfBirth' && !YEAR.test(value)) {
        isError = true;
      }

    }

    return (
      <RenderTextFields
        item={item}
        label={label}
        isError={isError}
        value={value}
        handleValues={handleValues}
        required={item === 'petName'}
        placeholder={placeholder}
      />
    );
  };
  const checkData = () => {
    let band = false;
    if (!data?.petName?.trim().length) 
      band = true;
    
    if(data?.petYearOfBirth && !YEAR.test(data?.petYearOfBirth))
      band = true;
    
    if(data?.phone && !PHONE.test(data?.phone))
      band = true;
    
    if(data?.fax && !PHONE.test(data?.fax))
      band = true;
    
    if(data?.website && !isValidUrl(data?.website))
      band = true;
    
    if(data?.email && !EMAIL.test(data?.email))
      band = true;
    
    if(data?.zip && !ZIP.test(data?.zip))
      band = true;
    
    if( data?.urls && data.urls.items?.length > 0)
      data.urls.items.forEach((url: any) => {
        if (!isValidUrl(url.value) || !url.value.trim().length) {
          band = true;
        }
      });
    if( data?.otherDetails && data.otherDetails.items?.length > 0)
      data.otherDetails.items.forEach((detail: any) => {
        if (!detail.value.trim().length) {
          band = true;
        }
      });
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
    <Common msg="Your Pet Information">
      <Topics message={'Presentation'} />
      <Grid container spacing={1} sx={{mt:1}}>
        <Grid item sm={6} xs={12} style={{ paddingTop: 0 }}>
          {renderItem('petName', 'Name')}
        </Grid>
        <Grid item sm={6} xs={12} style={{ paddingTop: 0 }}>
          {renderItem('petBreed', 'Breed')}
        </Grid>
        <Grid item sm={6} xs={12} style={{ paddingTop: 0 }}>
          {renderSelectItem('petGender','Gender', genders, 'label')}
        </Grid>
        <Grid item sm={6} xs={12} style={{ paddingTop: 0 }}>
          {renderItem('petYearOfBirth', 'Year of Birth', 'YYYY')}
        </Grid>
      </Grid>
      <Topics message={'Description Title'} />
      <Grid container spacing={1} sx={{mt:1}}>
        <Grid item sm={6} xs={12} style={{ paddingTop: 0 }}>
          {renderItem('title', 'Title')}
        </Grid>
        <Grid item sm={6} xs={12} style={{ paddingTop: 0 }}>
          {renderItem('titleText', 'Description')}
        </Grid>
      </Grid>
      <Topics message={'Contact'} />
      <Grid container spacing={1} sx={{mt:1}}>
        <Grid item sm={4} xs={12} style={{ paddingTop: 0 }}>
          {renderItem('contactTitle', 'Title')}
        </Grid>
        <Grid item sm={4} xs={12} style={{ paddingTop: 0 }}>
          {renderItem('name', 'Name')}
        </Grid>
        <Grid item sm={4} xs={12} style={{ paddingTop: 0 }}>
          {renderItem('phone', 'Cell number')}
        </Grid>
        <Grid item sm={4} xs={12} style={{ paddingTop: 0 }}>
          {renderItem('fax', 'Fax')}
        </Grid>
        <Grid item sm={4} xs={12} style={{ paddingTop: 0 }}>
          {renderItem('email', 'Email')}
        </Grid>
        <Grid item sm={4} xs={6} style={{ paddingTop: 0 }}>
          {renderItem('website', 'Website')}
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12} sx={{ p: 1 }}>
          <Paper elevation={2} sx={{ p: 1, mt: 1 }}>
            <Expander
              expand={expander}
              setExpand={setExpander}
              item="more"
              title="More info"
            />
            {expander === 'more' && (
              <Grid container spacing={1}>
                <Grid item sm={8} xs={12} style={{ paddingTop: 0 }}>
                  {renderItem('address1', 'Address')}
                </Grid>
                <Grid item sm={4} xs={6} style={{ paddingTop: 0 }}>
                  {renderItem('city', 'City')}
                </Grid>
                <Grid item sm={4} xs={6} style={{ paddingTop: 0 }}>
                  {renderItem('zip', 'Zip code')}
                </Grid>
                <Grid item sm={4} xs={6} style={{ paddingTop: 0 }}>
                  {renderItem('state', 'State/Province')}
                </Grid>
                <Grid item sm={4} xs={6} style={{ paddingTop: 0 }}>
                  {renderItem('country', 'Country')}
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12} sx={{p:1}}>
          <Paper elevation={2} sx={{ p: 1, mt: 1 }}>
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
        <Grid item xs={12} sx={{p:1}}>
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
        {isDynamic && (
          <Grid item xs={12} sx={{p:1}}>
            <Divider sx={{ my: 1 }} />
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
            <Divider sx={{ my: 1 }} />
          </Grid>
        )}
      </Grid>
    </Common>
  );
}