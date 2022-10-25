import {ChangeEvent, useEffect} from "react";
import TextField from '@mui/material/TextField';

import Common from '../helperComponents/Common';
import MultiLineDetails from '../helperComponents/MultiLineDetails';
import {PHONE} from "../constants";

export type SMSDataProps = {
  data: {
    number?: string;
    message?: string;
  };
  setData: Function;
  setIsWrong: (isWrong: boolean) => void;
};

const SMSData = ({ data, setData, setIsWrong }: SMSDataProps) => {
  const handleValues = (item: 'message' | 'number') => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const tempo = { ...data };
    if (value.length) {
      tempo[item] = item === 'message' ? value.slice(0, 160) : value;
    } else if (tempo[item]) {
      delete tempo[item];
    }
    setData(tempo);
  };

  useEffect(() => {
    let isWrong = false;
    if ((!data.number?.trim().length || !PHONE.test(data.number)) || !data.message?.trim().length) {
      isWrong = true;
    }
    setIsWrong(isWrong);
  }, [data.number, data.message]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Common msg="You can send SMSs in the number you provide. The message max size is up to 160 characters.">
      <>
        <TextField
          label="Number"
          size="small"
          fullWidth
          // @ts-ignore
          error={data?.number && !PHONE.test(data.number)}
          required
          margin="dense"
          value={data?.number || ''}
          onChange={handleValues('number')} />
        <TextField
          label="Message"
          size="small"
          fullWidth
          required
          margin="dense"
          value={data?.message || ''}
          onChange={handleValues('message')} />
        <MultiLineDetails top={160} data={data?.message || ''} />
      </>
    </Common>);
}

export default SMSData;
