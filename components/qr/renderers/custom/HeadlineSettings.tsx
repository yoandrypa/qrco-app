import {useState} from "react";
import Popover from "@mui/material/Popover";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import CheckIcon from "@mui/icons-material/Check";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SettingsIcon from '@mui/icons-material/Settings';
import Button from "@mui/material/Button";

import {Type} from "../../types/types";

import dynamic from "next/dynamic";

const SpacingSelector = dynamic(() => import("../../helperComponents/looseComps/SpacingSelector"));

interface HeadlineProps {
  anchor: HTMLElement;
  handleValues: Function;
  handleClose: () => void;
  data?: Type;
  index: number;
  reverse?: boolean;
  hideHeadLineSettings?: boolean;
}

export default function HeadlineSettings({anchor, handleValues, handleClose, reverse, index, data, hideHeadLineSettings}: HeadlineProps) {
  const [openSpacing, setOpenSpacing] = useState<boolean>(false);

  const handle = () => {
    let isChecked = data?.hideHeadLine || false;
    if (reverse) {
      isChecked = !isChecked;
    }
    handleValues('hideHeadLine', index, reverse || false)(!isChecked);
    handleClose();
  };

  let checked = data?.hideHeadLine === undefined || !data?.hideHeadLine;
  if (reverse) {
    checked = !checked;
  }

  const customHandle = (prop: string) => () => { // @ts-ignore
    const value = data?.[prop] || false;
    handleValues(prop, index)(!value);
    handleClose();
  }

  const renderCheck1 = (checked?: boolean) => checked && <CheckIcon color="primary" sx={{ml: 2}} />;

  return (
    <>
      <Popover
        open
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        transformOrigin={{vertical: 'top', horizontal: 'left'}}
      >
        <MenuList>
          {!hideHeadLineSettings && (
            <MenuItem onClick={handle}>
              <ListItemText><Typography>Show headline</Typography></ListItemText>
              {renderCheck1(checked)}
            </MenuItem>
          )}
          {!hideHeadLineSettings && (
            <MenuItem onClick={customHandle('centerHeadLine')} disabled={!checked}>
              <ListItemText><Typography>Center headline</Typography></ListItemText>
              {renderCheck1(data?.centerHeadLine)}
            </MenuItem>
          )}
          {!hideHeadLineSettings && <Divider />}
          <MenuItem onClick={() => setOpenSpacing(true)}>
            <ListItemText><Typography>{'Section\'s spacing...'}</Typography></ListItemText>
          </MenuItem>
        </MenuList>
      </Popover>
      {openSpacing && (
        <Popover
          open
          anchorEl={anchor}
          onClose={handleClose}
          anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
          transformOrigin={{vertical: 'top', horizontal: 'left'}}
        >
          <Box sx={{p: 2}}>
            <Box sx={{display: 'flex'}}>
              <SettingsIcon sx={{color: theme => theme.palette.primary.dark, mr: '5px', mt: '-2px'}}/>
              <Typography>{'Section\'s spacing configuration'}</Typography>
            </Box>
            <SpacingSelector selection={data?.topSpacing || 'default'} item="topSpacing" message="Top spacing" handleValues={handleValues} index={index}/>
            <SpacingSelector selection={data?.bottomSpacing || 'default'} item="bottomSpacing" message="Bottom spacing" handleValues={handleValues} index={index}/>
            <Divider sx={{mt: 2, mb: 1}}/>
            <Box sx={{width: '100%', textAlign: 'right'}}>
              <Button onClick={handleClose} variant="outlined">Close</Button>
            </Box>
          </Box>
        </Popover>
      )}
    </>
  );
}
