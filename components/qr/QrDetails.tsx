import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import VisitDetailsSections from "../visit/VisitDetailsSections";

const QrDetails = ({ visitData, user }: any) => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <VisitDetailsSections visitData={visitData}/>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QrDetails;