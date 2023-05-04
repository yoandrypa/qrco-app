import {useMemo} from "react";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

import ColorSelector from "../ColorSelector";

interface LayoutSectConfig {
  primary: string;
  color?: string;
  setColor: (color: string | undefined) => void;
}

export default function LayoutSectionsColorConfig({color, setColor, primary}: LayoutSectConfig) {
  const handler = (event: SelectChangeEvent) => {
    if (event.target.value === 'default') {
      setColor(undefined);
    } else {
      setColor(primary);
    }
  }

  const handleValue = () => (payload: string) => {
    setColor(payload);
  }

  const selection = useMemo(() => color !== undefined ? 'solid' : 'default', [color]);

  return (
    <Grid container spacing={2} sx={{width: {sm: '700px', xs: '100%'}}}>
      <Grid item sm={color !== undefined ? 6 : 12} xs={12}>
      <FormControl sx={{ m: 0, mt: 1, width: '100%' }} size="small">
        <InputLabel id="colorLayoutSect">Color</InputLabel>
        <Select
          labelId="colorLayoutSect"
          id="colorLayoutSectId"
          value={selection}
          label="Color"
          onChange={handler}
        >
          <MenuItem value="default">Default (main primary color)</MenuItem>
          <MenuItem value="solid">Custom color</MenuItem>
        </Select>
      </FormControl>
      </Grid>
      {color !== undefined && (
        <Grid item sm={6} xs={12}>
          <ColorSelector label="" color={color} handleData={handleValue} property=""/>
        </Grid>
      )}
    </Grid>
  );
}
