// @ts-nocheck
import React from 'react';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Common from '../helperComponents/Common';

export type WifiDataProps = {
  data: {
    name?: string;
    hidden?: string;
    encription?: string;
    password?: string;
  };
  setData: Function;
}

function WifiData({ data, setData }: WifiDataProps) {
  const [show, setShow] = React.useState(false);

  const handleValues = (item: 'name' | 'hidden' | 'encription' | 'password') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const tempo = { ...data };
    if (item !== 'hidden') {
      const { value } = event.target;
      if (value.length) {
        tempo[item] = value;
      } else if (tempo[item]) {
        delete tempo[item];
      }
    } else {
      tempo.hidden = event.target.checked ? 'true' : 'false';
      if (tempo.hidden === 'false') {
        delete tempo.hidden;
      }
    }
    setData(tempo);
  };

  return (
    <Common msg="Provide your wireless network access data.">
      <>
        <TextField
          label="Name (SSID)"
          required
          size="small"
          fullWidth
          margin="dense"
          value={data?.name || ''}
          onChange={handleValues('name')} />
        <FormControlLabel
          sx={{ marginTop: '-12px', marginLeft: '-9px' }}
          control={<Checkbox checked={data?.hidden === 'true'} onChange={handleValues('hidden')} />}
          label="SSID network is hidden?" />
        <FormControl sx={{ width: '100%', mt: '4px' }} size="small">
          <InputLabel id="select-Enc">Encription</InputLabel>
          <Select
            labelId="select-Enc"
            id="select-Enc"
            value={data?.encription || 'none'}
            label="Encription"
            onChange={handleValues('encription')}
          >
            <MenuItem value='none'>None</MenuItem>
            <MenuItem value='WPA'>WPA/WPA2</MenuItem>
            <MenuItem value='WEP'>Thirty</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Password"
          type={show ? 'text' : 'password'}
          size="small"
          fullWidth
          margin="dense"
          value={data?.password || ''}
          onChange={handleValues('password')}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShow(prev => !prev)}>
                  {show ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            )
          }} />
      </>
    </Common>);
};

export default WifiData;
