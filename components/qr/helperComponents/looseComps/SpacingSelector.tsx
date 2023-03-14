import Typography from "@mui/material/Typography";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

interface SpacingProps {
  selection: string;
  item: string
  message: string;
  handleValues: Function;
  index?: number;
}

export default function SpacingSelector({selection, item, message, handleValues, index}: SpacingProps) {
  const handler = (event: SelectChangeEvent) => {
    if (index !== undefined) {
      handleValues(item, index)(event.target.value);
    } else {
      handleValues(item)(event.target.value)
    }
  }

  return (
    <>
      <Typography sx={{mt: 1}}>{message}</Typography>
      <Select
        value={selection}
        onChange={handler}
        size='small'
        fullWidth
      >
        <MenuItem value='default'>Default</MenuItem>
        <MenuItem value='narrow'>Narrow</MenuItem>
        <MenuItem value='medium'>Medium</MenuItem>
        <MenuItem value='wide'>Wide</MenuItem>
      </Select>
    </>
  );
}
