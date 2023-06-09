import Typography from "@mui/material/Typography";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {ReactNode} from "react";
import Box from "@mui/material/Box";

interface SpacingProps {
  selection: string;
  item: string;
  icon?: ReactNode;
  message: string;
  handleValues: Function;
  index?: number;
  noNarrow?: boolean;
  includeSmall?: boolean;
}

export default function SpacingSelector({selection, item, message, handleValues, index, icon, noNarrow, includeSmall}: SpacingProps) {
  const handler = (event: SelectChangeEvent) => {
    if (index !== undefined) {
      handleValues(item, index)(event.target.value);
    } else {
      handleValues(item)(event.target.value)
    }
  }

  return (
    <>
      <Box sx={{display: 'flex', mt: 1}}>
        {icon}
        <Typography>{message}</Typography>
      </Box>
      <Select
        value={selection}
        onChange={handler}
        size='small'
        fullWidth
      >
        {!noNarrow && <MenuItem value='narrow'>Narrow</MenuItem>}
        {includeSmall && <MenuItem value='small'>Small</MenuItem>}
        <MenuItem value='default'>Default</MenuItem>
        <MenuItem value='medium'>Medium</MenuItem>
        <MenuItem value='wide'>Wide</MenuItem>
      </Select>
    </>
  );
}
