import React, {memo} from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import RequiredAdornment from "./RequiredAdornment";

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
}

const RenderProposalsTextFields = ({ value, handleValues, placeholder, label, item, required, isError, options, index }: RenderTextFieldsProps) => {
  const handleBefore = (newValue: string | null) => {
    const value = newValue || '';
    if (item !== undefined) {
      handleValues(item)(value);
    } else {
      handleValues(value || '');
    }
  }

  return (
    <Autocomplete
      freeSolo
      value={value}
      onChange={(event: any, newValue: string | null) => { handleBefore(newValue); }}
      inputValue={value}
      onInputChange={(event, newInputValue) => { handleBefore(newInputValue); }}
      disableClearable
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          required={required}
          size="small"
          margin="dense"
          placeholder={placeholder}
          label={label}
          error={isError}
          InputProps={{
            ...params.InputProps,
            endAdornment: (required && <RequiredAdornment value={value} />),
          }}
        />
      )}
      options={options}
    />);
};

// @ts-ignore
function notIf(current, next) {
  return current.value === next.value && current.isError === next.isError && current.index === next.index;
}

export default memo(RenderProposalsTextFields, notIf);
