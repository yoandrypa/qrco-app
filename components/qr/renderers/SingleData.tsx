import {ChangeEvent, useEffect} from 'react';
import TextField from '@mui/material/TextField';

import Common from '../helperComponents/Common';
import MultiLineDetails from '../helperComponents/MultiLineDetails';
import {DataType} from "../types/types";
import {isValidUrl} from "../../../utils";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";

type SingleDataProps = {
  limit?: number;
  msg: string;
  label: string;
  data: DataType;
  setData: (value: DataType) => void;
  setIsWrong: (isWrong: boolean) => void;
};

function SingleData({ setIsWrong, label, data, setData, msg, limit = -1 }: SingleDataProps) {
  const isWrong = (value: string): boolean => {
    if (limit !== -1) {
      value = value.slice(0, limit);
    }
    let error = false;
    if (!value.trim().length) {
      error = true;
    } else if (label === 'Website' && !isValidUrl(value)) {
      error = true;
    }
    return error;
  }

  const handleValue = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;
    // @ts-ignore
    setData((prev: DataType) => ({ ...prev, value }));
  };

  useEffect(() => {
    setIsWrong(isWrong(data?.value || ''));
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Common msg={msg}>
      <>
        <TextField
          rows={limit === -1 ? 1 : 3}
          multiline={limit !== -1}
          label={label}
          size="small"
          fullWidth
          autoFocus
          margin="dense"
          error={label === 'Website' && data?.value !== undefined && data.value.trim().length > 0 && !isValidUrl(data.value)}
          value={data?.value || ''}
          onChange={handleValue}
          placeholder={label === 'Website' ? 'https://www.example.com' : 'Enter any text here'}
          InputProps={{
            endAdornment: (
              !data?.value?.trim().length ? (
                <InputAdornment position="end">
                  <Typography color="error">{'REQUIRED'}</Typography>
                </InputAdornment>
              ) : null
            )
          }}
        />
        {limit !== -1 && <MultiLineDetails top={limit} data={data?.value || ''} />}
      </>
    </Common>
  );
}

export default SingleData;
