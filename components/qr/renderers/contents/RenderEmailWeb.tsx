import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {ContentProps} from "../custom/helperFuncs";
import RenderEmail from "./RenderEmail";
import RenderWeb from "./RenderWeb";

interface RenderEmailWebProps extends ContentProps {
  sx?: Object;
}

export default function RenderEmailWeb({data, handleValues, sx, index}: RenderEmailWebProps) {
  return (
    <Box sx={{width: '100%', ...sx}}>
      <Grid container spacing={1}>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          <RenderEmail index={index} handleValues={handleValues} data={data} />
        </Grid>
        <Grid item sm={6} xs={12} style={{paddingTop: 0}}>
          <RenderWeb index={index} handleValues={handleValues} data={data} />
        </Grid>
      </Grid>
    </Box>
  );
}
