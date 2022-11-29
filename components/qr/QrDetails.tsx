import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import VisitDetailsSections from "../visit/VisitDetailsSections";
import Typography from "@mui/material/Typography";
import pluralize from "pluralize";

const QrDetails = ({ visitData }: any) => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">
            {visitData.total} {pluralize("Visit", visitData.total)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <VisitDetailsSections visitData={visitData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default QrDetails;