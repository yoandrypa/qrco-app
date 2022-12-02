import React, { useEffect, useState, useContext } from 'react'
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
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { DataType } from '../types/types';
import Common from '../helperComponents/Common';
import Link from 'next/link';
const DEVELOPMENT = process.env.REACT_NODE_ENV === 'develop' ? true : false

type SendMeMoneyProps = {
    setData: (value: DataType) => void;
    setIsWrong: (isWrong: boolean) => void;
    data: {
        title?: string,//product name
        message?: string,//description
        donationUnitAmount?: number,//price amount
        urlOptionLabel?: string
    },
    handleValues: Function
}

const SendMeMoneyData = ({ data, handleValues, setIsWrong }: SendMeMoneyProps) => {
    const [amountValue, setAmountValue] = useState<string>('1.00');
    // @ts-ignore
    // const { setIsWrong } = useContext(Context);

    useEffect(() => {
        setIsWrong(!data['title'])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])
    return (
        <>
            <Common msg='Receive payments worldwide'>
                <Alert severity='info' sx={{ marginTop: 2 }} >
                    <Typography sx={{ display: { xs: "none", md: "block" } }}>
                        {"For payout your funds to a credit card o bank account you'll "}
                        {"need a Payoneer or Stripe account. You can change your payout options "}
                        <span style={{ color: "blue" }}><Link href={(DEVELOPMENT ? 'https://dev-app.' : 'https://app.') + 'ebanux.com/onboarding'}>here.</Link></span>
                        {" For more information contact us at "}
                        <span style={{ color: "blue" }}><Link href='mailto:info@ebanux.com'>info@ebanux.com</Link></span>
                    </Typography>
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
                        </FormGroup>
                        <Grid container>
                            <Grid item xs={10}>
                                <FormControl>
                                    <FormControlLabel control={<Switch />}
                                        label="Add transaction fees to the final price" />
                                </FormControl>
                            </Grid>
                            <Grid xs={2} item marginTop={1}>
                                <Tooltip title='Transaction fees are 4% plus 0.30 cents'>
                                    <InfoIcon color='info' />
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Common>
        </>
    )
}

export default SendMeMoneyData