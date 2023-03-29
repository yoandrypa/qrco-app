import React, { ReactNode } from "react";
import TextField from "@mui/material/TextField";
import RequiredAdornment from "./RequiredAdornment";
import InputAdornment from "@mui/material/InputAdornment";

interface RenderTextFieldsProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  handleValues: Function;
  isError?: boolean;
  value: number;
  item?: string;
  sx?: any;
  index?: number;
  min?: number;
  max?: number;
  startAdornment?: ReactNode;
}

const RenderNumberFields = ({ value, handleValues, placeholder, label, item, required, isError, sx, startAdornment, min, max }: RenderTextFieldsProps) => (
  <TextField
    type="number"
    sx={{ ...sx }}
    label={label}
    size="small"
    fullWidth
    required={required || false}
    error={isError || false}
    margin="dense"
    value={value || ''}
    placeholder={placeholder}
    onChange={item !== undefined ? handleValues(item) : handleValues}
    InputProps={{
      // @ts-ignore
      inputMode: 'numeric', step: "any", pattern: ' ^[-,0-9]+$', min, max,
      startAdornment: startAdornment && <InputAdornment position="start">{startAdornment}</InputAdornment>,
      endAdornment: required && <RequiredAdornment value={String(value)} />,
    }}
  />
);

export default RenderNumberFields;

