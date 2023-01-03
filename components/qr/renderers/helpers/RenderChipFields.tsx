import React from "react";
import { Autocomplete, Chip, FormControl, InputLabel, TextField } from "@mui/material";

interface RenderChipFieldsProps {
  label?: string;
  required?: boolean;
  handleValues:(values: string[]) => void;
  isError?: boolean;
  values: string[];
  item?: string;
  options: string[];
}

const RenderChipFields = ({values, handleValues, label, item, required, isError, options}: RenderChipFieldsProps) => {
    return (
    <FormControl fullWidth error={isError} required={required} size='small' margin="dense">
        <InputLabel id={`${item}-label`}>{label}</InputLabel>
        <Autocomplete
        value={values}
        onChange={(event, newValue, reason) => {
          handleValues(newValue);
        }}
        multiple
        id="tags-filled"
        options={options}
        freeSolo
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip variant="outlined" label={option} {...getTagProps({ index })} key={`chip-${option}`}/>
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="filled"
            label="Categories"
            placeholder="Add Categories"
          />
        )}
      />
    </FormControl>
);}

export default RenderChipFields
