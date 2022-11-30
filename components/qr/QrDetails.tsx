import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import VisitDetailsSections from "../visit/VisitDetailsSections";
import Typography from "@mui/material/Typography";
import pluralize from "pluralize";
import Paper from "@mui/material/Paper";

const QrDetails = ({ visitData, qrData }: any) => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">
            {qrData.shortLinkId.visitCount} {pluralize("Visit", qrData.shortLinkId.visitCount)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <></>
        </Grid>
        {visitData && <Grid item xs={12}>
          <VisitDetailsSections visitData={visitData} />
        </Grid>}
      </Grid>
    </Box>
  );
};

export default QrDetails;