import CardContent from "@mui/material/CardContent";
import MainMicrosite from "./MainMicrosite";
import RenderSocials from "./renderers/RenderSocials";
import Grid from "@mui/material/Grid";
import {useMemo} from "react";
import {getColors} from "./renderers/helper";
import {ColorTypes} from "../types/types";

interface SocialProps {
  newData: any;
}

export default function SocialInfo({newData}: SocialProps) {
  const colors = useMemo(() => (getColors(newData)), []) as ColorTypes; // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MainMicrosite type={newData.qrType} colors={colors} url={newData.shortlinkurl}>
      <CardContent>
        <Grid container spacing={1}>
          <RenderSocials newData={newData} />
        </Grid>
      </CardContent>
    </MainMicrosite>
  );
}
