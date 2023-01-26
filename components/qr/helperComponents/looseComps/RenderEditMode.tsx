import {memo} from 'react';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Edit from "@mui/icons-material/Edit";

interface EditModeProps {
  isWide?: boolean;
  sx?: object;
}

const RenderEditMode = ({isWide, sx}: EditModeProps) => {
  return (
    <Box sx={{
      position: 'absolute',
      right: '5px',
      top: '15px',
      display: 'flex',
      ...sx
    }}>
      <Edit
        fontSize="small"
        sx={{
          mt: '-3px',
          transform: 'rotate(-10deg)',
          color: theme => theme.palette.primary.light
        }} />
      <Typography
        sx={{
          fontSize: 'small',
          fontWeight: 'lighter',
          color: theme => theme.palette.primary.light
        }}
      >
        {`EDIT${isWide === undefined ? true : isWide ? ' MODE' : ''}`}
      </Typography>
  </Box>
  )
}

export default memo(RenderEditMode, (current: EditModeProps, next: EditModeProps) => current.isWide === next.isWide);
