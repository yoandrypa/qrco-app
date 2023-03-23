import React, { ChangeEvent, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Autocomplete, SvgIcon, Tooltip } from '@mui/material';
import Common from '../helperComponents/Common'
import Alert from '@mui/material/Alert';
import { isValidUrl } from "../../../utils";
import CoffeeIcon from '@mui/icons-material/Coffee';
import RenderProposalsTextFields from './helpers/RenderProposalsTextFields';
import Box from '@mui/material/Box';

export interface DonationsProps {
  data: {
    title?: string,
    avatarImage?: string,
    message?: string,
    web?: string,
    unitAmount?: number,
    priceId?: string,
    urlOptionLabel?: string,
    email?: string
  },
  setData: Function,
  setIsWrong: Function,
  handleValues: Function
}

type Options = 'message' | 'title' | 'avatarImage' |
  'web' | 'unitAmount' | 'urlOptionLabel'

const options = ['Donate', 'Contribute', 'Give'];

const DonationsData = ({ data, setData, setIsWrong, handleValues }: DonationsProps) => {

  const [webError, setWebError] = useState<boolean>(false)
  const [coffeePrice, setCoffeePrice] = useState<number>(1)
  const [inputButtonValue, setInputButtonValue] = React.useState('');


  useEffect(() => {
    const temp = { ...data }
    if (coffeePrice < 1) {
      setCoffeePrice(1)
      temp["unitAmount"] = 1
    } else if (coffeePrice > 100) {
      setCoffeePrice(100)
      temp["unitAmount"] = 100

    } else {
      temp["unitAmount"] = coffeePrice
    }

  }
    , [coffeePrice, data, inputButtonValue])

  useEffect(() => {
    const temp = { ...data }
    temp["urlOptionLabel"] = inputButtonValue
  }, [inputButtonValue, data])

  const handleValuesBefore = (item: Options) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const temp = { ...data };
    if (item === "web") {
      if (value.length > 0) {
        setWebError(!isValidUrl(value))
        setIsWrong(webError)
      } else {
        setIsWrong(false);
        setWebError(false);
      }

    }
    if (value.length) {
      if (item === 'unitAmount') {
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
        <Grid item xs={12} sm={6}>
          <TextField label='Your Name'
            fullWidth
            sx={{ marginTop: 2 }}
            placeholder='Paul Smith'
            value={data?.title || ''}
            onChange={handleValuesBefore('title')}
            size='small'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ width: '100%', mt: 1 }}>
            <RenderProposalsTextFields
              options={['Donate', 'Give', 'Contribute']}
              //@ts-ignore
              value={data?.urlOptionLabel}
              label='Button text'
              // isError={isError}
              handleValues={handleValues('urlOptionLabel')}
            />
          </Box>
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
          onChange={handleValuesBefore('message')}
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
        <Grid item sm={8} xs={12}>
          <Tooltip title={webError ? 'If set, the URL must be valid' : ''}>
            <TextField label='Website or social link'
              fullWidth
              sx={{ marginTop: 2 }}
              value={data?.web || ''}
              onChange={handleValuesBefore('web')}
              onBlur={handleWebInputBlur}
              error={webError}
              size='small'
            />
          </Tooltip>

        </Grid>
        <Grid item sm={4} xs={12}>
          <Grid item sx={{ marginTop: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <SvgIcon sx={{ marginTop: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CoffeeIcon color='primary' />
                </SvgIcon>
              </Grid>
              <Grid item xs={10}>
                <TextField
                  inputProps={{ inputMode: 'numeric', step: "any", min: 1, max: 100, pattern: ' ^[-,0-9]+$' }}
                  type='number'
                  fullWidth
                  label='Coffee Price'
                  sx={{ marginBottom: 2 }}
                  placeholder='10'
                  size='small'
                  value={coffeePrice}
                  onChange={handleValuesBefore('unitAmount')}
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