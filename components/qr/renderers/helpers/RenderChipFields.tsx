import React from "react";
import { Autocomplete, Chip, FormControl, InputLabel, TextField } from "@mui/material";

interface RenderChipFieldsProps {
  label?: string;
  placeHolder?:string;
  required?: boolean;
  handleValues:(values: string[]) => void;
  isError?: boolean;
  values: string[];
  item?: string;
  options?: string[];
  freeSolo?: boolean;
}

const RenderChipFields = ({values, handleValues, label, item, required, isError, options,freeSolo, placeHolder}: RenderChipFieldsProps) => {
  if(!options) options = [];
  const newOptions = [...options];
  if(freeSolo !== false)
    newOptions.push("Add New");
  return (
  <FormControl fullWidth error={isError} required={required} size='small' margin="dense">
      <Autocomplete
      value={values}
      onChange={(event, newValue, reason) => {
        handleValues(newValue);
      }}
      multiple
      id="tags-filled"
      options={newOptions}
      freeSolo= {freeSolo||true}
      getOptionDisabled={(option) => option === "Add New"}
      renderTags={(value: readonly string[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip variant="outlined" label={option} {...getTagProps({ index })} key={`chip-${option}`}/>
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          variant="filled"
          label={label}
          placeholder={placeHolder||''}
        />
      )}
    />
  </FormControl>
);}

export default RenderChipFields
