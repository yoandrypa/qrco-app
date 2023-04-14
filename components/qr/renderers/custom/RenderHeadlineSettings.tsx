import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Settings from "@mui/icons-material/Settings";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import ReplayIcon from "@mui/icons-material/Replay";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import VerticalAlignTopIcon from '@mui/icons-material/VerticalAlignTop';
import useMediaQuery from "@mui/material/useMediaQuery";

import dynamic from 'next/dynamic';
import {Type} from "../../types/types";

import SpacingSelector from "../../helperComponents/looseComps/SpacingSelector";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import RenderFontsSelector from "../../helperComponents/smallpieces/RenderFontsSelector";
import {IS_DEV_ENV} from "../../constants";

const RenderFontsSizeSelector = dynamic(() => import("../../helperComponents/smallpieces/RenderFontsSizeSelector"));
const RenderFontStyles = dynamic(() => import("../../helperComponents/smallpieces/RenderFontStyles"));

interface HeadStngsProps {
  hideHeadline: boolean;
  handleValues: Function;
  handleClose: () => void;
  anchor: HTMLElement;
  data?: Type;
  index: number;
}

export default function RenderHeadlineSettings({hideHeadline, handleValues, handleClose, data, index, anchor}: HeadStngsProps) {
  const isWide = useMediaQuery("(min-width:1010px)", { noSsr: true });
  const isWideEnough = useMediaQuery("(min-width:483px)", { noSsr: true });

  const handleValue = (prop: string) => (payload: string) => {
    handleValues(prop, index)(payload);
  }

  const handleCustomFont = (event: {target: {checked: boolean}}) => {
    handleValues('customFont', index)(event.target.checked);
  }

  const handleSectionDesign = (event: {target: {value: string}}) => {
    handleValues('sectionArrangement', index)(event.target.value);
  }

  const handleReset = () => {
    handleValue('reset')('reset');
  }

  const handle = () => {
    const isChecked = data?.hideHeadLine || false;
    handleValues('hideHeadLine', index)(!isChecked);
  };

  const customHandle = (prop: string) => () => { // @ts-ignore
    const value = data?.[prop] || false;
    handleValues(prop, index)(!value);
  }

  const showHeadline = data?.hideHeadLine === undefined || hideHeadline;
  const allowFonts = showHeadline && !hideHeadline;
  const reseteable = !(data?.topSpacing !== undefined || data?.bottomSpacing !== undefined || data?.customFont !== undefined ||
    data?.sectionArrangement !== undefined || data?.centerHeadLine !== undefined || data?.hideHeadLineIcon !== undefined || data?.hideHeadLine !== undefined);

  return (
    <Popover
      open
      anchorEl={anchor}
      onClose={handleClose}
      anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
      transformOrigin={{vertical: 'top', horizontal: 'left'}}
    >
      <Box sx={{p: 2, width: {sm: '640px', xs: '100%'}}}>
        <Box sx={{display: 'flex', mb: 1}}>
          <Settings sx={{color: theme => theme.palette.primary.dark, mr: '5px', mt: '-2px'}}/>
          <Typography sx={{fontWeight: 'bold'}}>{'Section settings'}</Typography>
        </Box>
        {!hideHeadline && (<>
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
        </>)}
        {allowFonts && (<>
          <Divider sx={{my: 1}}/>
          <Box sx={{display: 'flex'}}>
            <TextFieldsIcon sx={{color: theme => theme.palette.primary.dark, mr: '5px', mt: '-2px'}}/>
            <Typography sx={{fontWeight: 'bold'}}>{'Headline font'}</Typography>
          </Box>
          <FormControl>
            <FormControlLabel label="Use custom headline font" control={<Switch checked={data?.customFont || false} onChange={handleCustomFont} />} />
          </FormControl>
        </>)}
        {data?.customFont && (
          <Box sx={{mt: 2}}>
            <Grid container spacing={2}>
              <Grid item xs={isWide ? 4 : 12}>
                <RenderFontsSelector handleSelect={handleValue} property="headlineFont" value={data?.headlineFont || "none"} label="Font"/>
              </Grid>
              <Grid item xs={isWide ? 4 : isWideEnough ? 6 : 12}>
                <RenderFontsSizeSelector handleSelect={handleValue} property="headlineFontSize" value={data?.headlineFontSize || "default"} label="Size"/>
              </Grid>
              <Grid item xs={isWide ? 4 : isWideEnough ? 6 : 12}>
                <RenderFontStyles handleValue={handleValue} property="headLineFontStyle" value={data?.headLineFontStyle} />
              </Grid>
            </Grid>
          </Box>
        )}
        {allowFonts && (<>
          <Divider sx={{my: 1}}/>
          <Box sx={{display: 'flex'}}>
            <VerticalSplitIcon sx={{color: theme => theme.palette.primary.dark, mr: '5px', mt: '-2px'}}/>
            <Typography sx={{fontWeight: 'bold'}}>{'Section arrangement mode'}</Typography>
          </Box>
          <Select value={data?.sectionArrangement || 'default'} onChange={handleSectionDesign} size='small' fullWidth>
            <MenuItem value='default'>Default</MenuItem>
            <MenuItem value='collapsible'>Classic collapsible</MenuItem>
            <MenuItem value='collapseButton'>Button collapsible</MenuItem>
            {IS_DEV_ENV && <MenuItem value='tabbed'>Tabbed</MenuItem>}
          </Select>
        </>)}
        <Divider sx={{my: 1}}/>
        <Box sx={{display: 'flex'}}>
          <ImportExportIcon sx={{color: theme => theme.palette.primary.dark, mr: '5px', mt: '-2px'}}/>
          <Typography sx={{fontWeight: 'bold'}}>{'Section spacing'}</Typography>
        </Box>
        <SpacingSelector selection={data?.topSpacing || 'default'} item="topSpacing" message="Top spacing" handleValues={handleValues} index={index}/>
        <SpacingSelector selection={data?.bottomSpacing || 'default'} item="bottomSpacing" message="Bottom spacing" handleValues={handleValues} index={index}/>
        <Divider sx={{mt: 2, mb: 1}}/>
        <Box sx={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
          <Button onClick={handleReset} variant="outlined" startIcon={<ReplayIcon />} disabled={reseteable}>
            {'Reset'}
          </Button>
          <Button onClick={handleClose} variant="outlined">{'Close'}</Button>
        </Box>
      </Box>
    </Popover>
  );
}
