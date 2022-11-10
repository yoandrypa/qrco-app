/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import Grid from '@mui/material/Grid'
import { Autocomplete, Typography } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'
import Image from 'next/image'
import TextField from '@mui/material/TextField'


type Props = {
    data: {
        title?: string,
        message?: string,
        web?: string,
    },
    setData: Function,
    setIsWrong: Function
}

const supportedBlockChains = [
    {
        label: " Bitcoin (BTC)",
        value: "BTC"
    },
    {
        label: " Bitcoin Cash (BCH)",
        value: "BCH"
    },
    {
        label: " Binance USD (BUSD)",
        value: "BUSD"
    },
    {
        label: " USD Coin (USDC)",
        value: "USDC"
    },

    {
        label: " Ethereum (ETH)",
        value: "ETH"
    },
    {
        label: " Tether (USDT)",
        value: "USDT"
    },
    {
        label: "LiteCoin (LTC)",
        value: "LTC"
    },
    {
        label: "TON (TON)",
        value: "TON"
    },
    {
        label: "TRX (TRX)",
        value: "TRX"
    },
    {
        label: "Another",
        value: "add"
    },

]


function CryptoData({ }: Props) {
    const handleCryptoChange = (event: any, newValue: { label: string, value: string } | null) => {
        //TODO
    }

    const [value, setValue] = useState(supportedBlockChains[0])

    return (
        <>
            <Grid container>

                <Autocomplete
                    value={value}
                    onChange={handleCryptoChange}
                    fullWidth
                    id="country-select-demo"
                    // sx={{ maxWidth: 500, margin: 1 }}
                    size="small"
                    options={supportedBlockChains}
                    autoHighlight
                    getOptionLabel={(option) => `${option.label}`}
                    renderOption={(props, option) => (
                        <Box
                            component="li"
                            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                            {...props}
                        >

                            <Image
                                style={{ marginRight: 2, flexShrink: 0 }}
                                height={20}
                                loading="lazy"
                                width={20}
                                src={`/images/crypto-logos/${option.value.toLowerCase()}.svg`}
                                // srcSet={`images/${option.value.toLowerCase()}.png`}
                                alt=""
                            />
                            {option.label}
                        </Box>
                    )}
                    renderInput={(params) => {
                        return (
                            <TextField
                                {...params}
                                label="Choose a Blockchain"

                                inputProps={{
                                    ...params.inputProps,
                                    autoComplete: "new-password" // disable autocomplete and autofill
                                }}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: value ? (
                                        <InputAdornment position="start">
                                            <Image
                                                style={{ marginRight: 2, flexShrink: 0 }}
                                                height={20}
                                                loading="lazy"
                                                width={20}
                                                src={`/images/crypto-logos/${value.value.toLowerCase()}.svg`}
                                                // srcSet={`images/${value.value.toLowerCase()}.png`}
                                                alt=""
                                            />
                                        </InputAdornment>
                                    ) : null
                                }}
                            />
                        );
                    }}
                />

            </Grid>
            <Grid>
                <TextField
                    sx={{ marginTop: 2 }}
                    label="Address"
                    size="small"
                    fullWidth
                    margin="dense"
                    value={''}
                />
            </Grid>
            <TextField
                rows={3}
                multiline={true}
                label="Additional information (Optional)"
                size="small"
                fullWidth
                margin="dense"
                value='' />
        </>
    )
}

export default CryptoData