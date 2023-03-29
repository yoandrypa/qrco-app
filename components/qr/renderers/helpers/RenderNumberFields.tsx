import React, { ChangeEvent, ReactNode, useState } from "react";

import { isEmpty } from "@ebanux/ebanux-utils/utils";

import TextField from "@mui/material/TextField";
import RequiredAdornment from "./RequiredAdornment";
import InputAdornment from "@mui/material/InputAdornment";

import { checkValidity } from "../../../../libs/utils/check_validity";

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

const RenderNumberFields = (props: RenderTextFieldsProps) => {
  const { value: initValue, placeholder, label, item, min, max } = props;
  const { handleValues, startAdornment, sx, required, isError } = props;

  const [value, setValue] = useState<number>(initValue);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value || String(min) || '0');
    setValue(newValue);
    item ? handleValues(item)(newValue) : handleValues(newValue);
  }

  const valid = checkValidity(value, required, 'number', (value: number) => {
    const { min = Number.MIN_VALUE, max = Number.MAX_VALUE } = props;
    return (value >= min && value <= max);
  });

  return (
    <TextField
      type="number"
      value={isEmpty(value) ? '' : value}
      label={label}
      placeholder={placeholder}
      required={required || false}
      error={isError || !valid}
      fullWidth
      margin="dense"
      size="small"
      sx={{ ...sx }}
      onChange={onChange}
      InputProps={{
        // @ts-ignore
        inputMode: 'numeric', step: "any", pattern: ' ^[-,0-9]+$', min, max,
        startAdornment: startAdornment && <InputAdornment position="start">{startAdornment}</InputAdornment>,
        endAdornment: required && <RequiredAdornment value={String(value)} />,
      }}
    />
  );
}

export default RenderNumberFields;

