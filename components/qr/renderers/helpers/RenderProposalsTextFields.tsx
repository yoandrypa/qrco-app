import {memo} from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {areEquals} from "../../../helpers/generalFunctions";

interface RenderTextFieldsProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  handleValues: Function;
  isError?: boolean;
  value: string;
  item?: string;
  options: string[];
}

const RenderProposalsTextFields = ({ value, handleValues, placeholder, label, item, required, isError, options }: RenderTextFieldsProps) => {
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
      renderInput={params => (
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
            endAdornment: (
              required && !value.trim().length ? (
                <InputAdornment position="end">
                  <Typography color="error" sx={{ mr: '7px' }}>{'REQUIRED'}</Typography>
                </InputAdornment>
              ) : null
            )
          }}
        />
      )}
      options={options}
    />);
};

const notIf = (current: RenderTextFieldsProps, next: RenderTextFieldsProps) => (
  current.value === next.value && current.isError === next.isError && areEquals(current.options, next.options)
);

export default memo(RenderProposalsTextFields, notIf);
