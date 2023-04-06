import React, { ChangeEvent, ReactNode, useState } from "react";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import RequiredAdornment from "../helpers/RequiredAdornment";

import { checkValidity, FormatType } from "../helpers/validations";

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
  rows?: number;
  format?: FormatType;
  startAdornment?: ReactNode;
}

export default function TextBox(props: RenderTextFieldsProps) {
  const { value: initValue, placeholder, label, item, multiline, rows } = props;
  const { handleValues, startAdornment, sx, required, format, isError } = props;
  const [value, setValue] = useState<string>(initValue);
  const [wasEdited, setWasEdited] = useState<boolean>(false);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (!wasEdited) setWasEdited(true);
    item ? handleValues(item)(newValue) : handleValues(newValue);
  }

  const isRequired = !!required && wasEdited;
  const valid = checkValidity(value, isRequired, 'string', format);

  return (
    <TextField
      value={value || ''}
      label={label}
      placeholder={placeholder}
      required={required || false}
      error={isError || !valid}
      multiline={multiline || (rows && rows > 1) || false}
      rows={rows}
      fullWidth
      margin="dense"
      size="small"
      sx={{ ...sx }}
      onChange={onChange}
      InputProps={{
        startAdornment: startAdornment && <InputAdornment position="start">{startAdornment}</InputAdornment>,
        endAdornment: required && <RequiredAdornment value={String(value)} />,
      }}
    />
  );
}
