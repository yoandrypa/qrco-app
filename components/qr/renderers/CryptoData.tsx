/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useCallback } from 'react'
import Grid from '@mui/material/Grid'
import { Autocomplete, Typography } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'
import Image from 'next/image'
import TextField from '@mui/material/TextField'
import { validate, getCurrencies } from 'crypto-address-validator-ts'
import Alert from '@mui/material/Alert'
import Common from '../helperComponents/Common'
import AddIcon from '@mui/icons-material/Add';

type CryptoDataProps = {
    data: {
        urlOptionLabel?: string,// BlockChain indentifier "BTC", "USDT", etc
        message?: string, // Optional message
        subject?: string; // wallet Address
        value?: string;
    },
    setData: Function,
    setIsWrong: Function,
    handleValues: Function
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
        label: "Not in the list",
        value: "add"
    },

]

const currencyList = getCurrencies();

function CryptoData({ setIsWrong, data, handleValues }: CryptoDataProps) {
    const [blockchainInput, setBlockchainInput] = useState(supportedBlockChains[0])
    const [walletInput, setWalletInput] = useState<string>('');
    const [messageInput, setMessageInput] = useState<string>('');
    const [isWalletValid, setIsWalletValid] = useState<boolean>(false)
    const [isAddressVisited, setIsAddressVisited] = useState<boolean>(false)

    const handleCryptoChange = (event: any, newValue: { label: string, value: string } | null) => {
        setBlockchainInput(newValue || supportedBlockChains[0])//BTC
        if (isAddressVisited && newValue?.value != 'add') setIsWalletValid(validateAddress(walletInput, newValue?.value.toLocaleLowerCase() || 'btc'))
        handleValues('urlOptionLabel')(event)
    }

    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWalletInput(event.target.value)
        setIsWalletValid(validateAddress(event.target.value, blockchainInput.value.toLocaleLowerCase()))
        handleValues('subject')(event)
    }

    const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(event.target.value)
        handleValues('message')(event)
    }

    const validateAddress = (address: string, currency: string): boolean => {
        if (currency === 'add') return true;
        if (!currencyList.some(el => el.symbol === currency)) return false;
        return validate(address, currency.toLocaleLowerCase(), { networkType: 'both', chainType: 'Bech32' })
    }

    useEffect(() => {
        setIsWrong(walletInput.length === 0)
    }, [walletInput, setIsWrong])

    // useEffect(() => {
    //     const temp = { ...data }
    //     temp['message'] = messageInput.trim()
    //     temp['subject'] = walletInput
    //     temp['urlOptionLabel'] = blockchainInput.value
    //     setData(temp)
    //     console.log('saving data in context')
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [walletInput, messageInput, blockchainInput])

    return (
        <Common msg="Crypto Payment Link">
            <Grid container sx={{ marginTop: 2 }}>
                <Autocomplete
                    value={blockchainInput}
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
                            {option.value == 'add' ? (
                                <AddIcon />
                            ) : (
                                <Image
                                    style={{ marginRight: 2, flexShrink: 0 }}
                                    height={20}
                                    loading="lazy"
                                    width={20}
                                    src={`/images/crypto-logos/${option.value.toLowerCase()}.svg`}
                                    // srcSet={`images/${option.value.toLowerCase()}.png`}
                                    alt=""
                                />
                            )}
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
                                    startAdornment: blockchainInput ? (
                                        <InputAdornment position="start">
                                            {blockchainInput.value == 'add' ? (
                                                <AddIcon />
                                            ) : (
                                                <Image
                                                    style={{ marginRight: 2, flexShrink: 0 }}
                                                    height={20}
                                                    loading="lazy"
                                                    width={20}
                                                    src={`/images/crypto-logos/${blockchainInput.value.toLowerCase()}.svg`}
                                                    // srcSet={`images/${value.value.toLowerCase()}.png`}
                                                    alt=""
                                                />
                                            )}

                                        </InputAdornment>
                                    ) : null
                                }}
                            />
                        );
                    }}
                />

            </Grid>
            <Grid>
                {(!isWalletValid && walletInput.length > 0) && <Alert severity='info' sx={{ marginTop: 1 }}>
                    Double check this, this wallet address seems to be invalid. You can still send this address anyway. This warning won&apos;t be shown on the QR view.
                </Alert>}
                <TextField
                    error={walletInput.length === 0}
                    sx={{ marginTop: 2 }}
                    label="Address"
                    size="small"
                    fullWidth
                    margin="dense"
                    value={data.subject || walletInput}
                    onChange={handleAddressChange}
                    onBlur={() => setIsAddressVisited(true)}
                    InputProps={{
                        endAdornment: (
                            !walletInput.trim().length ? (
                                <InputAdornment position="end">
                                    <Typography color="error">{'REQUIRED'}</Typography>
                                </InputAdornment>
                            ) : null
                        )
                    }}
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
                value={data.message || messageInput} />
        </Common>
    )
}

export default CryptoData