import {memo} from 'react';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Edit from "@mui/icons-material/Edit";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";

interface ModeProps {
  isWide?: boolean;
  mode: string;
  sx?: object;
}

const RenderMode = ({isWide, sx, mode}: ModeProps) => {
  return (
    <Box sx={{
      position: 'absolute',
      right: '5px',
      top: '15px',
      display: 'flex',
      ...sx
    }}>
      {mode === 'edit' ? <Edit
        fontSize="small"
        sx={{mt: '-3px', transform: 'rotate(-10deg)', color: theme => theme.palette.primary.light}} /> :
        <DynamicFeedIcon fontSize="small" sx={{mt: '-3px', mr: '2px', color: theme => theme.palette.primary.light}}/>
      }
      <Typography
        sx={{
          fontSize: 'small',
          fontWeight: 'lighter',
          color: theme => theme.palette.primary.light
        }}
      >
        {`${mode.toUpperCase()}${isWide === undefined ? true : isWide ? ' MODE' : ''}`}
      </Typography>
  </Box>
  )
}

export default memo(RenderMode, (current: ModeProps, next: ModeProps) =>
  current.isWide === next.isWide && current.mode === next.mode
);
