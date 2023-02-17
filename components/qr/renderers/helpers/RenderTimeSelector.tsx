import {Type} from "../../types/types";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import TextField from "@mui/material/TextField";
import {getHM, setHM} from "../../../helpers/generalFunctions";

interface TimeSelProps {
  data?: Type;
  setData: Function;
  day: string;
  index: number;
  ini: boolean;
}

const RenderTimeSelector = ({data, setData, day, ini, index}: TimeSelProps) => {
  // @ts-ignore
  const value = data.openingTime[day][index][ini ? 'ini' : 'end'];

  const setValue = (value: Date) => {
    const dt = {...data};
    // @ts-ignore
    dt.openingTime[day][index][ini ? 'ini' : 'end'] = getHM(value);
    setData(dt);
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <TimePicker
      ampm={data?.is12hours || false}
      value={setHM(value)}
      onChange={(newValue) => {
        // @ts-ignore
        setValue(newValue);
      }}
      renderInput={(params) => <TextField {...params} size="small" fullWidth margin="dense" />}
    />
    </LocalizationProvider>
  );
}

export default RenderTimeSelector;
