import React, { useState, SyntheticEvent, ReactNode, ChangeEvent } from "react";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import RequiredAdornment from "../helpers/RequiredAdornment";

import { checkValidity, FormatType } from "../helpers/validations";

interface PropsType {
  label?: string;
  required?: boolean;
  placeholder?: string;
  handleValues: Function;
  isError?: boolean;
  value: string;
  item?: string;
  index?: number;
  options: string[];
  format?: FormatType;
  startAdornment?: ReactNode;
}

export default function ProposalsTextBox(props: PropsType) {
  const { value: initValue, placeholder, label, item, options } = props;
  const { handleValues, startAdornment, required, format, isError } = props;
  const [value, setValue] = useState<string>(initValue);
  const [wasEdited, setWasEdited] = useState<boolean>(false);

  const onChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
    if (!wasEdited) setWasEdited(true);
    item ? handleValues(item)(newValue) : handleValues(newValue);
  }

  const isRequired = !!required && wasEdited;
  const valid = checkValidity(value, isRequired, 'string', format);

  return (
    <Autocomplete
      freeSolo
      value={value}
      onChange={onChange}
      inputValue={value}
      onInputChange={onChange}
      disableClearable
      options={options}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          required={required}
          size="small"
          margin="dense"
          placeholder={placeholder}
          label={label}
          error={isError || !valid}
          InputProps={{
            ...params.InputProps,
            startAdornment: startAdornment && <InputAdornment position="start">{startAdornment}</InputAdornment>,
            endAdornment: (required && <RequiredAdornment value={value} />),
          }}
        />
      )}
    />
  );
}
