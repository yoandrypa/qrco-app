'use strict'

import {useState} from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import InputAdornment from "@mui/material/InputAdornment";
import SouthEastIcon from "@mui/icons-material/SouthEast";
import SouthWestIcon from "@mui/icons-material/SouthWest";
import SouthIcon from "@mui/icons-material/South";
import EastIcon from "@mui/icons-material/East";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {styled} from "@mui/material/styles";

// @ts-ignore
import {SketchPicker} from "react-color";
import {COLORS, DEFAULT_COLORS} from "../../constants";
import RenderColorPreset from "./RenderColorPreset";
import useMediaQuery from "@mui/material/useMediaQuery";

interface ColorSelProps {
  colorLeft?: string;
  colorRight?: string;
  direction?: string;
  handleData: Function;
}

interface IconProps {
  selected: boolean;
}

const IconBtn = styled(IconButton)(({selected}: IconProps) => ({
  width: '32px', height: '32px', borderRadius: '50%',
  border: 'solid 1px #c4c4c4',
  boxShadow: selected ? '0 0 3px 2px #286ED6' : 'none',
  '&:hover': {boxShadow: !selected ? '0 0 2px 2px #849abb' : '0 0 2px 2px #286ED6'}
}));

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
      <Grid item xs={12} >
        <Typography>{'Presets'}</Typography>
        {COLORS.map(x => {
          const selected = (!colorLeft && !colorRight && x.p === DEFAULT_COLORS.p && x.s === DEFAULT_COLORS.s) ||
            (x.p === colorLeft && x.s === colorRight);
          return <RenderColorPreset handleValue={handleData} colors={x} selected={selected} gradient key={x.p} />
        })}
      </Grid>
      <Grid sm={widePrev && isWideForPreview? 8 : 12} xs={12} item>
        <TextField
          sx={{
            '& .MuiInputBase-input': { backgroundImage: `linear-gradient(${direction === undefined ? '90deg' : direction}, ${colorLeft}, ${colorRight})` }
          }}
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
        <Stack direction="row" spacing={2} sx={{mt: widePrev && isWideForPreview ? 0 : '-8px'}}>
          <IconBtn selected={direction === undefined || direction === '90deg'} onClick={handleDirection('90deg')}>
            <EastIcon />
          </IconBtn>
          <IconBtn selected={direction === '180deg'} onClick={handleDirection('180deg')}>
            <SouthIcon />
          </IconBtn>
          <IconBtn selected={direction === '135deg'} onClick={handleDirection('135deg')}>
            <SouthEastIcon />
          </IconBtn>
          <IconBtn selected={direction === '225deg'} onClick={handleDirection('225deg')}>
            <SouthWestIcon />
          </IconBtn>
        </Stack>
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
