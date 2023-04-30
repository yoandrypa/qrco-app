import React, { ChangeEvent, ReactNode, useState } from "react";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import ReqAdornment from "../helpers/RequiredAdornment";

import { checkValidity, FormatType } from "../helpers/validations";
import { parseFormFieldSx, parseFormFieldInputSx } from "../helpers/styles";
import { useTheme } from "@mui/system";

interface RenderTextFieldsProps {
  label?: string;
  required?: boolean;
  disabled?: boolean;
  shrink?: boolean;
  placeholder?: string;
  onChange?: Function;
  multiline?: boolean;
  value?: string;
  sx?: any;
  index?: number;
  rows?: number;
  format?: FormatType;
  startAdornment?: ReactNode;
  requiredAdornment?: boolean | string | ReactNode;
}

export default function TextBox(props: RenderTextFieldsProps) {
  const theme = useTheme();
  const {
    value: initValue, onChange, multiline, format, shrink, sx,
    startAdornment: sAdornment, requiredAdornment: rAdornment,
    ...staticProps
  } = props;
  const { required = !!rAdornment } = staticProps;

  const [value, setValue] = useState<string>(initValue || '');
  const [valid, setValid] = useState<boolean>(checkValidity(initValue, false, 'string', format));

  const onBaseChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const newValid = checkValidity(newValue, required, 'string', format);

    setValue(newValue);
    setValid(newValid);
    onChange && onChange(newValue, newValid);
  }

  return (
    <TextField
      {...staticProps}
      required={required}
      sx={parseFormFieldSx(sx, theme)}
      value={value}
      error={!valid}
      multiline={multiline || (staticProps.rows && staticProps.rows > 1) || false}
      fullWidth
      margin="dense"
      size="small"
      onChange={onBaseChange}
      InputLabelProps={{ shrink }}
      InputProps={{
        startAdornment: sAdornment && <InputAdornment position="start">{sAdornment}</InputAdornment>,
        endAdornment: required && rAdornment && <ReqAdornment value={value}>{rAdornment}</ReqAdornment>,
        sx: parseFormFieldInputSx(sx, theme),
      }}
    />
  );
}
