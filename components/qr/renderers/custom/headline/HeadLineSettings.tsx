import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {Type} from "../../../types/types";

interface Props {
  showHeadline: boolean;
  handleValues: Function;
  index: number;
  data?: Type;
}

export default function HeadLineSettings({showHeadline, handleValues, index, data}: Props) {
  const handle = () => {
    const isChecked = data?.hideHeadLine || false;
    handleValues('hideHeadLine', index)(!isChecked);
  };

  const customHandle = (prop: string) => () => { // @ts-ignore
    const value = data?.[prop] || false;
    handleValues(prop, index)(!value);
  }

  return (
    <>
      <Divider sx={{my: 1}}/>
      <Box sx={{display: 'flex'}}>
        <VerticalAlignTopIcon sx={{color: theme => theme.palette.primary.dark, mr: '5px', mt: '-2px'}}/>
        <Typography sx={{fontWeight: 'bold'}}>{'Headline settings'}</Typography>
      </Box>
      <Box sx={{ml: '5px'}}>
        <FormControlLabel label="Visible" control={
          <Checkbox sx={{'& .MuiSvgIcon-root': {fontSize: 22}}} checked={showHeadline} onChange={handle}/>} />
        <FormControlLabel label="Centered" control={
          <Checkbox sx={{'& .MuiSvgIcon-root': {fontSize: 22}}} checked={data?.centerHeadLine || false} disabled={!showHeadline} onChange={customHandle('centerHeadLine')}/>} />
        <FormControlLabel label="Hide icon" control={
          <Checkbox sx={{'& .MuiSvgIcon-root': {fontSize: 22}}} checked={data?.hideHeadLineIcon || false} disabled={!showHeadline} onChange={customHandle('hideHeadLineIcon')}/>} />
      </Box>
    </>
  )
}
