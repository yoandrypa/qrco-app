import {ChangeEvent, useEffect} from 'react'
import Stack from '@mui/material/Stack';
import {EMAIL} from '../../constants';
import {ContentProps} from "../custom/helperFuncs";
import RenderTextFields from "../helpers/RenderTextFields";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

import session from "@ebanux/ebanux-utils/sessionStorage";

function RenderContactForm({data, handleValues, index}: ContentProps) {
  const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string) => {
    handleValues(item, index)(payload);
  }

  const handleReceipt = (event: ChangeEvent<HTMLInputElement>) => {
    handleValues('visibleReceipt', index)(event.target.checked);
  }

  const renderItem = (item: string, label: string, placeHolder?: string) => { // @ts-ignore
    const value = data?.[item] || '' as string;

    let isError = false;
    if (item === 'email' && value.trim().length && !EMAIL.test(value)) {
      isError = true;
    }

    return (
      <RenderTextFields
        item={item}
        label={label}
        isError={isError}
        value={value}
        multiline={item === 'message'}
        placeholder={placeHolder}
        handleValues={beforeSend}
        index={index} />
    );
  };

  useEffect(() => {
    if (data?.email === undefined) {
      const {email} = session.currentUser;
      if (email) {
        beforeSend('email')(email);
      }
    }
  }, []);

  return (
    <Stack spacing={2}>
      <Typography>
        Use this address to receive the message from your contact form.
      </Typography>
      <Box sx={{width: '100%'}}>
        {renderItem('email', 'Receipt email', 'Enter your email address here')}
        <FormControlLabel control={<Switch checked={data?.visibleReceipt || false} onChange={handleReceipt} />}
                          label="Visible receipt's email in in microsite" sx={{mt: '-5px'}}/>
      </Box>
      {renderItem('title', 'Subject placeholder', 'Enter the email subject placeholder here')}
      {renderItem('message', 'Message placeholder', 'Enter the email message placeholder here')}
      {renderItem('buttonText', 'Button text', 'Send message')}
    </Stack >
  )
}

export default RenderContactForm
