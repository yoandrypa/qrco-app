import {ChangeEvent, MouseEvent, useState} from "react";

import Button from "@mui/material/Button";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import TextField from "@mui/material/TextField";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Badge from "@mui/material/Badge";
import InfoIcon from '@mui/icons-material/Info';
import Divider from "@mui/material/Divider";

interface TrackingProps {
  tracking?: string;
  handleValue: (tracking: 'tracking') => (payload: any) => void;
}

export default function RenderTrackingOpts({tracking, handleValue}: TrackingProps) {
  const [anchor, setAnchor] = useState<undefined | HTMLButtonElement>(undefined);
  const [anchorHelp, setAnchorHelp] = useState<undefined | HTMLButtonElement>(undefined);
  const [visible, setVisible] = useState<boolean>(false);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchor(event.currentTarget);
  };

  const handleOpenHelp = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorHelp(event.currentTarget);
  };

  const handleVisibility = () => {
    setVisible((prev: boolean) => !prev);
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleValue('tracking')(event.currentTarget.value);
  }

  const close = () => {
    setAnchor(undefined);
  }

  const removeTracking = () => {
    handleValue('tracking')({clear: true});
    close();
  }

  const disabled = !tracking?.trim().length;

  return (
    <>
      <Tooltip title="Set up tracking with your Google ID">
        <Badge color="success" sx={{mt: {xs: '4px', sm: 1}, '& .MuiBadge-badge': {padding: '0 !important'}}} invisible={disabled}
               badgeContent={<InfoIcon sx={{width: '20px', height: '20px'}} />}>
          <Button variant="outlined" color="primary" onClick={handleOpen}
                  sx={{minWidth: '30px', width: '30px', height: '40px', ml: 1, px: 1}}>
            <AnalyticsIcon />
          </Button>
        </Badge>
      </Tooltip>
      {anchor && (
        <Popover
          open={true}
          anchorEl={anchor}
          onClose={() => setAnchor(undefined)}
          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
          transformOrigin={{vertical: 'top', horizontal: 'center'}}
        >
          <Box sx={{p: 2}}>
            <TextField
              sx={{width: {sm: '350px', xs: '100%'}}}
              autoFocus
              fullWidth
              value={tracking || ''}
              size="small"
              label="Your Google ID"
              type={visible ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{mr: '-8px'}}>
                    <Tooltip title={visible ? 'Hide your ID' : 'Show your ID'}>
                      <IconButton size="small" onClick={handleVisibility}>
                        {visible ? <VisibilityOffIcon/> : <VisibilityIcon /> }
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove tracking">
                      <IconButton size="small" onClick={removeTracking} disabled={disabled}>
                        <ClearIcon sx={{color: disabled ? 'text.disabled' : 'error.main'}}/>
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }}
              onChange={handleChange}/>
            <Divider sx={{my: 1}} />
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
              <Button startIcon={<HelpOutlineIcon />} variant="outlined" onClick={handleOpenHelp}>Help</Button>
              <Button variant="outlined" onClick={close}>Close</Button>
            </Box>
          </Box>
        </Popover>
      )}
      {anchorHelp && (
        <Popover
          open={true}
          anchorEl={anchorHelp}
          onClose={() => setAnchorHelp(undefined)}
          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
          transformOrigin={{vertical: 'top', horizontal: 'center'}}
        >
          <Box sx={{p: 2}}>
            Track your page on Google Analytics with<br/>your Google ID using tracking options.
          </Box>
        </Popover>
      )}
    </>
  );
}
