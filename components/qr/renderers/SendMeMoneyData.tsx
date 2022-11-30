import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert'
import RenderTextFields from './helpers/RenderTextFields';
import MultiLineDetails from '../helperComponents/MultiLineDetails';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

type Props = {
    setData: Function,
    setIsWrong: Function,
    data: {
        title?: string,
        message?: string,
        donationUnitAmount?: number,//price amount
        urlOptionLabel?: string
    },
    handleValues: Function
}


const SendMeMoneyData = ({ data, setData, setIsWrong, handleValues }: Props) => {
    const [amountValue, setAmountValue] = useState<string>('');

    useEffect(() => {

    }, []);



    return (
        <>
            <Alert severity='info' sx={{ marginTop: 2 }} >
                In order to withdraw your funds to a credit card o bank account you&apos;ll
                need a Payoneer or Stripe account. For more information contact us at info@ebanux.com
            </Alert>
            <Grid container spacing={2} marginTop={2} >
                <Grid item>
                    <Box sx={{ maxWidth: 600 }}>

                        <RenderTextFields
                            required
                            item='title'
                            handleValues={handleValues}
                            value={data?.title || ''}
                            isError={false}
                            label='Product or service name'
                        />

                        <TextField
                            label="Description"
                            size="small"
                            fullWidth
                            sx={{ maxWidth: 600 }}
                            rows={4}
                            multiline
                            margin="dense"
                            value={data?.message || ''}
                            onChange={handleValues('message')} />
                        <MultiLineDetails top={160} data={data?.message || ''} />
                    </Box>
                </Grid>
                <Grid item>
                    <FormGroup>
                        <FormControl sx={{ m: 1, maxWidth: 150 }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                size='small'
                                type='number'
                                inputProps={{ step: '0.01', max: 100, min: 1 }}
                                value={amountValue}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAmountValue((Number.parseFloat(event.target.value)).toFixed(2))}
                                startAdornment={<InputAdornment position="start">(USD)$</InputAdornment>}
                                label="Amount"
                            />
                        </FormControl>

                        <FormControlLabel control={<Switch />}
                            label="Add transaction fees to the final price" />
                    </FormGroup>
                </Grid>
            </Grid>

        </>
    )
}

export default SendMeMoneyData