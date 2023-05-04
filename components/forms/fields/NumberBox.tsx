import React, { ChangeEvent, ReactNode, useState } from "react";

import { isEmpty } from "@ebanux/ebanux-utils/utils";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import ReqAdornment from "../helpers/RequiredAdornment";

import { checkValidity } from "../helpers/validations";
import { useTheme } from "@mui/system";

interface PropsType {
  label?: string;
  required?: boolean;
  disabled?: boolean;
  shrink?: boolean;
  placeholder?: string;
  onChange?: Function;
  value?: number;
  sx?: any;
  index?: number;
  min?: number;
  max?: number;
  startAdornment?: ReactNode;
  requiredAdornment?: boolean | string | ReactNode;
}

export default function NumberBox(props: PropsType) {
  const theme = useTheme();
  const {
    value: initValue, onChange, sx, shrink,
    min = Number.MIN_VALUE, max = Number.MAX_VALUE,
    startAdornment: sAdornment, requiredAdornment: rAdornment,
    ...staticProps
  } = props;
  const { required = !!rAdornment } = staticProps;

  const format = (value: number) => (value >= min && value <= max)

  const [value, setValue] = useState<number>(initValue !== undefined ? initValue : min || 0);
  const [valid, setValid] = useState<boolean>(checkValidity(initValue, false, 'number', format));

  const onBaseChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(min, Math.min(max, parseFloat(event.target.value || '0')));
    const newValid = checkValidity(newValue, required, 'number', format);

    setValue(newValue);
    setValid(newValid);
    onChange && onChange(newValue, newValid);
  }

  return (
    <TextField
      {...staticProps}
      required={required}
      sx={sx}
      type="number"
      value={isEmpty(value) ? '' : value}
      error={!valid}
      fullWidth
      margin="dense"
      size="small"
      onChange={onBaseChange}
      InputLabelProps={{ shrink }}
      InputProps={{
        // @ts-ignore
        inputMode: 'numeric', step: "any", pattern: ' ^[-,0-9]+$', min, max,
        startAdornment: sAdornment && <InputAdornment position="start">{sAdornment}</InputAdornment>,
        endAdornment: required && rAdornment && <ReqAdornment value={String(value)}>{rAdornment}</ReqAdornment>,
      }}
    />
  );
}
