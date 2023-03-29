import React, { memo, ReactElement } from "react";
import TextField from "@mui/material/TextField";
import RenderIcon from "../../helperComponents/smallpieces/RenderIcon";
import RequiredAdornment from "./RequiredAdornment";

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
  index?: number;
  includeIcon?: boolean;
  rows?: number;
}

const RenderTextFields = ({ value, handleValues, placeholder, label, item, required, isError, multiline, sx, includeIcon, rows }: RenderTextFieldsProps) => (
  <TextField
    sx={{ ...sx }}
    label={label}
    size="small"
    fullWidth
    required={required || false}
    error={isError || false}
    margin="dense"
    multiline={multiline || (rows && rows > 1) || false}
    rows={rows}
    value={value || ''}
    placeholder={placeholder}
    onChange={item !== undefined ? handleValues(item) : handleValues}
    InputProps={{
      startAdornment: includeIcon && <RenderIcon icon={item || ''} enabled color={'#717171'} sx={{ mr: '5px' }} />,
      endAdornment: required && <RequiredAdornment value={value} />,
    }}
  />
);

// @ts-ignore
function notIf(current, next) {
  return current.value === next.value && current.isError === next.isError && current.index === next.index;
}

export default memo(RenderTextFields, notIf);
