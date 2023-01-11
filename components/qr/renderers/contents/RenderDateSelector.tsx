import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DataType } from "../../types/types";

interface DateSelProps {
  data: DataType;
  setData: Function;
  label: string;
}

const RenderDateSelector = ({label, data, setData}: DateSelProps) => {
  const setValue = (value: Date) => {
    setData({...data, value: `${value.getTime()}`});
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={data.value ? new Date(+data.value) : new Date()}
        onChange={(newValue) => {
          // @ts-ignore
          setValue(newValue);
        }}
        renderInput={(params) => <TextField {...params} size="small" fullWidth margin="dense" />}
      />
    </LocalizationProvider>
  );
};

export default RenderDateSelector;
