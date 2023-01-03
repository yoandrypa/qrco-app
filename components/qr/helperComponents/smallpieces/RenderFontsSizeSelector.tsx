import Select, {SelectChangeEvent} from "@mui/material/Select";
import {capitalize, FormControl, InputLabel} from "@mui/material";
import {FONT_SIZES, FONTS} from "../../constants";
import {FontTypes} from "../../types/types";
import MenuItem from "@mui/material/MenuItem";

interface RenderFontSizeSelProps {
  handleSelect: Function;
  property: string;
  value: string;
  label: string;
}

const RenderFontsSizeSelector = ({handleSelect, property, value, label}: RenderFontSizeSelProps) => {
  const beforeSend = (event: SelectChangeEvent): void => {
    handleSelect(property)(event.target.value);
  }

  return (
    <FormControl fullWidth size="small">
      <InputLabel id={`${property}FontSizeSelect`}>{label}</InputLabel>
      <Select
        labelId={`${property}FontSizeSelect`}
        sx={{ fontFamily: FONTS.find((x: FontTypes) => x.name === value)?.type || 'unset' }}
        fullWidth
        label={label}
        value={value}
        onChange={beforeSend}
      >
        {FONT_SIZES.map((x: string) => (
          <MenuItem key={`${property}FontSizeSelect${x}`} value={x}>{capitalize(x)}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default  RenderFontsSizeSelector;
