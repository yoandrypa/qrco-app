import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {EMAIL} from "../../constants";
import RenderTextFields from "../helpers/RenderTextFields";
import {isValidUrl} from "../../../../utils";
import {ChangeEvent} from "react";
import {ContentProps} from "../custom/helperFuncs";

interface RenderEmailWebProps extends ContentProps {
  sx?: Object;
}

export default function RenderEmailWeb({data, handleValues, sx, index}: RenderEmailWebProps) {
  const renderItem = (item: string, label: string) => {
    let isError = false as boolean; // @ts-ignore
    const value = data?.[item] || '' as string;

    if (value.trim().length) {
      if (item === 'web' && !isValidUrl(value)) {
        isError = true;
      } else if (item === 'email' && !EMAIL.test(value)) {
        isError = true;
      }
    }

    const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string | boolean) => {
      handleValues(item, index)(payload);
    }

    return <RenderTextFields item={item} label={label} isError={isError} value={value} handleValues={beforeSend}/>;
  };

  return (
    <Box sx={{width: '100%', ...sx}}>
      <Grid container spacing={1}>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('email', 'Email')}
        </Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          {renderItem('web', 'Web')}
        </Grid>
      </Grid>
    </Box>
  );
}
