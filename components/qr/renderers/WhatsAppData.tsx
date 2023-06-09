import {ChangeEvent, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Common from '../helperComponents/Common';

import MultiLineDetails from '../helperComponents/MultiLineDetails';
import {PHONE} from "../constants";
import RenderPreviewURLString from "./helpers/RenderPreviewURLString";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";

type WhatsAppProps = {
  data: { number?: string, message?: string };
  setData: Function;
  setIsWrong: (isWrong: boolean) => void;
};

function WhatsAppData({data, setData, setIsWrong}: WhatsAppProps) {
  const handleValues = (item: 'number' | 'message') => (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    const tempo = {...data};
    if (value.length) {
      tempo[item] = item !== 'number' ? value.slice(0, 500) : value || '';
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
    <Common msg="Enter the message users will send via Whatsapp, up to 500 characters.">
      <TextField
        label="Number"
        size="small"
        required
        fullWidth // @ts-ignore
        error={data?.number && !PHONE.test(data.number)}
        margin="dense"
        value={data?.number || ''}
        onChange={handleValues('number')}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Typography color="error">{!data?.number?.length ? 'REQUIRED' : ''}</Typography>
            </InputAdornment>
          )
        }}
      />
      <TextField
        rows={3}
        multiline={true}
        required
        label="Message"
        size="small"
        fullWidth
        margin="dense"
        value={data?.message || ''}
        onChange={handleValues('message')}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Typography color="error">{!data?.message?.length ? 'REQUIRED' : ''}</Typography>
            </InputAdornment>
          )
        }}
      />
      <MultiLineDetails top={500} data={data?.message || ''}/>
      <RenderPreviewURLString selected="whatsapp" data={data}/>
    </Common>
  );
};

export default WhatsAppData;
