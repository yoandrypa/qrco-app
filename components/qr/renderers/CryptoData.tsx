/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import { Autocomplete, Typography } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'
import Image from 'next/image'
import TextField from '@mui/material/TextField'
import { validate, getCurrencies } from 'crypto-address-validator-ts'
import Alert from '@mui/material/Alert'

type Props = {
    data: {
        urlOptionLabel?: string,// BlockChain indentifier "BTC", "USDT", etc
        message?: string, // Optional message
        subject?: string; // wallet Address
    },
    setData: Function,
    setIsWrong: Function
}

const supportedBlockChains = [
    {
        label: "Bitcoin (BTC)",
        value: "BTC"
    },
    {
        label: "Bitcoin Cash (BCH)",
        value: "BCH"
    },
    {
        label: "Binance USD (BUSD)",
        value: "BUSD"
    },
    {
        label: "USD Coin (USDC)",
        value: "USDC"
    },

    {
        label: "Ethereum (ETH)",
        value: "ETH"
    },
    {
        label: "Tether (USDT)",
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
        label: "Not in this list",
        value: "add"
    },

]

const currencyList = getCurrencies();

function CryptoData({ setIsWrong }: Props) {



    const handleCryptoChange = (event: any, newValue: { label: string, value: string } | null) => {
        setValue(newValue || {
            label: "Bitcoin (BTC)",
            value: "BTC"
        })
        const supported = currencyList.find((obj) => {
            return obj.symbol === value.value;
        });
        console.log(supported)
        // if (addressInput.trim().length > 0 && isAddressVisited) {
        //     console.log(validateAddress(addressInput, newValue?.value || 'BTC'))
        // }
    }

    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddressInput(event.target.value)
        console.log(event.target.value, value.value.toLocaleLowerCase())
        // console.log(validate(event.target.value, value.value.toLocaleLowerCase(), { networkType: 'prod', chainType: 'Bech32' }))
    }

    const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(event.target.value)
    }

    const validateAddress = (address: string, currency: string): boolean => {
        return validate(address, currency.toLocaleLowerCase(), { networkType: 'prod', chainType: 'Bech32' })
    }

    const [value, setValue] = useState(supportedBlockChains[0])
    const [addressInput, setAddressInput] = useState<string>('');
    const [messageInput, setMessageInput] = useState<string>('');
    const [isWalletInvalid, setIsWalletInvalid] = useState<boolean>(false)
    const [isAddressVisited, setIsAddressVisited] = useState<boolean>(false)

    useEffect(() => {
        if (isAddressVisited) {
            setIsWrong(validateAddress(addressInput, value.value))
        }

    },
        [addressInput, isAddressVisited, setIsWrong, value.value]);


    return (
        <>
            <Grid container sx={{ marginTop: 2 }}>
                <Autocomplete
                    value={value}
                    onChange={handleCryptoChange}
                    fullWidth
                    id="blockchain-select"
                    size="small"
                    options={supportedBlockChains}
                    autoHighlight
                    getOptionLabel={(option,) => `${option.label}`}
                    isOptionEqualToValue={(option, value) => option.value === value.value}
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
                {isWalletInvalid && <Alert severity='info' >
                    Double check this, this wallet address seems to be invalid. You can still send this address anyway. This warning won&apos;t be shown on the QR view.
                </Alert>}
                <TextField
                    sx={{ marginTop: 2 }}
                    label="Address"
                    size="small"
                    fullWidth
                    margin="dense"
                    value={addressInput}
                    onChange={handleAddressChange}
                    onBlur={() => setIsAddressVisited(true)}
                />
            </Grid>
            <TextField
                rows={3}
                multiline={true}
                onChange={handleMessageChange}
                label="Additional information (Optional)"
                size="small"
                fullWidth
                margin="dense"
                value={messageInput} />
        </>
    )
}

export default CryptoData