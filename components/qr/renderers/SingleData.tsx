import {ChangeEvent} from 'react';
import TextField from '@mui/material/TextField';

import Common from '../helperComponents/Common';
import MultiLineDetails from '../helperComponents/MultiLineDetails';
import {DataType} from "../types/types";
import {isValidUrl} from "../../../utils";

type SingleDataProps = {
  limit?: number;
  msg: string;
  label: string;
  data: DataType | { value: string };
  setData: (value: DataType) => void;
  isWrong: boolean;
  setIsWrong: (isWrong: boolean) => void;
};

function SingleData({ isWrong, setIsWrong, label, data, setData, msg, limit = -1 }: SingleDataProps) {
  const handleValue = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;
    if (limit !== -1) {
      value = value.slice(0, limit);
    }

    let error = false;
    if (!value.trim().length) {
      error = true;
    } else if (label === 'Website' && !isValidUrl(value)) {
      error = true;
    }
    setIsWrong(error);
    // @ts-ignore
    setData({ ...data, value });
  };

  return (
    <Common msg={msg}>
      <>
        <TextField
          rows={limit === -1 ? 1 : 3}
          multiline={limit !== -1}
          label={label}
          size="small"
          fullWidth
          margin="dense"
          error={isWrong}
          value={data?.value || ''}
          onChange={handleValue}/>
        {limit !== -1 && <MultiLineDetails top={limit} data={data?.value || ''} />}
      </>
    </Common>
  );
}

export default SingleData;
