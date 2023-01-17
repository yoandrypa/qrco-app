/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useCallback } from 'react'
import Grid from '@mui/material/Grid'
import { Autocomplete, Typography } from '@mui/material'
import InputAdornment from '@mui/material/InputAdornment'
import Box from '@mui/material/Box'
import Image from 'next/image'
import TextField from '@mui/material/TextField'
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

const btcRegExp = new RegExp('^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$')

const isServer = typeof window === 'undefined'

function CryptoData({ setIsWrong, data, handleValues }: CryptoDataProps) {
    const [blockchainInput, setBlockchainInput] = useState(supportedBlockChains[0])
    const [walletInput, setWalletInput] = useState<string>('');
    const [messageInput, setMessageInput] = useState<string>('');
    const [isWalletValid, setIsWalletValid] = useState<boolean>(false)
    const [isAddressVisited, setIsAddressVisited] = useState<boolean>(false)

    const handleCryptoChange = (event: any, newValue: { label: string, value: string } | null) => {
        setBlockchainInput(newValue || supportedBlockChains[0])//BTC
        handleValues('urlOptionLabel')(event)
        if (isAddressVisited && newValue?.value != 'add') setIsWalletValid(validateAddress(walletInput, newValue?.value.toLocaleLowerCase() || 'btc'))
    }

    const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWalletInput(event.target.value)
        if (isServer) setIsWalletValid(validateAddress(event.target.value, blockchainInput.value.toLocaleLowerCase()))
        handleValues('subject')(event)
    }

    const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessageInput(event.target.value)
        handleValues('message')(event)
    }

    const validateAddress = (address: string, currency: string): boolean => {
        let result;
        switch (currency) {
            case 'btc':
                result = btcRegExp.test(address)
                break;
            default:
                result = true;
                break;
        }
        return result

    }

    useEffect(() => {
        setIsWrong(walletInput.length === 0)
    }, [walletInput, setIsWrong])

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