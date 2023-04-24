import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import {useState} from "react";

interface TxtButtonProps {
  anchor: Element;
  setAnchor: (anchor: undefined) => void;
  handleValues: Function;
  customValue?: string;
  item?: string;
}

export default function TextFieldButton({anchor, customValue, handleValues, item, setAnchor}: TxtButtonProps) {
  const [openCustom, setOpenCustom] = useState<boolean>(false);

  return (
    <Popover
      open
      anchorEl={anchor}
      onClose={() => setAnchor(undefined)}
      anchorOrigin={{vertical: 'top', horizontal: 'left'}}
      transformOrigin={{vertical: 'top', horizontal: 'left'}}
    >
      {!openCustom ? (
        <MenuList>
          {Boolean(customValue?.length) && (
            <Typography sx={{width: '100%', textAlign: 'center', color: theme => theme.palette.text.disabled, fontSize: 'smaller'}}>
              {customValue}
            </Typography>
          )}
          <MenuItem key={'setCustom'} onClick={() => setOpenCustom(true)}>
            <Typography>{'Set custom text'}</Typography>
          </MenuItem>
          <MenuItem key={'clearCustom'} disabled={!customValue?.length} onClick={() => {
            handleValues(`${item}_Custom`)('');
            setAnchor(undefined);
          }}>
            <Typography>{'Clear custom text'}</Typography>
          </MenuItem>
        </MenuList>
      ) : (
        <Box sx={{width: {xs: '350px', sm: '100%'}}}>
          <Box sx={{p: 1, m: 1}}>
            <Typography>{'Enter the custom text for this button'}</Typography>
            <TextField
              fullWidth
              label=""
              autoFocus
              size="small"
              placeholder="Custom text"
              margin="dense"
              value={customValue || ''}
              onChange={item !== undefined ? handleValues(`${item}_Custom`) : handleValues}
            />
            <Divider sx={{my: 1}}/>
            <div style={{display: 'flex', justifyContent: 'end'}}>
              <Button variant="outlined" disabled={!customValue?.length} onClick={() => handleValues(`${item}_Custom`)('')}>Clear</Button>
              <Button variant="outlined" sx={{ml: '5px'}} onClick={() => setAnchor(undefined)}>Close</Button>
            </div>
          </Box>
        </Box>
      )}
    </Popover>
  )
}
