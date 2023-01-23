'use strict'

import {useState} from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";

// @ts-ignore
import {SketchPicker} from "react-color";
import {COLORS} from "../../constants";
import RenderColorPreset from "./RenderColorPreset";

import dynamic from "next/dynamic";

const RenderDirectionSelector = dynamic(() => import("../../helperComponents/smallpieces/RenderDirectionSelector"));

interface ColorSelProps {
  colorLeft?: string;
  colorRight?: string;
  direction?: string;
  handleData: Function;
}

const RenderGradientSelector = ({ direction, colorLeft, handleData, colorRight }: ColorSelProps) => {
  const [anchor, setAnchor] = useState<HTMLDivElement | null>(null);
  const widePrev = useMediaQuery("(min-width:972px)", { noSsr: true });
  const isWideForPreview = useMediaQuery("(min-width:720px)", { noSsr: true });

  // @ts-ignore
  const handlePicker = ({ currentTarget }) => {
    setAnchor(currentTarget);
  };

  const handleColor = (payload: { hex: any; }) => { // @ts-ignore
    handleData(anchor.id === 'left' ? 'backgroundColor' : 'backgroundColorRight')(payload.hex);
  };

  const handleDirection = (value: string) => () => {
    handleData('backgroundDirection')(value);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sx={{mb: '-17px'}}>
        {COLORS.map(x => {
          const selected = x.s === colorLeft && x.p === colorRight;
          return <RenderColorPreset handleValue={handleData} colors={{p: x.s, s: x.p}} selected={selected} gradient key={x.p} />
        })}
      </Grid>
      <Grid sm={widePrev && isWideForPreview? 8 : 12} xs={12} item>
        <TextField
          sx={{'& .MuiInputBase-input': { backgroundImage: `linear-gradient(${direction === undefined ? '180deg' : direction}, ${colorLeft}, ${colorRight})` }}}
          size="small"
          fullWidth
          margin="dense"
          variant="outlined"
          InputProps={{
            readOnly: true,
            startAdornment: (
              <InputAdornment position="start" sx={{ mt: '5px', ml: '-5px' }}>
                <Box sx={{ display: 'flex'}}>
                  <Box
                    id="left"
                    sx={{
                      cursor: 'pointer',
                      p: '3px',
                      mt: '-5px',
                      ml: '-9px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '5px',
                      border: 'solid 1px black',
                      borderColor: theme => theme.palette.text.disabled,
                      backgroundClip: 'content-box',
                      backgroundColor: colorLeft || 'inherit'
                    }}
                    onClick={handlePicker} />
                    <Typography sx={{ml: '10px', mt: '3px', display: {xs: 'none', sm: 'none', md: 'block'}}}>{colorLeft}</Typography>
                </Box>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end" sx={{mt: '5px', mr: '-5px'}}>
                <Box sx={{display: 'flex'}}>
                  <Typography sx={{mr: '10px', mt: '3px', display: {xs: 'none', sm: 'none', md: 'block'}}}>{colorRight}</Typography>
                  <Box
                    id="right"
                    sx={{
                      cursor: 'pointer',
                      p: '3px',
                      mt: '-5px',
                      mr: '-9px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '5px',
                      border: 'solid 1px black',
                      borderColor: theme => theme.palette.text.disabled,
                      backgroundClip: 'content-box',
                      backgroundColor: colorRight || 'inherit'
                    }}
                    onClick={handlePicker}/>
                </Box>
              </InputAdornment>
            )
          }}
        />
      </Grid>
      <Grid sm={widePrev && isWideForPreview ? 4 : 12} xs={12} item sx={{my: 'auto'}}>
        <RenderDirectionSelector handleDirection={handleDirection} direction={direction} isWide={widePrev && isWideForPreview} />
      </Grid>
      {anchor && (
        <Popover
          id="reasonPopover"
          open
          anchorEl={anchor}
          onClose={() => { setAnchor(null); }}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <SketchPicker
            color={anchor.id === 'left' ? colorLeft : colorRight}
            onChangeComplete={handleColor} disableAlpha presetColors={[]}/>
        </Popover>
      )}
    </Grid>
  );
};

export default RenderGradientSelector;
