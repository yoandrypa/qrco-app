import AutorenewIcon from '@mui/icons-material/Autorenew';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import RenderProDesc from "./RenderProDesc";
import RenderFreeDesc from "./RenderFreeDesc";
import {ProBadge} from "./StyledComponents";

interface DynamicProps {
  styling?: object | undefined;
  isDynamic: boolean;
}

export default function NotifyDynamic({styling, isDynamic}: DynamicProps) {
  return (
    <Tooltip title={isDynamic ? <RenderProDesc /> : <RenderFreeDesc />} arrow>
      <Box sx={{...styling, cursor: 'default', float: 'right', display: 'flex', color: theme => theme.palette.text.disabled }}>
        {isDynamic && <AutorenewIcon fontSize="small" />}
        <Typography sx={{fontSize: 'small'}}>{isDynamic ? 'Dynamic' : 'Static'}</Typography>
        <ProBadge pro={isDynamic}>
          <Typography>
            {isDynamic ? 'PRO' : 'FREE'}
          </Typography>
        </ProBadge>
      </Box>
    </Tooltip>
  );
}
