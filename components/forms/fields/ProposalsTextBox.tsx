import React, { ReactNode, useState } from "react";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import ReqAdornment from "../helpers/RequiredAdornment";

import { checkValidity, FormatType } from "../helpers/validations";
import { parseFormFieldSx, parseFormFieldInputSx } from "../helpers/styles";
import { useTheme } from "@mui/system";

interface PropsType {
  label?: string;
  required?: boolean;
  disabled?: boolean;
  shrink?: boolean;
  placeholder?: string;
  onChange?: Function;
  value?: string;
  sx?: any;
  index?: number;
  options: string[];
  format?: FormatType;
  startAdornment?: ReactNode;
  requiredAdornment?: boolean | string | ReactNode;
}

export default function ProposalsTextBox(props: PropsType) {
  const theme = useTheme();
  const {
    value: initValue, onChange, options, format, sx, shrink,
    startAdornment: sAdornment, requiredAdornment: rAdornment,
    ...staticProps
  } = props;
  const { required = !!rAdornment } = staticProps;

  const [value, setValue] = useState<string>(initValue || '');
  const [valid, setValid] = useState<boolean>(checkValidity(initValue, false, 'string', format));

  const onBaseChange = (event: any, newValue: string) => {
    const newValid = checkValidity(newValue, required, 'string', format);

    setValue(newValue);
    setValid(newValid);
    onChange && onChange(newValue, newValid);
  }

  return (
    <Autocomplete
      freeSolo
      value={value}
      onChange={onBaseChange}
      onInputChange={onBaseChange}
      disableClearable
      fullWidth
      options={options}
      renderInput={(params) => (
        <TextField
          {...staticProps}
          {...params}
          required={required}
          sx={parseFormFieldSx(sx, theme)}
          fullWidth
          size="small"
          margin="dense"
          error={!valid}
          InputLabelProps={{ shrink }}
          InputProps={{
            ...params.InputProps,
            startAdornment: sAdornment && <InputAdornment position="start">{sAdornment}</InputAdornment>,
            endAdornment: required && rAdornment && <ReqAdornment value={value}>{rAdornment}</ReqAdornment>,
            sx: parseFormFieldInputSx(sx, theme),
          }}
        />
      )}
    />
  );
}
