import {ChangeEvent} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Height from "@mui/icons-material/Height";
import Settings from "@mui/icons-material/Settings";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import useMediaQuery from "@mui/material/useMediaQuery";

import dynamic from 'next/dynamic';
import {Type} from "../../types/types";

import SpacingSelector from "../../helperComponents/looseComps/SpacingSelector";

const RenderFontsSelector = dynamic(() => import("../../helperComponents/smallpieces/RenderFontsSelector"));
const RenderFontsSizeSelector = dynamic(() => import("../../helperComponents/smallpieces/RenderFontsSizeSelector"));
const RenderFontStyles = dynamic(() => import("../../helperComponents/smallpieces/RenderFontStyles"));

interface HeadStngsProps {
  handleValues: Function;
  handleClose: () => void;
  anchor: HTMLElement;
  data?: Type;
  index: number;
}

export default function RenderHeadlineSettings({handleValues, handleClose, data, index, anchor}: HeadStngsProps) {
  const isWide = useMediaQuery("(min-width:1010px)", { noSsr: true });
  const isWideEnough = useMediaQuery("(min-width:483px)", { noSsr: true });

  const handleValue = (prop: string) => (payload: string) => {
    handleValues(prop, index)(payload);
  }

  const handleCustomFont = (event: ChangeEvent<HTMLInputElement>) => {
    handleValues('customFont', index)(event.target.checked);
  }

  return (
    <Popover
      open
      anchorEl={anchor}
      onClose={handleClose}
      anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
      transformOrigin={{vertical: 'top', horizontal: 'left'}}
    >
      <Box sx={{p: 2, width: {sm: '640px', xs: '100%'}}}>
        <Box sx={{display: 'flex'}}>
          <Settings sx={{color: theme => theme.palette.primary.dark, mr: '5px', mt: '-2px'}}/>
          <Typography sx={{fontWeight: 'bold', mb: 2}}>{'Section settings'}</Typography>
        </Box>
        <Divider sx={{my: 1}}/>
        <Box sx={{display: 'flex'}}>
          <TextFieldsIcon sx={{color: theme => theme.palette.primary.dark, mr: '5px', mt: '-2px'}}/>
          <Typography>{'Headline font'}</Typography>
        </Box>
        <FormControl>
          <FormControlLabel control={<Switch checked={data?.customFont || false} onChange={handleCustomFont} />}
                            label="Use custom headline font" />
        </FormControl>
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
                <RenderFontStyles handleValue={handleValue} property="headLineFontStyle" value={data?.headLineFontStyle}/>
              </Grid>
            </Grid>
          </Box>
        )}
        <Divider sx={{mb: 1, mt: 2}}/>
        <Box sx={{display: 'flex'}}>
          <Height sx={{color: theme => theme.palette.primary.dark, mr: '5px', mt: '-2px'}}/>
          <Typography>{'Section spacing'}</Typography>
        </Box>
        <SpacingSelector selection={data?.topSpacing || 'default'} item="topSpacing" message="Top spacing" handleValues={handleValues} index={index}/>
        <SpacingSelector selection={data?.bottomSpacing || 'default'} item="bottomSpacing" message="Bottom spacing" handleValues={handleValues} index={index}/>
        <Divider sx={{mt: 2, mb: 1}}/>
        <Box sx={{width: '100%', textAlign: 'right'}}>
          <Button onClick={handleClose} variant="outlined">Close</Button>
        </Box>
      </Box>
    </Popover>
  );
}
