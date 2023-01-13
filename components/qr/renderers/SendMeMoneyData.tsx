import React, { useEffect, useState, useContext, ChangeEvent } from 'react'
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


import FileUpload from "react-material-file-upload";
import { ALLOWED_FILE_EXTENSIONS, FILE_LIMITS } from "../../../consts";
import { conjunctMethods, toBytes } from "../../../utils";
import { DataType } from '../types/types';
import Common from '../helperComponents/Common';
import Link from 'next/link';
import { data } from 'cypress/types/jquery';
const DEVELOPMENT = process.env.REACT_NODE_ENV === 'develop' ? true : false

type SendMeMoneyProps = {
    setData: (value: DataType) => void;
    setIsWrong: (isWrong: boolean) => void;
    data: DataType,
    handleValues: Function
}


const SendMeMoneyData = ({ data, handleValues, setIsWrong, setData }: SendMeMoneyProps) => {
    const [amountValue, setAmountValue] = useState<string>('1.00');
    // @ts-ignore
    // const { setIsWrong } = useContext(Context);

    useEffect(() => {
        setIsWrong(!data['title'])
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const amountChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAmountValue((Number.parseFloat(event.target.value)).toFixed(2))
        handleValues('donationUnitAmount')(event);
    }

    const toogleTransactionFee = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        handleValues('state')(checked)
    }

    const handleChange = (files: File[]) => {
        if (!data["files"] || files.length === 0) {
            setData({ ...data, files });
            return;
        }
    }
    const totalFiles = FILE_LIMITS['gallery'].totalFiles;


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
                {/* <Grid container>
                    <Grid item xs={12} sx={{ mt: 1 }}>
                        <FileUpload
                            onChange={handleChange}
                            accept={ALLOWED_FILE_EXTENSIONS['gallery']}
                            // @ts-ignore
                            disabled={data["files"]?.length >= totalFiles}
                            // @ts-ignore
                            value={data["files"]}
                            title="Drag 'n' drop some files here, or click to select Product Image."
                            maxFiles={FILE_LIMITS['gallery'].totalFiles}
                            maxSize={toBytes(FILE_LIMITS['gallery'].totalMbPerFile, "MB")}
                        />
                    </Grid>
                </Grid> */}
                <Grid container spacing={2} marginTop={2} >
                    <Grid item xs={8}>
                        <RenderTextFields
                            required
                            item='title'
                            handleValues={handleValues}
                            value={data?.title || ''}
                            isError={false}
                            label='Product or service name'
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <FormGroup>
                            <FormControl sx={{ m: 1 }} variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-amount"
                                    size='small'
                                    type='number'
                                    inputProps={{ step: '0.01', max: 100, min: 1 }}
                                    value={data.donationUnitAmount || 3.00}
                                    onChange={amountChange}
                                    startAdornment={<InputAdornment position="start">(USD)$</InputAdornment>}
                                    label="Amount"
                                />
                            </FormControl>
                        </FormGroup>
                    </Grid>

                </Grid>
                <Grid container >
                    <TextField
                        label="Description"
                        size="small"
                        fullWidth
                        sx={{ mt: 1 }}
                        rows={4}
                        multiline
                        margin="dense"
                        value={data?.message || ''}
                        onChange={handleValues('message')} />
                    <MultiLineDetails top={160} data={data?.message || ''} />

                </Grid>
                <Grid container>
                    <Grid item>
                        <FormControl>
                            <FormControlLabel control={<Switch onChange={toogleTransactionFee} checked={Boolean(data?.state) || false} />}
                                label="Add transaction fees to the final price" />
                        </FormControl>
                    </Grid>
                    <Grid item marginTop={1}>
                        <Tooltip title='Transaction fees are 4% plus 0.30 cents'>
                            <InfoIcon color='info' />
                        </Tooltip>
                    </Grid>
                </Grid>
            </Common >
        </>
    )
}

export default SendMeMoneyData