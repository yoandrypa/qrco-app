import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {FormControl, InputLabel} from "@mui/material";

import {FONTS} from "../../constants";
import {FontTypes} from "../../types/types";
import {memo} from "react";

interface RenderFontsSelProps {
  handleSelect: Function;
  property: string;
  value: string;
  label: string;
}

const RenderFontsSelector = ({handleSelect, property, value, label}: RenderFontsSelProps) => {
  const beforeSend = (event: SelectChangeEvent): void => {
    handleSelect(property)(event.target.value);
  }

  return (
    <FormControl fullWidth size="small">
      <InputLabel id={`${property}FontSelect`}>{label}</InputLabel>
      <Select
        labelId={`${property}FontSelect`}
        sx={{ fontFamily: FONTS.find((x: FontTypes) => x.name === value)?.type || 'unset' }}
        fullWidth
        label={label}
        value={value}
        onChange={beforeSend}
      >
        <MenuItem key={`${property}FontSelectSameAs`} value={'none'}><em>{'Same as the global font'}</em></MenuItem>
        {FONTS.map((x: FontTypes) => (
          <MenuItem key={`${property}FontSelect${x.name}`} sx={{fontFamily: x.type}} value={x.name}>{x.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default memo(RenderFontsSelector, (current, next) => current.value === next.value);
