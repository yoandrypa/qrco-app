import React, { ChangeEvent, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Autocomplete, SvgIcon, Tooltip } from '@mui/material';
import Common from '../helperComponents/Common'
import Alert from '@mui/material/Alert';
import { isValidUrl } from "../../../utils";
import CoffeeIcon from '@mui/icons-material/Coffee';
export interface DonationsProps {
  data: {
    title?: string,
    avatarImage?: string,
    message?: string,
    web?: string,
    donationUnitAmount?: number,
    donationPriceId?: string,
    donationProductId?: string,
    urlOptionLabel?: string,
    email?: string
  },
  setData: Function,
  setIsWrong: Function
}

type Options = 'message' | 'title' | 'avatarImage' |
  'web' | 'donationUnitAmount' | 'urlOptionLabel'

const options = ['Donate', 'Contribute', 'Give'];

const DonationsData = ({ data, setData, setIsWrong }: DonationsProps) => {

  const [webError, setWebError] = useState<boolean>(false)
  const [coffeePrice, setCoffeePrice] = useState<number>(1)
  const [inputButtonValue, setInputButtonValue] = React.useState('');

  useEffect(() => {
    const temp = { ...data }
    if (coffeePrice < 1) {
      setCoffeePrice(1)
      temp["donationUnitAmount"] = 1
      temp["donationUnitAmount"] = coffeePrice
    } else if (coffeePrice > 100) {
      setCoffeePrice(100)
      temp["donationUnitAmount"] = 100
      temp["donationUnitAmount"] = 100
    } else {
      temp["donationUnitAmount"] = coffeePrice
    }

  }
    , [coffeePrice, data, inputButtonValue])

  useEffect(() => {
    const temp = { ...data }
    temp["urlOptionLabel"] = inputButtonValue
  }, [inputButtonValue, data])

  const handleValues = (item: Options) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const temp = { ...data };
    if (item === "web") {
      setWebError(!isValidUrl(value))
      setIsWrong(webError)
    }
    if (value.length) {
      if (item === 'donationUnitAmount') {
        setCoffeePrice(parseFloat(value))
        if (parseFloat(value) < 1) {
          setIsWrong(true)
        } else {
          temp[item] = parseFloat(value)
          setIsWrong(false)
        }

      }
      // @ts-ignore
      temp[item] = value;
      // @ts-ignore
    } else if (temp[item]) {
      // @ts-ignore
      delete temp[item];
    }
    setData(temp);
  };

  const handleWebInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value.length > 0) {
      setWebError(!isValidUrl(event.target.value));
    } else {
      setWebError(false);
    }
    setIsWrong(webError)
  }

  return (
    <Common msg='Generate a custom QR code for your page and give your supporters a quick and touch-free checkout option.'>
      <Typography variant='h6' marginTop={2}>Customize your donation page</Typography>
      <Grid container spacing={2}>
        <Grid item>
          <TextField label='Your Name'
            fullWidth
            sx={{ marginTop: 2 }}
            placeholder='Paul Smith'
            value={data?.title || ''}
            onChange={handleValues('title')}
            size='small'
          />
        </Grid>
        <Grid item >
          <Autocomplete
            value={data?.urlOptionLabel}
            onChange={(event: any, newValue: string | null) => {
              setInputButtonValue(newValue || '');
            }}
            inputValue={inputButtonValue}
            onInputChange={(event, newInputButtonValue) => {
              setInputButtonValue(newInputButtonValue);
              setData({ ...data, urlOptionLabel: newInputButtonValue })
            }}
            id="donation-button-text"
            options={options}
            sx={{ marginTop: 2 }}
            size='small'
            renderInput={(params) => <TextField {...params} label="Button Text" sx={{ minWidth: 200 }} />}
          />
        </Grid>
      </Grid>
      <Typography marginTop={2}>Add a small text here</Typography>
      <Grid >
        <TextField
          label="Make a good one"
          size="small"
          fullWidth
          margin="dense"
          value={data?.message || ''}
          onChange={handleValues('message')}
          multiline
          placeholder='Would you like to buy me a coffee?'
          rows={5}
        >
        </TextField>
      </Grid>
      <Grid >
        <Alert severity='info' sx={{ mt: 2 }}>
          Note: When you receive a donation, your supporters will be redirected to this website or social link page,
          you can use this to provide some content as a sign of appreciation or just leave it blank and they
          will be redirected to a &quot;thank you page&quot;.
        </Alert>
      </Grid>
      <Grid container spacing={2} >
        <Grid item>
          <Tooltip title={webError ? 'If set, the URL must be valid' : ''}>
            <TextField label='Website or social link'
              sx={{ marginTop: 2, width: 300 }}
              value={data?.web || ''}
              onChange={handleValues('web')}
              onBlur={handleWebInputBlur}
              error={webError}
              size='small'
            />
          </Tooltip>

        </Grid>
        <Grid item>
          <Grid item sx={{ marginTop: 2 }}>
            <Grid container spacing={2}>
              <Grid item>
                <SvgIcon sx={{ marginTop: 1 }}>
                  <CoffeeIcon color='primary' />
                </SvgIcon>
              </Grid>
              <Grid item>
                <TextField
                  inputProps={{ inputMode: 'numeric', step: "any", min: 1, max: 100, pattern: ' ^[-,0-9]+$' }}
                  type='number'
                  label='Coffee Price'
                  sx={{ width: 150, marginBottom: 2 }}
                  placeholder='10'
                  size='small'
                  value={coffeePrice}
                  onChange={handleValues('donationUnitAmount')}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Common>
  )
}

export default DonationsData