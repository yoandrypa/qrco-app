import React, { ChangeEvent, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Autocomplete, SvgIcon } from '@mui/material';
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
    urlOptionLabel?: string
  },
  setData: Function,
  setIsWrong: Function
}

type Options = 'message' | 'title' | 'avatarImage' |
  'web' | 'donationUnitAmount' | 'urlOptionLabel'

const options = ['Donate', 'Contribute', 'Give'];

const DonationsData = ({ data, setData, setIsWrong }: DonationsProps) => {

  const [isError, setIsError] = useState<boolean>(false)
  const [webError, setWebError] = useState<boolean>(false)
  const [coffeePrice, setCoffeePrice] = useState<number>(1)
  const [Buttonvalue, setButtonValue] = React.useState<string | null>(options[0]);
  const [inputButtonValue, setInputButtonValue] = React.useState('');

  useEffect(() => {
    const temp = { ...data }
    if (coffeePrice < 1) {
      setCoffeePrice(1)
      temp["donationUnitAmount"] = 1
      temp["donationUnitAmount"] = coffeePrice
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
        setCoffeePrice(parseInt(value))
        if (parseInt(value) < 1) {
          setIsWrong(true)
          setIsError(true)
        } else {
          temp[item] = parseInt(value)
          setIsWrong(false)
          setIsError(false)
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

  async function handleAutocomplete(event: any, newValue: string) {
    console.log(event, newValue);
  }


  return (

    <Common msg='Generate a custom QR code for your page and give your supporters a quick and touch-free checkout option.'>
      <Paper>
        <Typography variant='h6' textAlign={'center'} marginTop={2}>Customize your donation page</Typography>
        <Grid container sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
          <Grid item>
          </Grid>
          <Grid item>
          </Grid>
        </Grid>
        <Grid container sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
        </Grid>
        <Grid sx={{
          display: 'flex', alignItems: "center",
          justifyContent: "center"
        }}>
          <TextField label='Your Name'
            sx={{ marginTop: 2, width: 300 }}
            placeholder='Paul Smith'
            value={data?.title || ''}
            onChange={handleValues('title')}
            size='small'
          />
        </Grid>

        <Typography textAlign={'center'} marginTop={2}>Add a small text here</Typography>
        <Grid sx={{
          display: 'flex', alignItems: "center",
          justifyContent: "center"
        }}>
          <TextField
            label="Make a good one"
            size="small"
            fullWidth
            margin="dense"
            value={data?.message || 'Would you like to buy me a coffee?'}
            onChange={handleValues('message')}
            multiline
            sx={{
              width: 300, display: 'flex', alignItems: "center",
              justifyContent: "center"
            }}
            rows={5}
          >
          </TextField>
        </Grid>
        <Grid sx={{
          display: 'flex', alignItems: "center",
          justifyContent: "center", marginTop: 2
        }}>
          <Autocomplete
            value={data?.urlOptionLabel || 'Donate'}
            onChange={(event: any, newValue: string | null) => {
              setButtonValue(newValue);
            }}
            inputValue={inputButtonValue}
            onInputChange={(event, newInputButtonValue) => {
              setInputButtonValue(newInputButtonValue);
              setData({ ...data, urlOptionLabel: newInputButtonValue })
              console.log('saved')
            }}
            id="donation-button-text"
            options={options}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Button Text" />}
          />
        </Grid>

        <Alert severity='info' sx={{ margin: 2 }}>
          Note: When you receive a donation, your supporters will be redirected to this website or social link page,
          you can use this to provide some content as a sign of appreciation or just leave it blank and they
          will be redirected to a &quot;thank you page&quot;.
        </Alert>
        <Grid
          sx={{
            display: 'flex', alignItems: "center",
            justifyContent: "center"
          }}>
          <TextField label='Website or social link'
            sx={{ marginTop: 2, width: 300 }}
            value={data?.web || ''}
            onChange={handleValues('web')}
            onBlur={handleWebInputBlur}
            error={webError}
            size='small'
          />
        </Grid>

        <Grid container spacing={2}
          sx={{ marginTop: 1, display: 'flex', alignItems: "center", justifyContent: "center" }}>
          <Grid item>
            <SvgIcon>
              <CoffeeIcon color='primary' />
            </SvgIcon>
          </Grid>
          <Grid item>
            <TextField
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              type='number'
              label='Coffee Price'
              sx={{ width: 140, marginBottom: 2 }}
              placeholder='10'
              size='small'
              value={coffeePrice}
              onChange={handleValues('donationUnitAmount')}
              error={isError}
            />

          </Grid>
        </Grid>
        <Grid sx={{ marginBottom: 2, display: 'flex', alignItems: "center", justifyContent: "center" }}>
          {isError && <Typography marginBottom={2} align='center' color='red' variant='caption'>
            Hey, minimum of $1 USD for a coffee.
          </Typography>}
        </Grid>

      </Paper>
    </Common>
  )
}

export default DonationsData