import {ChangeEvent, useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

interface CustomEditProps {
  handleClose: () => void;
  value: string;
  anchor: HTMLButtonElement;
}

export default function CustomEditSection({handleClose, value, anchor}: CustomEditProps) {
  const [data, setData] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setData(event.currentTarget.value);
  }

  useEffect(() => {
    setData(value);
  }, []);

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
          <Typography sx={{mb: 2}}>{'Update the section description:'}</Typography>
        </Box>
        <TextField
          label=""
          size="small"
          fullWidth
          required
          margin="dense"
          value={data}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              data.trim().length ? (
                <InputAdornment position="end">
                  <CloseIcon color="primary" />
                </InputAdornment>
              ) : null
            )
          }}
        />
        <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
          <Button variant="outlined">Ok</Button>
          <Button variant="outlined" onClick={handleClose}>Cancel</Button>
        </Box>
      </Box>
    </Popover>
  );
}
