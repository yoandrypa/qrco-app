import Grid from "@mui/material/Grid";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import RenderField from "./RenderField";
import {ColorTypes} from "../../types/types";

interface RenderAddressProps {
  newData: any;
  colors: ColorTypes;
}

export default function RenderAddress({newData, colors}: RenderAddressProps) {
  if (!newData.address && !newData.city && !newData.zip && !newData.state && !newData.country) {
    return null;
  }
  return (
    <>
      <Grid item xs={1}>
        <MyLocationIcon sx={{color: colors.p}}/>
      </Grid>
      <Grid item xs={11}>
        <Grid container spacing={1}>
          {newData.address &&
            <RenderField label="Address" value={newData.address} icon="location" color={newData.secondary}/>}
          {newData.city && <RenderField label="City" value={newData.city}/>}
          {newData.zip && <RenderField label="Zip code" value={newData.zip}/>}
          {newData.state && <RenderField label="State/Province" value={newData.state}/>}
          {newData.country && <RenderField label="Country" value={newData.country || ""}/>}
        </Grid>
      </Grid>
    </>
  );
}
