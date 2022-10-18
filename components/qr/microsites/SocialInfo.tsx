import CardContent from "@mui/material/CardContent";
import MainMicrosite from "./MainMicrosite";
import RenderSocials from "./renderers/RenderSocials";
import Grid from "@mui/material/Grid";

interface SocialProps {
  newData: any;
}

export default function SocialInfo({newData}: SocialProps) {
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
