import { MouseEvent } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { grey } from "@mui/material/colors";
import { alpha } from '@mui/material/styles';

import RenderIcon from './RenderIcon';

interface TypeSelectorProps {
  handleSelect: Function;
  label: string;
  description: string;
  icon: string;
  selected: boolean;
  enabled?: boolean;
}

const TypeSelector = ({ handleSelect, label, description, icon, selected, enabled = true }: TypeSelectorProps) => {
  const beforeHandle = (event: MouseEvent<HTMLDivElement>) => {
    if (enabled) {
      handleSelect(icon, event.currentTarget);
    }
  };

  return (
    <Box
      sx={{
        cursor: enabled ? 'pointer' : 'default',
        width: '100%',
        height: '130px',
        borderRadius: '5px',
        border: theme => `solid 1px ${theme.palette.text.disabled}`,
        '&:hover': enabled ? {
          backgroundColor: theme => alpha(theme.palette.info.light, 0.3)
        } : grey[100]
      }}
      onClick={beforeHandle}
    >
      <Box sx={{ display: 'flex', p: 1 }}>
        <Box sx={{ mt: '3px' }}>
          <RenderIcon icon={icon} enabled={enabled} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left', ml: 1, width: '100%' }}>
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
            <Typography sx={{ width: '100%', fontWeight: 'bold', color: !enabled ? theme => theme.palette.text.disabled : 'default' }} variant="h6">
              {label}
            </Typography>
          </Box>
          <Typography sx={{ width: '100%', color: theme => theme.palette.text.disabled }}>
            {description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TypeSelector;
