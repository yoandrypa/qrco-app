import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import {ChangeEvent, memo} from "react";

interface HeadLineProps {
  index: number;
  checked?: boolean;
  handleValues: Function;
}

const RenderHeadline = ({index, checked, handleValues}: HeadLineProps) => (
  <FormControl sx={{mt: '-5px'}}>
    <FormControlLabel
      control={
        <Switch onChange={(event: ChangeEvent<HTMLInputElement>) =>
          handleValues('hideHeadLine', index)(!event.target.checked)
        } checked={checked === undefined || !checked} />
      }
      label="Show headline for this section" />
  </FormControl>
);

const notIf = (current: HeadLineProps, next: HeadLineProps) => (
  current.index === next.index && current.checked === next.checked
);

export default memo(RenderHeadline, notIf);
