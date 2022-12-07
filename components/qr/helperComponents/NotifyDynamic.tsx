import AutorenewIcon from '@mui/icons-material/Autorenew';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface DynamicProps {
  styling?: object | undefined;
}

export default function NotifyDynamic({styling}: DynamicProps) {
  return (
    <Box sx={styling || { float: 'right', display: 'flex', color: theme => theme.palette.text.disabled }}>
      <Typography>{'Dynamic'}</Typography>
      <AutorenewIcon />
    </Box>
  );
}
