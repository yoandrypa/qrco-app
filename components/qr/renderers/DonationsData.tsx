import React, {ChangeEvent, useState } from 'react'
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button'
import { Stack, Avatar, SvgIcon } from '@mui/material';
import UploadRounded from '@mui/icons-material/UploadRounded'
import Common from '../helperComponents/Common'
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
interface DonationsProps {
    data: {
      title?: string,
      avatarImage?: string,
      message?: string,
      web?: string,
      donationUnitAmount?: number ,
    },
    setData: Function
}

type Options = 'message' | 'title' |'avatarImage' | 'web' | 'donationUnitAmount'

const  DonationsData = ({data,setData }: DonationsProps) => {
const [isError,setIsError] = useState<boolean>(false)
const [inputAmount, setInputAmount] = useState<string>('1')
  const handleValues = (item: Options) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const temp = { ...data };
    if (value.length) {
      if (value.length) {
        if (item === 'donationUnitAmount'){
          if (parseInt(value) < 1){
            setInputAmount('1')
            setIsError(true)
            temp[item] = 1
            setData(temp);
          } else {
            setInputAmount(value)
            temp[item] = parseInt(value);
            setIsError(false)
            setData(temp);
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
}

  return (
    <Common msg='Generate a custom QR code for your page and give your supporters a quick and touch-free checkout option.'>
    <Paper>  
   <Typography variant='h6' textAlign={'center'} marginTop={2}>Customize your donation page</Typography>    
   <Grid container sx={{ display: 'flex', justifyContent: 'center',alignContent:'center' }}>
    <Grid item>      
    </Grid>
    <Grid item>
    <Stack direction="row" sx={{marginTop:2, display: 'flex', justifyContent: 'center',alignSelf:'center' }}>
      <Avatar        
        alt="avatar"
        src="https://images.unsplash.com/photo-1518057111178-44a106bad636?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80"
        sx={{ width: 100, height: 100,}}
      />
     </Stack> 
    </Grid>
    <Grid item>        
    </Grid>
   </Grid>
   <Grid container sx={{ display: 'flex', justifyContent: 'center',alignContent:'center' }}>
    <Button 
    sx={{marginTop:2, display: 'flex', justifyContent: 'center',alignSelf:'center' }}
    startIcon={<UploadRounded/>}
     variant="outlined">
        Upload Image
    </Button>
    </Grid>

  
   <Grid sx={{display: 'flex', alignItems: "center",
           justifyContent: "center"}}>
   
      <TextField label='Name'
         sx={{marginTop: 2, width:300 }}
         placeholder='Paul Smith'
         value={data?.title || ''}
         onChange={handleValues('title')}
         size='small'
       /> 
     </Grid>

  <Typography textAlign={'center'} marginTop={2}>Add a small text here</Typography>
  <Grid  sx={{display: 'flex', alignItems: "center",
        justifyContent: "center"}}>
  <TextField
        label="Make a good one"
        size="small"
        fullWidth
        margin="dense"
        value={data?.message || ''}
        onChange={handleValues('message')} 
        multiline
        sx={{width: 300, display: 'flex', alignItems: "center",
        justifyContent: "center"}}
        rows={5}
        placeholder='Hey there! Would you like to buy me a coffie?'
       />
  </Grid>
  <Grid 
  sx={{display: 'flex', alignItems: "center",
        justifyContent: "center"}}>

<TextField label='Website or social link'
sx={{marginTop: 2, width:300 }}
placeholder='https://www.example.com'
value={data?.web || ''}
onChange={handleValues('web')}
size='small'
/>   
</Grid>

  <Grid container spacing={2}
    sx={{marginTop: 1,marginBottom:2, display: 'flex', alignItems: "center",justifyContent: "center"}}>
    <Grid item>
   <SvgIcon>
   <EmojiFoodBeverageIcon color='primary'/>
   </SvgIcon>  
   </Grid>
    <Grid item>
    <TextField 
      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} 
      type='number'
      label='Coffie Price' 
      sx={{width: 140, marginBottom:2}}
      placeholder='10'
      size='small'
      value={data.donationUnitAmount?.toString() || inputAmount}
      onChange={handleValues('donationUnitAmount')}
      error={isError}
    />
   {isError && <Typography align='center' color='red'>
    Hey, minimum of $1 for a coffie.
    </Typography>} 
    </Grid>

    </Grid>

   </Paper>
 </Common>
  )
}

export default DonationsData