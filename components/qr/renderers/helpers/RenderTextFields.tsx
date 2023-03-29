import React, { ChangeEvent, memo, useState } from "react";

import TextField from "@mui/material/TextField";
import RenderIcon from "../../helperComponents/smallpieces/RenderIcon";
import RequiredAdornment from "./RequiredAdornment";

import { checkValidity, FormatType } from "../../../../libs/utils/check_validity";

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
  format?: FormatType;
}

const RenderTextFields = (props: RenderTextFieldsProps) => {
  const { value: initValue, placeholder, label, item, multiline, rows } = props;
  const { handleValues, sx, includeIcon, required, format, isError } = props;

  const [value, setValue] = useState<string>(initValue);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
    item ? handleValues(item)(newValue) : handleValues(newValue);
  }

  const valid = checkValidity(value, !!required, 'string', format);

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
        startAdornment: includeIcon && <RenderIcon icon={item || ''} enabled color={'#717171'} sx={{ mr: '5px' }} />,
        endAdornment: required && <RequiredAdornment value={value} />,
      }}
    />
  );
}

// @ts-ignore
function notIf(current, next) {
  return current.value === next.value && current.isError === next.isError && current.index === next.index;
}

export default memo(RenderTextFields, notIf);
