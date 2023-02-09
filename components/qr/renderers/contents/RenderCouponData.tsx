import Grid from "@mui/material/Grid";
import {ContentProps} from "../custom/helperFuncs";
import RenderTextFields from "../helpers/RenderTextFields";
import Box from "@mui/material/Box";
import {ChangeEvent} from "react";
import RenderDateSelector from "./RenderDateSelector";

export default function RenderCouponData({data, handleValues, index}: ContentProps) {
  const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string) => {
    handleValues(item, index)(payload);
  }

  const renderItem = (item: string, label: string, required?: boolean, placeholder?: string) => {
    return (
      <RenderTextFields
        handleValues={beforeSend} // @ts-ignore
        value={data?.[item] || ''}
        item={item}
        label={label}
        placeholder={placeholder}
        multiline={item === 'text'}
        required={required}
      />
    );
  };

  return (
    <Box sx={{width: '100%'}}>
      <Grid container spacing={1}>
        <Grid item xs={12} style={{paddingTop: 0}}>
          {renderItem('name', 'Coupon code', true)}
        </Grid>
        <Grid item xs={12} style={{paddingTop: 0}}>
          <RenderDateSelector data={data} handleValues={beforeSend} label="Valid until" index={-1} />
        </Grid>
        <Grid item xs={12} style={{paddingTop: 0}}>
          {renderItem('text', 'Terms and conditions')}
        </Grid>
      </Grid>
    </Box>
  );
}
