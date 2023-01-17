import {ChangeEvent, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Common from '../helperComponents/Common';
import {isValidUrl} from "../../../utils";
import RenderPreviewURLString from "./helpers/RenderPreviewURLString";
import Box from "@mui/material/Box";

type TwitterDataProps = {
  data: {
    text?: string;
    via?: string;
    hashtags?: string;
    url?: string;
  };
  setIsWrong: (isWrong: boolean) => void;
  setData: Function;
};

export const availableTwittChars = (data: { text?: string; via?: string; hashtags?: string; url?: string; }) => {
  return 280 - ((data?.text || '').length + (data?.via ? `@${data?.via}` : '').length +
    (data?.url || '').length + (data?.hashtags ? data.hashtags.split(',').map((x: string) => `#${x}`).join(' ') : '').length);
}

const TwitterData = ({data, setData, setIsWrong}: TwitterDataProps) => {
  const handleValues = (item: 'text' | 'via' | 'hashtags' | 'url') => (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    const tempo = {...data};
    if (value.length) {
      tempo[item] = value;
    } else if (tempo[item]) {
      delete tempo[item];
    }
    setData(tempo);
  };

  const renderAvailability = () => {
    const total = availableTwittChars(data);
    if (total < 0) {
      return (
        <Typography color="error" sx={{ fontSize: 'small' }}>
          {'Too many characters, the total amount of characters must be 280'}
        </Typography>
      );
    }
    return (
      <Typography sx={{ fontSize: 'small', color: theme => theme.palette.text.disabled }}>
        {`${total} available character${total !== 1 ? 's' : 0}`}
      </Typography>
    );
  };

  useEffect(() => {
    // @ts-ignore
    setIsWrong(!data.text?.trim().length && !data.via?.trim().length && !data.hashtags?.trim().length && !data.url?.trim().length || (data.url?.trim().length && !isValidUrl(data.url)));
  }, [data.text, data.via, data.hashtags, data.url]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Common msg="You can post a tweet with a link, an user's reference and a list of hashtags.">
      <TextField
        label="Text"
        size="small"
        fullWidth
        margin="dense"
        value={data?.text || ''}
        onChange={handleValues('text')}/>
      <TextField
        label="Mention username (do not include the @ symbol)"
        size="small"
        fullWidth
        margin="dense"
        value={data?.via || ''}
        onChange={handleValues('via')}/>
      <TextField
        label="Hashtags (comma separated, do not include the # symbol)"
        size="small"
        fullWidth
        margin="dense"
        value={data?.hashtags || ''}
        onChange={handleValues('hashtags')}/>
      <TextField
        label="URL"
        size="small"
        fullWidth
        margin="dense"
        // @ts-ignore
        error={data?.url && !isValidUrl(data.url)}
        value={data?.url || ''}
        onChange={handleValues('url')}/>
      <Box sx={{ width: '100%', textAlign: 'right' }}>
        {renderAvailability()}
      </Box>
      <RenderPreviewURLString selected="twitter" data={data}/>
    </Common>);
};


export default TwitterData;
