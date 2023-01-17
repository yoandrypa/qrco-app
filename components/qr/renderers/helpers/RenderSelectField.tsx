import {memo} from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface RenderSelectFieldsProps {
  label?: string;
  required?: boolean;
  handleValues: Function;
  isError?: boolean;
  value: string;
  item?: string;
  options: {value: string, label: string}[];
  whatSave?: 'label' | 'value';
}

const RenderSelectFields = ({value, handleValues, label, item, required, isError, options, whatSave}: RenderSelectFieldsProps) => (
    <FormControl fullWidth error={isError} required={required} size='small' margin="dense">
        <InputLabel id={`${item}-label`}>{label}</InputLabel>
        <Select labelId={`${item}-select`} id={item} value={value} label={label} onChange={item !== undefined ? handleValues(item) : handleValues}>
            <MenuItem disabled value="select"><em>Select one</em></MenuItem>
            <MenuItem value="">None</MenuItem>
            {options.map((option) => (
                <MenuItem key={option.value} value={whatSave? option[whatSave] : option.value}>{option.label}</MenuItem>
            ))}
        </Select>
    </FormControl>
);

// @ts-ignore
function notIf(current, next) {
  return current.value === next.value && current.isError === next.isError;
}

export default memo(RenderSelectFields, notIf);
