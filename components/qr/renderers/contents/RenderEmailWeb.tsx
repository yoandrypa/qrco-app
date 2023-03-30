import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {ContentProps} from "../custom/helperFuncs";
import RenderEmail from "./RenderEmail";
import RenderWeb from "./RenderWeb";
import RenderAsButton from "../../helperComponents/smallpieces/RenderAsButton";
import {ChangeEvent} from "react";

interface RenderEmailWebProps extends ContentProps {
  sx?: Object;
  isCompany?: boolean;
}

export default function RenderEmailWeb({data, handleValues, sx, index, isCompany}: RenderEmailWebProps) {
  const beforeSend = (item: string) => (payload: ChangeEvent<HTMLInputElement> | string) => {
    handleValues(item, index)(payload);
  }

  return (
    <Box sx={{width: '100%', ...sx}}>
      <Grid container spacing={1} sx={{mb: 1}}>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          <RenderEmail index={index} handleValues={handleValues} data={data} isCompany={isCompany} item="emailWebButton" />
        </Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          <RenderWeb index={index} handleValues={handleValues} data={data} isCompany={isCompany} item="emailWebButton" />
        </Grid>
      </Grid>
      <RenderAsButton
        sendData={beforeSend}
        message="Render email and web as buttons"
        extras={data?.extras}
        item="emailWebButton"
      />
    </Box>
  );
}
