import AutorenewIcon from '@mui/icons-material/Autorenew';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import RenderProDesc from "./RenderProDesc";
import RenderFreeDesc from "./RenderFreeDesc";

interface DynamicProps {
  styling?: object | undefined;
  isDynamic: boolean;
}

export default function NotifyDynamic({styling, isDynamic}: DynamicProps) {
  return (
    <Tooltip title={isDynamic ? <RenderProDesc /> : <RenderFreeDesc />}>
      <Box sx={{...styling, cursor: 'default', float: 'right', display: 'flex', color: theme => theme.palette.text.disabled }}>
        <Typography sx={{fontSize: 'small'}}>{isDynamic ? 'Dynamic (PRO)' : 'Static (FREE)'}</Typography>
        {isDynamic && <AutorenewIcon fontSize="small" />}
      </Box>
    </Tooltip>
  );
}
