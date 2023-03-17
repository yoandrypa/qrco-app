import {ChangeEvent} from 'react'
import Stack from '@mui/material/Stack';
import {PHONE} from '../../constants';
import {ContentProps} from "../custom/helperFuncs";
import RenderTextFields from "../helpers/RenderTextFields";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";

function RenderContactForm({data, handleValues, index}: ContentProps) {
  const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string) => {
    handleValues(item, index)(payload);
  }

  const renderItem = (item: string, label: string, placeHolder: string) => {
    let isError = false as boolean; // @ts-ignore
    const value = data?.[item] || '' as string;

    if (item === 'cell' && value.trim().length && !PHONE.test(value)) {
      isError = true;
    }

    return <RenderTextFields
      item={item}
      label={label}
      isError={isError}
      value={value}
      handleValues={beforeSend}
      required={item === 'cell'}
      index={index}
      placeholder={placeHolder}/>;
  };

  const handleReceipt = (event: ChangeEvent<HTMLInputElement>) => {
    handleValues('visibleReceipt', index)(event.target.checked);
  }

  return (
    <Stack spacing={2}>
      <Typography>
        Use this for allowing users contact you via SMS.
      </Typography>
      <Box>
        {renderItem('cell', 'Cell phone number to receive SMS', 'Enter your cell phone number here')}
        <FormControlLabel control={<Switch checked={data?.visibleReceipt || false} onChange={handleReceipt} />}
                          label="Visible receipt's cell number in microsite" sx={{mt: '-5px'}}/>
      </Box>
      {renderItem('message', 'Message placeholder', 'Enter the message placeholder here')}
      {renderItem('buttonText', 'Button text', 'Send SMS')}
    </Stack >
  )
}

export default RenderContactForm
