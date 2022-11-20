import React, { useState } from 'react'
import Box from '@mui/material/Box';
import { DataType } from '../types/types';
import Common from '../helperComponents/Common';
import Alert from '@mui/material/Alert'
import RenderTextFields from './helpers/RenderTextFields';
import MultiLineDetails from '../helperComponents/MultiLineDetails';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography';
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

const SimplePayLinkData = ({ data, setData, setIsWrong, handleValues }: Props) => {
    const [amountValue, setAmountValue] = useState<number>(1);


    return (
        <Common msg='Receive money worldwide.' >
            <Alert severity='info' sx={{ marginTop: 2 }} variant='outlined'>
                In order to payout your funds to a credit card o bank account you&apos;ll
                need a Payoneer or Stripe account.
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
                            label='Name of the product'
                        />
                        <TextField
                            label="Description"
                            size="small"
                            fullWidth
                            sx={{ maxWidth: 600 }}
                            rows={4}
                            multiline
                            required
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
                                value={amountValue}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setAmountValue(parseInt(event.target.value, 10))}
                                startAdornment={<InputAdornment position="start">USD $</InputAdornment>}
                                label="Amount"
                            />
                        </FormControl>
                        <FormControlLabel control={<Switch />}
                            label="Add fees to final price" />
                    </FormGroup>
                </Grid>
            </Grid>

        </Common >
    )
}

export default SimplePayLinkData