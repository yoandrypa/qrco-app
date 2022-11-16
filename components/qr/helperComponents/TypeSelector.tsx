import {MouseEvent, useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Popover from "@mui/material/Popover";
import Paper from "@mui/material/Paper";
import {grey} from "@mui/material/colors";

import RenderIcon from './RenderIcon';
import RenderIframe from "../../RenderIframe";
import {NO_MICROSITE} from "../constants";

interface TypeSelectorProps {
  handleSelect: (payload: string) => void;
  label: string;
  description: string;
  icon: string;
  selected: boolean;
  enabled?: boolean;
}

const TypeSelector = ({handleSelect, label, description, icon, selected, enabled = true}: TypeSelectorProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const beforeHandle = () => {
    if (enabled) {
      handleSelect(icon);
    }
  };

  const handleEnter = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(!NO_MICROSITE.includes(icon) ? event.currentTarget : null);
  }

  const handleLeave = () => {
    setAnchorEl(null);
  }

  return (
    <>
      <Box
        aria-owns={Boolean(anchorEl) ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        sx={{
          cursor: enabled ? 'pointer' : 'default',
          width: '100%',
          height: '130px',
          borderRadius: '5px',
          border: theme => `solid 1px ${theme.palette.text.disabled}`,
          backgroundColor: enabled ? '#fff' : grey[300],
          boxShadow: enabled && selected ? '0 0 5px 2px #286ED6' : 'none',
          '&:hover': enabled ? {
            boxShadow: !selected ? '0 0 3px 2px #849abb' : '0 0 3px 2px #286ED6',
          } : grey[100]
        }}
        onClick={beforeHandle}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <Box sx={{display: 'flex', p: 1}}>
          <Box sx={{mt: '3px'}}>
            <RenderIcon icon={icon} enabled={enabled}/>
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'column', textAlign: 'left', ml: 1, width: '100%'}}>
            <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
              <Typography sx={{
                width: '100%',
                fontWeight: 'bold',
                color: !enabled ? theme => theme.palette.text.disabled : 'default'
              }} variant="h6">
                {label}
              </Typography>
            </Box>
            <Typography sx={{width: '100%', color: theme => theme.palette.text.disabled}}>
              {description}
            </Typography>
          </Box>
        </Box>
      </Box>
      {anchorEl && <Popover
          id="mouse-over-popover"
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          sx={{ pointerEvents: 'none' }}
          anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          disableRestoreFocus
        >
          {Boolean(anchorEl) ? (
            <Paper sx={{p: '5px', textAlign: 'center'}}>
              <RenderIframe src={`${process.env.REACT_MICROSITES_ROUTE}/sample/${selected}`} width={370} height={500}/>
            </Paper>
          ) : null}
        </Popover>}
    </>
  );
};

export default TypeSelector;
