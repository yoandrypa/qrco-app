import {ChangeEvent} from "react";
import Grid from "@mui/material/Grid";

import RenderTextFields from "../helpers/RenderTextFields";

import {ContentProps} from "../custom/helperFuncs";
import TextField from "@mui/material/TextField";


export default function RenderSku({data, handleValues, index}: ContentProps) {
  const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string) => {
    handleValues(item, index)(payload);
  }

  const handleQtty = (event: ChangeEvent<HTMLInputElement>) => {
    handleValues('', index)(event.target.value);
  }

  return (
    <Grid container spacing={1} sx={{width: '100%'}}>
      <Grid item sm={8} xs={12}>
        <RenderTextFields
          item='sku' label="SKU" value={data?.sku || ''} index={index}
          placeholder="Insert the SKU number" handleValues={beforeSend} />
      </Grid>
      <Grid item sm={4} xs={12}>
        <TextField
          size="small"
          label="Quantity"
          type="number"
          sx={{ width: '100%' }}
          onKeyDown={evt => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
          margin="dense"
          value={data?.quantity || 0}
          onChange={handleQtty}
          variant="outlined"
          InputProps={{ inputMode: 'numeric', inputProps: { min: 0 } }}
        />
      </Grid>
    </Grid>
  );
}
