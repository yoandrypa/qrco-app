import {ChangeEvent} from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {Type} from "../../types/types";

interface DateSelProps {
  index: number;
  data?: Type;
  handleValues: Function;
  label: string;
}

const RenderDateSelector = ({label, data, handleValues, index}: DateSelProps) => {
  const setValue = (prop: string, value: Date | boolean) => {
    handleValues(prop, index)(value instanceof Date ? `${value.getTime()}` : !value);
  }

  return (
    <Box sx={{display: 'flex', flexDirection: {xs: 'column', sm: 'row'}}}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          minDate={new Date(0)}
          label={label}
          value={data?.value ? new Date(+data.value) : new Date()} // @ts-ignore
          onChange={(newValue) => setValue('value', newValue)}
          renderInput={(params) => <TextField {...params} size="small" fullWidth margin="dense"/>}
        />
      </LocalizationProvider>
      <FormControlLabel sx={{width: '165px', ml: {xs: 0, sm: '10px'}}} label="Long date" control={
        <Switch checked={data?.shortDateFormat === undefined ? true : !data.shortDateFormat} inputProps={{'aria-label': 'longDate'}}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setValue('shortDateFormat', event.target.checked)}/>}
      />
    </Box>
  );
};

export default RenderDateSelector;
