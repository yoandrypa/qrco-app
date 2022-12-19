import { useMemo, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';

import Common from '../helperComponents/Common';
import { EMAIL, PHONE, ZIP } from '../constants';

import RenderSocials from './helpers/RenderSocials';
import Expander from './helpers/Expander';
import { DataType } from '../types/types';
import { isValidUrl, validate } from '../../../utils';
import RenderTextFields from './helpers/RenderTextFields';
import Topics from './helpers/Topics';
import socialsAreValid from './validator';
import MultipleField from '../helperComponents/MultipleField';

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

  const renderItem = (item: string, label: string) => {
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
      />
    );
  };
  const checkData = () => {};
  useEffect(() => {
    let errors = false;
    if (!data.petName?.trim().length) {
      errors = true;
    } else if (isDynamic) {
      errors = !socialsAreValid(data);
    }
    checkData();

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
          {renderItem('petGender', 'Gender')}
        </Grid>
        <Grid item sm={6} xs={12} style={{ paddingTop: 0 }}>
          {renderItem('petYearOfBirth', 'Year of Birth')}
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
                <Grid item xs={12} style={{ paddingTop: 0 }}>
                  <MultipleField
                    item={{ key: 'otherDetails', label: 'Detail' }}
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
                <Grid item xs={12} style={{ paddingTop: 0 }}>
                  <MultipleField
                    item={{ key: 'urls', label: 'Links', type: 'url' }}
                  />
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
        {isDynamic && (
          <Grid item xs={12}>
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
