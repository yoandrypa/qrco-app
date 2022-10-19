import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import RenderIcon from "../../helperComponents/RenderIcon";
import {DEFAULT_COLORS} from "../../constants";

interface RenderFieldProps {
  size?: number;
  label?: string;
  value: string;
  icon?: string;
  color?: string;
}

export default function RenderField({size, label, value, icon, color}: RenderFieldProps) {
  return (
    <Grid item xs={size || 12} sx={{pt: 0, border: `solid 1px rgba(0,0,0,0.03)`}}>
      <TextField
        sx={{ mt: '-1px' }}
        label={label || ''}
        size="small"
        fullWidth
        margin="dense"
        variant="standard"
        value={value}
        InputProps={{
          disableUnderline: true,
          startAdornment: icon ? (
            <InputAdornment position="start">
              <RenderIcon icon={icon} enabled color={color || DEFAULT_COLORS.s}/>
            </InputAdornment>
          ) : undefined
        }}
      />
    </Grid>
  );
}
