import {ChangeEvent, useEffect} from "react";
import TextField from "@mui/material/TextField";
import Common from "../helperComponents/Common";
import {isValidUrl} from "../../../utils";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";

import {DataType} from "../types/types";
import RenderPreviewURLString from "./helpers/RenderPreviewURLString";

interface FacebookDataProps {
  data: DataType;
  setData: Function;
  setIsWrong: (isWrong: boolean) => void;
}

function FacebookData({setIsWrong, data, setData}: FacebookDataProps) {
  const handleValues = (item: 'message') => (event: ChangeEvent<HTMLInputElement>) => {
    let wrong = false;
    const {value} = event.target;

    const tempo = {...data};
    if (value.length) {
      tempo[item] = value;
      if (!isValidUrl(value)) {
        wrong = true;
      }
    } else if (tempo[item]) { // @ts-ignore
      delete tempo[item];
      wrong = true;
    }
    setIsWrong(wrong);
    setData(tempo);
  };

  useEffect(() => { // @ts-ignore
    setIsWrong(!Boolean(data?.message?.trim().length) || !isValidUrl(data.message));
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Common msg="URL to be shared in the user's profile.">
      <TextField
        rows={3}
        autoFocus
        placeholder="https://www.example.com"
        multiline={true}
        label="Post"
        size="small"
        fullWidth
        margin="dense"
        error={data?.message !== undefined && data.message.trim().length > 0 && !isValidUrl(data.message)}
        value={data?.message || ''}
        InputProps={{
          endAdornment: (
            !data?.message?.trim().length ? (
              <InputAdornment position="end">
                <Typography color="error">{'REQUIRED'}</Typography>
              </InputAdornment>
            ) : null
          )
        }}
        onChange={handleValues('message')}/>
      <RenderPreviewURLString selected="facebook" data={data}/>
    </Common>
  );
}

export default FacebookData;
