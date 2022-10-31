import {MouseEvent, useState} from "react";
import CircleIcon from '@mui/icons-material/Circle';
import SquareIcon from '@mui/icons-material/Square';
import SquareRoundedIcon from '@mui/icons-material/SquareRounded';
import MenuList from '@mui/material/MenuList';
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Popover from '@mui/material/Popover';
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

interface RenderForeImgTypePickerProps {
  handleValue: Function;
  foregndImgType?: string;
}

export default function RenderForeImgTypePicker({handleValue, foregndImgType}: RenderForeImgTypePickerProps) {
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);

  const handleOpen = (e: MouseEvent<HTMLButtonElement>) => {
    setOpen(e.currentTarget);
  }

  const before = (item: string) => () => {
    handleValue('foregndImgType')(item);
    setOpen(null);
  }

  return (
    <>
      <Tooltip title="Select shape">
        <Button sx={{width: '40px'}} variant="contained" color="info" onClick={handleOpen}>
          {(foregndImgType === undefined || foregndImgType === 'circle') ? <CircleIcon /> :
            foregndImgType === 'smooth' ? <SquareRoundedIcon /> : <SquareIcon />}
        </Button>
      </Tooltip>
      {open && (
        <Popover
          open
          anchorEl={open}
          onClose={() => setOpen(null)}
          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
          transformOrigin={{vertical: 'top', horizontal: 'center'}}
        >
          <MenuList>
            <MenuItem onClick={before('circle')}>
              <ListItemIcon>
                <CircleIcon color="primary" sx={{mb: '2px', mr: '5px'}}/>
              </ListItemIcon>
              <ListItemText>{'Circled'}</ListItemText>
            </MenuItem>
            <MenuItem onClick={before('smooth')}>
              <ListItemIcon>
                <SquareRoundedIcon color="primary" sx={{mb: '2px', mr: '5px'}}/>
              </ListItemIcon>
              <ListItemText>{'Smooth square'}</ListItemText>
            </MenuItem>
            <MenuItem onClick={before('square')}>
              <ListItemIcon>
                <SquareIcon color="primary" sx={{mb: '2px', mr: '5px'}}/>
              </ListItemIcon>
              <ListItemText>{'Squared'}</ListItemText>
            </MenuItem>
          </MenuList>
        </Popover>
      )}
    </>
  );
}
