import {memo} from 'react';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Edit from "@mui/icons-material/Edit";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import KeyIcon from '@mui/icons-material/Key';

interface ModeProps {
  isWide?: boolean;
  mode: string;
  sx?: object;
}

const RenderMode = ({isWide, sx, mode}: ModeProps) => (
  <Box sx={{
    position: 'absolute',
    right: '5px',
    top: '15px',
    display: 'flex',
    color: 'primary.light',
    ...sx
  }}>
    {mode === 'edit' ?
      <Edit fontSize="small" sx={{mt: '-3px', transform: 'rotate(-10deg)'}} /> :
      (mode === 'clone' ?
        <DynamicFeedIcon fontSize="small" sx={{mt: '-3px', mr: '2px'}}/> :
        <KeyIcon fontSize="small" sx={{mt: '-1px', mr: '2px'}}/>
      )}
    <Typography sx={{ fontSize: 'small', fontWeight: 'lighter' }}>
      {`${mode.toUpperCase()}${isWide === undefined ? true : isWide ? ' MODE' : ''}`}
    </Typography>
  </Box>
);

export default memo(RenderMode, (current: ModeProps, next: ModeProps) =>
  current.isWide === next.isWide && current.mode === next.mode
);
