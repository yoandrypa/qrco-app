import {ChangeEvent} from 'react'
import Stack from '@mui/material/Stack';
import {EMAIL, PHONE} from '../../constants';
import {ContentProps} from "../custom/helperFuncs";
import RenderTextFields from "../helpers/RenderTextFields";
import Typography from "@mui/material/Typography";

function RenderContactForm({data, handleValues, index}: ContentProps) {
  const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string) => {
    handleValues(item, index)(payload);
  }

  const renderItem = (item: string, label: string, placeHolder: string) => {
    let isError = false as boolean; // @ts-ignore
    const value = data?.[item] || '' as string;

    if (value.trim().length && !PHONE.test(value)) {
      isError = true;
    }

    return <RenderTextFields item={item} label={label} isError={isError} value={value} handleValues={beforeSend} index={index}/>;
  };

  return (
    <Stack spacing={2}>
      <Typography>
        Use this for allowing users contact you via SMS.
      </Typography>
      {renderItem('phone', 'SMS Phone', 'Enter your phone number here')}
      {renderItem('message', 'Message', 'Enter the message here')}
      {renderItem('message', 'Message', 'Enther the email message here')}
      {renderItem('buttonText', 'Button text', 'Send message')}
    </Stack >
  )
}

export default RenderContactForm
