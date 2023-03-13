import {FormControl, InputLabel} from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import SwapVertIcon from '@mui/icons-material/SwapVert';
import PhotoIcon from '@mui/icons-material/Photo';
import Grid from "@mui/material/Grid";

interface ProfileSttngsProps {
  profileImageSize?: string;
  profileImageVertical?: string;
  handleValue: Function;
}

export default function RenderProfileImgSettings({profileImageSize, profileImageVertical, handleValue}: ProfileSttngsProps) {

  const handler = (prop: string) => (event: {target: { value: string }}) => {
    handleValue(prop)(event.target.value);
  }

  return (
    <Grid spacing={1} container sx={{mt: 1}}>
      <Grid item xs={12} sm={6} sx={{display: 'flex'}}>
        <PhotoIcon fontSize="medium" sx={{my: 'auto', mr: 1}} color="primary" />
        <FormControl fullWidth size="small" sx={{width: '100%'}} >
          <InputLabel id="profileSizer">Profile image size</InputLabel>
          <Select
            labelId="profileSizer"
            sx={{width: '100%'}}
            label="Profile image sizer"
            value={profileImageSize || 'default'}
            onChange={handler('profileImageSize')}
          >
            <MenuItem value="small">Small</MenuItem>
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="large">Large</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6} sx={{display: 'flex'}}>
        <SwapVertIcon fontSize="medium" sx={{my: 'auto', mr: 1}} color="primary" />
        <FormControl fullWidth size="small" sx={{width: '100%'}} >
          <InputLabel id="profileSizer">Profile image vertical alignment</InputLabel>
          <Select
            labelId="profileSizer"
            sx={{width: '100%'}}
            label="Profile image vertical alignment"
            value={profileImageVertical || 'default'}
            onChange={handler('profileImageVertical')}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="upper">Upper</MenuItem>
            <MenuItem value="top">Top</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}
