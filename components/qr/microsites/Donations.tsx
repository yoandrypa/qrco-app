import { ChangeEvent, useMemo, useState } from "react";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { getColors } from "./renderers/helper";
import { ColorTypes } from "../types/types";
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import SvgIcon from '@mui/material/SvgIcon'
import Box from '@mui/material/Box'
import { TextField } from "@mui/material";
import Axios from 'axios'
import MainMicrosite from "./MainMicrosite";


import { Amplify, Auth } from "aws-amplify";
import awsExports from "../../../libs/aws/aws-exports";

interface DonationsProps {
  newData: any;
}

Amplify.configure(awsExports);

Auth.currentSession().then(res=>{
  let accessToken = res.getAccessToken()
  let jwt = accessToken.getJwtToken()
  //You can print them to see the full objects
  // console.log(`myAccessToken: ${JSON.stringify(accessToken)}`)
  // console.log(`myJwt: ${jwt}`)
})


type BoxOptions = 'first' | 'second' | 'third' | 'input';

export default function DonationsInfo({ newData }: DonationsProps) {
  const colors = useMemo(() => (getColors(newData)), []) as ColorTypes; // eslint-disable-line react-hooks/exhaustive-deps
  const [selectedBox, setSelectedBox] = useState<BoxOptions>('first')
  const [inputValue, setInputValue] = useState<string>('5')
  const [donationAmount, setDonationAmount] = useState<number>(5)

  const handleBoxClick = (box: BoxOptions) => {
    if (box === 'first') {
      setSelectedBox('first')
      setDonationAmount(newData.donationUnitAmount || 1)
    }
    if (box === 'second') {
      setSelectedBox('second')
      setDonationAmount(3 * (newData.donationUnitAmount || 1))
    }
    if (box === 'third') {
      setSelectedBox('third')
      setDonationAmount(5 * (newData.donationUnitAmount || 1))
    }
    if (box === 'input') {
      setSelectedBox('input')
      setDonationAmount(parseInt(inputValue) * (newData.donationUnitAmount || 1))
    }

  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>)=>{
    if (parseInt(inputValue,10) < 5){
      console.log(inputValue + 'menor que 5'+ event.target.value)
      setInputValue('5')
      setDonationAmount(5 * (newData.donationUnitAmount || 1))

    } else {
      setInputValue(event.target.value)
      setDonationAmount(parseInt(inputValue) * (newData.donationUnitAmount || 1))
    }
    
  }

  const handleClick = ()=>{

  }

  const theme = createTheme({
    palette: {
      primary: {
        // light: will be calculated from palette.primary.main,
        main: colors.p,
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main

      },
      secondary: {
        // light: '#0066ff',
        main: colors.p,
        // dark: will be calculated from palette.secondary.main,
        contrastText: colors.s,
      },

      // Used by `getContrastText()` to maximize the contrast between
      // the background and the text.
      contrastThreshold: 3,
      // Used by the functions below to shift a color's luminance by approximately
      // two indexes within its tonal palette.
      // E.g., shift from Red 500 to Red 300 or Red 700.
      tonalOffset: 0.2,
    },
  });



  return (
    //TODO
    <MainMicrosite>
    <CardContent>
      <Grid container
        display='flex'
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Grid item  sx={{ RoundedCorner: 2 }} >
          <Typography variant='h6' textAlign={'center'} padding={0} marginTop={2}>{newData?.title}</Typography>
          <Typography variant='h6' textAlign={'center'}>Would you like to buy me a coffie?</Typography>
          {/* <Stack direction="row" sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', alignSelf: 'center' }}>
            <Avatar
              alt="Avatar"
              src="https://images.unsplash.com/photo-1518057111178-44a106bad636?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80"
              sx={{ width: 100, height: 100, }}
            />
          </Stack> */}

        </Grid>
        <Grid container sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
          <Typography>
            {newData?.message}
          </Typography>
        </Grid>
        <Grid container sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', alignContent: 'center' }}>

          <Typography>
            {newData?.web}
          </Typography>
        </Grid>

        <Grid spacing={1} container sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
          <Grid item>
            <Box sx={{ width: 35, height: 35, display: 'flex', justifyContent: 'center', alignContent: 'center', margin: 'auto' }} >
              <SvgIcon sx={{ width: 35, height: 35 }}>
                <EmojiFoodBeverageIcon color='primary' />
              </SvgIcon>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{ width: 35, height: 35, display: 'flex', justifyContent: 'center', alignContent: 'center', margin: 'auto' }} >
              <Typography textAlign='center' sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', margin: 'auto' }}>
                x
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box
              onClick={() => handleBoxClick('first')}
              sx={{
                borderRadius: 45, borderColor: 'blue', backgroundColor: 'lightblue',
                width: 35, height: 35, display: 'flex', justifyContent: 'center',
                alignContent: 'center', margin: 'auto'
              }}
              border={selectedBox === 'first' ? 2 : 0}
            >
              <Typography textAlign='center' sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', margin: 'auto' }}>
                1
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box
              border={selectedBox === 'second' ? 2 : 0}
              onClick={() => handleBoxClick('second')}
              sx={{ borderRadius: 45, borderColor: 'blue', backgroundColor: 'lightblue', width: 35, height: 35, display: 'flex', justifyContent: 'center', alignContent: 'center', margin: 'auto' }} >
              <Typography textAlign='center' sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', margin: 'auto' }}>
                3
              </Typography>
            </Box>
          </Grid>
          <Grid item >
            <Box
              border={selectedBox === 'third' ? 2 : 0}
              onClick={() => handleBoxClick('third')}
              sx={{ borderRadius: 45, borderColor: 'blue', backgroundColor: 'lightblue', width: 35, height: 35, display: 'flex', justifyContent: 'center', alignContent: 'center', margin: 'auto' }}
            >
              <Typography textAlign='center'
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignContent: 'center',
                  margin: 'auto'
                }}>
                5
              </Typography>
            </Box>
          </Grid>

          <Grid item>
            <Box sx={{ width: 35, height: 35, display: 'flex', justifyContent: 'center', alignContent: 'center', margin: 'auto' }} >
              <Typography textAlign='center' sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', margin: 'auto' }}>
                or
              </Typography>
            </Box>
          </Grid>

          <Grid item>
            <TextField
              onFocus={() => handleBoxClick('input')}
              sx={{ width: 80 }}
              //  label='Amount'
              size="small"
              type='number'
              placeholder="25"
              value={inputValue}
              onChange={handleInputChange}
            ></TextField>
          </Grid>

        </Grid>

        <Grid container sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
         { donationAmount && <Typography variant="h6"> Send ${donationAmount} USD</Typography>}
        </Grid>
        <Grid container sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
          <CardActions sx={{ marginTop: 2 }}>
            <Button color="primary" variant="contained" sx={{ borderRadius: 2 }}>
              Donate
            </Button>

          </CardActions>

        </Grid>
      </Grid>
    </CardContent>
    </MainMicrosite>
  );
}
