import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import {ChangeEvent, memo} from "react";
import Box from "@mui/material/Box";

interface HeadLineProps {
  index: number;
  hideHeadLine?: boolean;
  centerHeadLine?: boolean;
  handleValues: Function;
  reverse?: boolean;
}

const RenderHeadline = ({index, hideHeadLine, centerHeadLine, handleValues, reverse}: HeadLineProps) => {
  const handle = (event: ChangeEvent<HTMLInputElement>) => {
    let isChecked = event.target.checked;
    if (reverse) {
      isChecked = !isChecked;
    }
    handleValues('hideHeadLine', index)(!isChecked);
  };

  let checked = hideHeadLine === undefined || !hideHeadLine;
  if (reverse) {
    checked = !checked;
  }
  return (
    <Box sx={{display: 'flex', mt: '-5px', flexDirection: {sm: 'row', xs: 'column'}}}>
      <FormControl>
        <FormControlLabel control={<Switch onChange={handle} checked={checked}/>} label="Show headline for this section"/>
      </FormControl>
      <FormControl sx={{ml: '5px'}}>
        <FormControlLabel
          disabled={Boolean(hideHeadLine)}
          control={
            <Switch onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleValues('centerHeadLine', index)(event.target.checked)
            } checked={centerHeadLine || false}/>
          }
          label="Center headline"/>
      </FormControl>
    </Box>
  )
};

const notIf = (current: HeadLineProps, next: HeadLineProps) => (
  current.index === next.index &&
  current.hideHeadLine === next.hideHeadLine &&
  current.centerHeadLine === next.centerHeadLine
);

export default memo(RenderHeadline, notIf);
