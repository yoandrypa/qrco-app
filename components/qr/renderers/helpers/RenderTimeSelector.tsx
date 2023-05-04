import {memo} from "react";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import TextField from "@mui/material/TextField";

import {DataType} from "../../types/types";
import {getHM, setHM} from "../../../helpers/generalFunctions";

interface TimeSelProps {
  setData: Function;
  day: string;
  index: number;
  idx: number;
  ini: boolean;
  is12hours?: boolean;
  time: string;
}

/**
 * memoized: index corresponds to the custom position and idx to the timing position
 * @param setData
 * @param day
 * @param ini
 * @param index
 * @param idx
 * @param is12hours
 * @param time
 * @constructor
 */
const RenderTimeSelector = ({setData, day, ini, index, idx, is12hours, time}: TimeSelProps) => {
  const setValue = (value: Date) => {
    setData((prev: DataType) => {
      const newData = {...prev}; // @ts-ignore
      newData.custom[index].data.openingTime[day][idx][ini ? 'ini' : 'end'] = getHM(value);
      return newData;
    });
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
    <TimePicker
      ampm={is12hours || false}
      value={setHM(time)}
      onChange={(newValue) => { // @ts-ignore
        setValue(newValue);
      }}
      renderInput={(params) => <TextField {...params} size="small" fullWidth margin="dense" />}
    />
    </LocalizationProvider>
  );
}

const notIf = (curr: TimeSelProps, next: TimeSelProps) => {
  return curr.time === next.time && curr.is12hours === next.is12hours;
}

export default memo(RenderTimeSelector, notIf);
