import {ChangeEvent, useEffect, useRef, useState} from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import ReplayIcon from '@mui/icons-material/Replay';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import {components} from "./helperFuncs";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

interface CustomEditProps {
  handleClose: () => void;
  handleOk: (value: string) => void;
  value: string;
  anchor: HTMLButtonElement;
  current?: string;
}

export default function CustomEditSection({handleClose, value, anchor, current, handleOk}: CustomEditProps) {
  const [data, setData] = useState<string>('');
  const original = useRef<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setData(event.currentTarget.value);
  };

  const handleRestore = () => {
    setData(original.current);
  };

  const handleAccept = () => {
    handleOk(data);
  };

  useEffect(() => {
    const orig = components.find(x => x.type === value) || {name: value};
    original.current = orig.name;
    if (!current) {
      setData(orig.name);
    } else {
      setData(current);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Popover
      open
      anchorEl={anchor}
      onClose={handleClose}
      anchorOrigin={{vertical: 'top', horizontal: 'left'}}
      transformOrigin={{vertical: 'top', horizontal: 'left'}}
    >
      <Box sx={{width: '300px', p: 2}}>
        <Box sx={{display: 'flex'}}>
          <EditIcon sx={{mr: '5px', color: theme => theme.palette.primary.light}} fontSize="small" />
          <Typography sx={{mb: 1}}>{'Update the section description:'}</Typography>
        </Box>
        <TextField
          label=""
          size="small"
          fullWidth
          required
          autoFocus
          margin="dense"
          value={data}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              data !== original.current ? (
                <Tooltip title={`Restore to ${original.current}`}>
                  <InputAdornment position="end">
                    <IconButton onClick={handleRestore} sx={{mr: '-7px'}}>
                      <ReplayIcon color="primary" />
                    </IconButton>
                  </InputAdornment>
                </Tooltip>
              ) : null
            )
          }}
        />
        <Box sx={{display: 'flex', justifyContent: 'space-between', mt: '5px'}}>
          <Button variant="outlined" onClick={handleAccept}>Ok</Button>
          <Button variant="outlined" onClick={handleClose}>Cancel</Button>
        </Box>
      </Box>
    </Popover>
  );
}
