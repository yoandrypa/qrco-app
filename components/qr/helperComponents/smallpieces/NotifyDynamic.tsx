import AutorenewIcon from '@mui/icons-material/Autorenew';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import RenderProDesc from "./RenderProDesc";

interface DynamicProps {
  styling?: object | undefined;
}

export default function NotifyDynamic({styling}: DynamicProps) {
  return (
    <Tooltip title={<RenderProDesc />}>
      <Box sx={styling || { cursor: 'default', float: 'right', display: 'flex', color: theme => theme.palette.text.disabled }}>
        <Typography sx={{fontSize: 'small'}}>{'PRO (Dynamic)'}</Typography>
        <AutorenewIcon fontSize="small" />
      </Box>
    </Tooltip>
  );
}
