import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';

const Loading = () => (
  <Backdrop sx={{ color: "#fff", zIndex: theme => theme.zIndex.drawer + 1 }} open>
    <Box sx={{ display: "flex", flexDirection: "column", textAlign: 'center' }}>
      <SystemUpdateAltIcon fontSize="large" />
      <Typography>{'Your browser is outdated or it does not have the necessary functions to run QRLynk.'}</Typography>
      <Typography>{'Please, update it.'}</Typography>
    </Box>
  </Backdrop>
);

export default Loading;
