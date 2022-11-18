import {useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import Paper from "@mui/material/Paper";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import IconButton from '@mui/material/IconButton';
import {grey} from "@mui/material/colors";
import {alpha} from "@mui/material/styles";

import RenderIcon from "./RenderIcon";
import RenderIframe from "../../RenderIframe";
import {NO_MICROSITE} from "../constants";
import RenderCellPhoneShape from "./RenderCellPhoneShape";

interface TypeSelectorProps {
  handleSelect: (payload: string) => void;
  label: string;
  description: string;
  icon: string;
  selected: boolean;
  enabled?: boolean;
  isDynamic: boolean;
}

const TypeSelector = ({ handleSelect, label, description, icon, selected, isDynamic, enabled = true}: TypeSelectorProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const beforeHandle = (event: any) => {
    if (enabled && !['svg', 'BUTTON'].includes(event.target.tagName)) {
      handleSelect(icon);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Box
        sx={{
          position: 'relative',
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
      >
        {isDynamic && !NO_MICROSITE.includes(icon) && (
          <Tooltip title="View example">
            <IconButton
              sx={{
                position: 'absolute',
                right: '5px',
                bottom: 0,
                color: theme => alpha(theme.palette.primary.dark, 0.25),
                '&:hover': {color: theme => theme.palette.primary.dark}
              }}
              onClick={handleClick}
              id={`example${icon}`}>
              <OpenInNewIcon/>
            </IconButton>
          </Tooltip>
        )}
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
      {anchorEl && (
        <Popover
          elevation={0}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
          transformOrigin={{vertical: 'bottom', horizontal: 'center'}}
          disableRestoreFocus
          sx={{ '.MuiPopover-paper': { borderRadius: '30px' }, boxShadow: '10px 10px 5px lightblue', }}
        >
          <RenderCellPhoneShape onClose={() => setAnchorEl(null)}>
            <RenderIframe src={`${process.env.REACT_MICROSITES_ROUTE}/sample/${icon}`} width={308} height={510}/>
          </RenderCellPhoneShape>
        </Popover>
      )}
    </>
  );
};

export default TypeSelector;
