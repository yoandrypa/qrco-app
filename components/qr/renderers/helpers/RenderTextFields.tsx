import {memo} from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

interface RenderTextFieldsProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  handleValues: Function;
  isError?: boolean;
  multiline?: boolean;
  value: string;
  item?: string;
  sx?: any;
}

const RenderTextFields = ({value, handleValues, placeholder, label, item, required, isError, multiline, sx}: RenderTextFieldsProps) => (
  <TextField
    sx={{...sx}}
    label={label}
    size="small"
    fullWidth
    required={required || false}
    error={isError || false}
    margin="dense"
    multiline={multiline || false}
    value={value || ''}
    placeholder={placeholder}
    onChange={item !== undefined ? handleValues(item) : handleValues}
    InputProps={{
      endAdornment: (
        required && !value.trim().length ? (
          <InputAdornment position="end">
            <Typography color="error">{'REQUIRED'}</Typography>
          </InputAdornment>
        ) : null
      )
    }}
  />
);

// @ts-ignore
function notIf(current, next) {
  return current.value === next.value && current.isError === next.isError;
}

export default memo(RenderTextFields, notIf);
