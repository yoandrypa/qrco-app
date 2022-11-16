import React from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { DataType } from '../types/types';


type Props = {
    setData: Function,
    setIsWrong: Function,
    data: DataType
}

const SimplePayLinkData = ({ setData, setIsWrong }: Props) => {

    return (
        <Box sx={{ width: '100%' }}>
        </Box>
    )
}

export default SimplePayLinkData