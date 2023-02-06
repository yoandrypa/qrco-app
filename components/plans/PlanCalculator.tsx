import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import { SelectChangeEvent } from '@mui/material/Select';

import { QRCODE_PLANS } from '../qr/constants'

function PlanCalculator() {
    //default values corresponding to business plan
    const [plan, setPlan] = useState('business');
    const [qrAmount, setQrAmount] = useState<number>(100)
    const [value, setValue] = useState<number>(15);
    const [discount, setDiscount] = useState<number>(0)

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQrAmount(event.target.value === '' ? 1 : Number(event.target.value));
    };

    const handleBlur = () => {
        if (value < 0) {
            setValue(0);
        } else if (value > 100) {
            setValue(100);
        }
    };

    const handleChange = (event: SelectChangeEvent) => {
        setPlan(event.target.value);

    };

    function CalculateTotal(plan: string, qrAmount: number) {
        let extraQrPrice = 0.12;
        let extraQR = 0;
        let basePrice = 0;
        switch (plan) {
            case 'basic':
                extraQR = qrAmount - QRCODE_PLANS.BASIC.DYNAMIC_QR_LIMIT;
                basePrice = QRCODE_PLANS.BASIC.MONTHLY_PRICE;
                extraQrPrice = QRCODE_PLANS.BASIC.EXTRA_QR_PRICE
                break;
            case 'business':
                extraQR = qrAmount - QRCODE_PLANS.BUSINESS.DYNAMIC_QR_LIMIT;
                basePrice = QRCODE_PLANS.BUSINESS.MONTHLY_PRICE;
                extraQrPrice = QRCODE_PLANS.BUSINESS.EXTRA_QR_PRICE;
                break;
            case 'premium':
                extraQR = qrAmount - QRCODE_PLANS.PREMIUM.DYNAMIC_QR_LIMIT
                basePrice = QRCODE_PLANS.PREMIUM.MONTHLY_PRICE;
                extraQrPrice = QRCODE_PLANS.PREMIUM.EXTRA_QR_PRICE;
                break;
            case 'basic-annual':
                extraQR = qrAmount - QRCODE_PLANS.BASIC.DYNAMIC_QR_LIMIT
                basePrice = QRCODE_PLANS.BASIC.YEARLY_PRICE;
                break;
            case 'business-annual':
                extraQR = qrAmount - QRCODE_PLANS.BUSINESS.DYNAMIC_QR_LIMIT
                basePrice = QRCODE_PLANS.PREMIUM.YEARLY_PRICE;
                break;
            case 'premium-annual':
                extraQR = qrAmount - QRCODE_PLANS.PREMIUM.DYNAMIC_QR_LIMIT
                basePrice = QRCODE_PLANS.PREMIUM.YEARLY_PRICE;
                break;
            default:
                break;
        }
        if (extraQR > 0) return basePrice + (extraQR * extraQrPrice)
        return basePrice;
    }

    useEffect(() => {
        setValue(CalculateTotal(plan, qrAmount));
        if (plan === 'basic-annual') {
            setDiscount(17);
            return;
        }
        if (plan === 'business-annual') {
            setDiscount(25);
            return;
        }
        if (plan === 'premium-annual') {
            setDiscount(34);
            return;
        }
        setDiscount(0);
    }, [qrAmount, plan])
    return (
        <>
            <Grid container alignContent='center' display='flex' spacing={1} justifyContent={'center'}>
                <Grid item sx={{ m: 1 }}>
                    <Typography sx={{ mt: 1 }}>
                        If you subscribe to the
                    </Typography>
                </Grid>

                <Grid item>
                    <FormControl sx={{ mt: 1, minWidth: 100, maxWidth: 120 }}>
                        <Select
                            labelId="plan-calc-select-helper-label"
                            id="plan-calc-select-helper"
                            value={plan}
                            onChange={handleChange}
                            size='small'
                        >
                            {/* <MenuItem value="" disabled>
                                <em>Monthly Plans</em>
                            </MenuItem> */}
                            <MenuItem value='basic'>Basic</MenuItem>
                            <MenuItem value='business'>Business</MenuItem>
                            <MenuItem value='premium'>Premium</MenuItem>
                            {/* <MenuItem value="" disabled> */}
                            {/* <em>Yearly Plans</em>
                            </MenuItem>
                            <MenuItem value='basic-annual'>Basic (17% off)</MenuItem>
                            <MenuItem value='business-annual'>Business (25% off)</MenuItem>
                            <MenuItem value='premium-annual'>Premium (34% off)</MenuItem> */}
                        </Select>
                        {discount > 0 && <FormHelperText>{discount}% Discount</FormHelperText>}
                    </FormControl>
                </Grid>
                <Grid item sx={{ mt: 1 }}>
                    <Typography sx={{ mt: 1 }}>plan and create</Typography>
                </Grid>
                <Grid item sx={{ m: 1 }}>
                    <TextField
                        inputProps={{ inputMode: 'numeric', step: "1", min: 1, pattern: ' ^[-,0-9]+$' }}
                        type='number'
                        sx={{ width: 120 }}
                        placeholder='10'
                        size='small'
                        value={qrAmount}
                        onChange={handleInputChange}
                    />

                </Grid>
                <Grid item sx={{ m: 1 }}>
                    <Typography sx={{ mt: 1 }} textAlign='left'>
                        Dynamic QRs, your bill will be ${Number(value).toFixed(2)}
                    </Typography>
                </Grid>
            </Grid>
        </>
    )
}

export default React.memo(PlanCalculator)