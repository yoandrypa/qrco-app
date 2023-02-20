import {ChangeEvent} from 'react'
import Stack from '@mui/material/Stack';
import {EMAIL} from '../../constants';
import {ContentProps} from "../custom/helperFuncs";
import RenderTextFields from "../helpers/RenderTextFields";
import Typography from "@mui/material/Typography";

function RenderContactForm({data, handleValues, index}: ContentProps) {
  const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string) => {
    handleValues(item, index)(payload);
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
        required={['email', 'message'].includes(item)}
        multiline={item === 'message'}
        placeholder={placeHolder}
        handleValues={beforeSend}
        index={index} />
    );
  };

  return (
    <Stack spacing={2}>
      <Typography>
        Use this address to receive the message from your contact form.
      </Typography>
      {renderItem('email', 'Inbox email', 'Enter the email address here')}
      {renderItem('title', 'Title/Subject', 'Enter the email subject here')}
      {renderItem('message', 'Message', 'Enther the email message here')}
      {renderItem('buttonText', 'Button text', 'Send message')}
    </Stack >
  )
}

export default RenderContactForm
