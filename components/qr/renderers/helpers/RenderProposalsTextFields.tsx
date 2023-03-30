import React, { useState, SyntheticEvent } from "react";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import RequiredAdornment from "./RequiredAdornment";

import { checkValidity, FormatType } from "../../../../libs/utils/check_validity";

interface RenderTextFieldsProps {
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
}

const RenderProposalsTextFields = (props: RenderTextFieldsProps) => {
  const { value: initValue, placeholder, label, item, options } = props;
  const { handleValues, required, format, isError } = props;

  const [value, setValue] = useState<string>(initValue);

  const onChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
    item ? handleValues(item)(newValue) : handleValues(newValue);
  }

  const valid = checkValidity(value, !!required, 'string', format);

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
            endAdornment: (required && <RequiredAdornment value={value} />),
          }}
        />
      )}
    />);
};

export default RenderProposalsTextFields;
