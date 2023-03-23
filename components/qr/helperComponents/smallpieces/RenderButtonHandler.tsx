import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import {useTheme} from "@mui/system";

import dynamic from "next/dynamic";

import RenderMainFontsHandler from "./RenderMainFontsHandler";
import RenderHandleOpacityBlurness from "./RenderHandleOpacityBlurness";
import {CustomCommon} from "../../types/types";
import SectionSelector from "../SectionSelector";
import ColorSelector from "../ColorSelector";
import {DEFAULT_COLORS} from "../../constants";
import {ChangeEvent} from "react";
import SpacingSelector from "../looseComps/SpacingSelector";
import RenderDisplacement from "../looseComps/RenderDisplacement";

const RenderBorders = dynamic(() => import("../looseComps/RenderBorders"));
const RenderCustButtons = dynamic(() => import("../looseComps/RenderCustButtons"));
const RenderTwoColors = dynamic(() => import("./RenderTwoColors"));

export default function RenderButtonHandler({data, handleValue}: CustomCommon) {
  const isWide = useMediaQuery("(min-width:900px)", {noSsr: true});
  const isWideEnough = useMediaQuery("(min-width:815px)", {noSsr: true});

  const theme = useTheme();

  const renderShape = (item: number) => {
    const sx = {
      width: '60px',
      height: '30px',
      border: `solid 2px ${theme.palette.primary.dark}`,
      background: theme.palette.primary.light
    } as any;

    if (item !== 0) {
      if (item === 1) {
        sx.borderRadius = '10px';
      } else if (item === 2) {
        sx.borderRadius = '15px';
      } else if (item === 3) {
        sx.borderRadius = '50%';
      } else if (item === 4) {
        sx.borderRadius = '25px 8px 12px 0';
      } else if (item === 5) {
        sx.borderRadius = !data?.flipVertical ? '25px 0' : '0 25px';
      } else if (item === 6) {
        let radius = '25px 0 0 25px';
        if (data?.flipVertical && !data.flipHorizontal) {
          radius = '25px 25px 0 0';
        } else if (data?.flipHorizontal && !data.flipVertical) {
          radius = '0 25px 25px 0';
        } else if (data?.flipHorizontal && data.flipVertical) {
          radius = '0 0 25px 25px';
        }
        sx.borderRadius = radius;
      } else {
        sx.transform = `perspective(10px) rotateX(${data?.flipVertical ? 5 : -5}deg)`;
        sx.mt = data?.flipVertical ? '-5px' : '4px';
      }
    }

    if (data?.buttonShadow) {
      sx.boxShadow = '3px 3px 2px #00000099';
    }

    return (
      <SectionSelector
        selected={(!data?.buttonShape && item === 1) || (data?.buttonShape === `${item}`)}
        property={`${item}`} h={'40px'} w={'70px'} separate handleSelect={handleValue('buttonShape')}>
          <Box sx={sx}/>
      </SectionSelector>
    )
  };

  const handler = (prop: string) => (event: SelectChangeEvent) => {
    handleValue(prop)(event.target.value);
  };

  const handleShadow = (event: ChangeEvent<HTMLInputElement>) => {
    handleValue('buttonShadow')(event.target.checked);
  };

  const handleUpcase = (event: ChangeEvent<HTMLInputElement>) => {
    handleValue('buttonCase')(event.target.checked);
  };

  return (
    <Box sx={{mt: 1}}>
      <RenderMainFontsHandler handleValue={handleValue} data={data}/>
      <Box sx={{p: 1}}>
        <Typography>{'Shape'}</Typography>
        {[...Array(8).keys()].map(x => renderShape(x))}
      </Box>
      <Box sx={{mt: '-10px', mb: '15px', ml: 1}}>
        {['4', '5', '6', '7'].includes(data?.buttonShape || '') && (
          <Box sx={{display: 'inline-block'}}>
            {data?.buttonShape === '4' && <RenderBorders handleValue={handleValue} data={data} />}
            {data?.buttonShape === '5' && <RenderCustButtons handleValue={handleValue} data={data} />}
            {data?.buttonShape === '6' && <RenderCustButtons handleValue={handleValue} data={data} handleHoriz />}
            {data?.buttonShape === '7' && <RenderCustButtons handleValue={handleValue} data={data} />}
          </Box>
        )}
        <FormControl sx={{ mt: !isWide ? 0 : (data?.buttonShape === '4' ? 1 : 0), ml: 1}}>
          <FormControlLabel control={<Switch checked={data?.buttonShadow || false} onChange={handleShadow} />}
                            label="Add shadow" />
        </FormControl>
        <FormControl sx={{ mt: !isWide ? 0 : (data?.buttonShape === '4' ? 1 : 0), ml: 1}}>
          <FormControlLabel control={<Switch checked={data?.buttonCase || false} onChange={handleUpcase} />}
                            label="Case sensitive" />
        </FormControl>
      </Box>
      {data?.alternate && (
        <Typography sx={{ml: 1, mb: '15px', mt: '-15px', fontSize: 'smaller', color: theme => theme.palette.text.disabled}}>
          {'Alternate will only affect those cases with several buttons in the same section'}
        </Typography>
      )}
      <Box sx={{p: 1, mt: '-20px'}}>
        <Typography>{'Background'}</Typography>
        <Box sx={{display: 'flex', flexDirection: isWide && isWideEnough ? 'row' : 'column', width: '100%'}}>
          <FormControl sx={{m: 0, mt: 1, width: '100%'}} size="small">
            <InputLabel id="buttonBackColor">Behaviour</InputLabel>
            <Select
              labelId="buttonBackColor"
              id="buttonBackColor"
              value={data?.buttonBack || 'default'}
              label="Behaviour"
              onChange={handler('buttonBack')}
            >
              <MenuItem value="default">Use main colors as default behaviour</MenuItem>
              <MenuItem value="solid">Keep same color even on hover</MenuItem>
              <MenuItem value="two">Custom primary and secondary colors</MenuItem>
              <MenuItem value="gradient">Gradient custom primary and secondary colors</MenuItem>
            </Select>
          </FormControl>
          {data?.buttonBack === 'solid' && (
            <Box sx={{width: isWide && isWideEnough ? '45%' : '100%', ml: isWide && isWideEnough ? '5px' : 0}}>
              <ColorSelector label="" color={data?.buttonBackColor || data?.primary || DEFAULT_COLORS.p}
                             handleData={handleValue} property="buttonBackColor"/>
            </Box>
          )}
        </Box>
        {data?.buttonBack === 'two' && <RenderTwoColors handleValue={handleValue} data={data} property="buttonBackColor"/>}
        {data?.buttonBack === 'gradient' && <RenderTwoColors handleValue={handleValue} data={data} isGradient property="buttonBackColor"/>}
        {data?.buttonBack !== 'gradient' && !data?.buttonShadowDisplacement &&
          (
            <Box sx={{width: 'calc(100% - 10px)'}}>
              <RenderHandleOpacityBlurness
                value={data?.buttonsOpacity !== undefined ? data?.buttonsOpacity : 1}
                handleValue={handleValue}
                property="buttonsOpacity"
                message="Button's background opacity"
                keepContainerWidth />
            </Box>
          )
        }
      </Box>
      <Box sx={{p: 1, mt: '-15px'}}>
        <Typography>{'Borders'}</Typography>
        <Grid container spacing={2}>
          <Grid item sm={data?.buttonBorderStyle && data?.buttonBorderStyle !== 'noBorders' ? 4 : 12} xs={12}>
            <FormControl sx={{m: 0, mt: 1, width: '100%'}} size="small">
              <InputLabel id="buttonBorderColorLabel">Color</InputLabel>
              <Select
                labelId="buttonBorderColorLabel"
                id="buttonBorderStyle"
                value={data?.buttonBorderStyle || 'noBorders'}
                label="Color"
                onChange={handler('buttonBorderStyle')}
              >
                <MenuItem value="default">Use main colors</MenuItem>
                <MenuItem value="two">Custom colors</MenuItem>
                <MenuItem value="noBorders">No borders</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {data?.buttonBorderStyle && data?.buttonBorderStyle !== 'noBorders' && (
            <>
              <Grid item sm={4} xs={12}>
                <FormControl sx={{m: 0, mt: 1, width: '100%'}} size="small">
                  <InputLabel id="buttonBorderTypeLabel">Style</InputLabel>
                  <Select
                    labelId="buttonBorderTypeLabel"
                    id="buttonBorderType" label="Style"
                    value={data?.buttonBorderType || 'solid'}
                    onChange={handler('buttonBorderType')}
                  >
                    <MenuItem value="dashed">Dashed</MenuItem>
                    <MenuItem value="dotted">Dotted</MenuItem>
                    <MenuItem value="double">Double</MenuItem>
                    <MenuItem value="solid">Solid</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl sx={{m: 0, mt: 1, width: '100%'}} size="small">
                  <InputLabel id="buttonBorderWeightLabel">Weight</InputLabel>
                  <Select
                    labelId="buttonBorderWeightLabel"
                    id="buttonBorderWeight"
                    value={data?.buttonBorderWeight || 'thin'}
                    label="Weight"
                    onChange={handler('buttonBorderWeight')}
                  >
                    <MenuItem value="thin">Thin</MenuItem>
                    <MenuItem value="normal">Medium</MenuItem>
                    <MenuItem value="weight">Thick</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
          {data?.buttonBorderStyle && data?.buttonBorderStyle !== 'noBorders' && (
            <Grid item xs={12}>
              <Grid container spacing={2}>
              {data?.buttonBorderStyle === 'two' && (
                <Grid item sm={4} xs={12}>
                  <RenderTwoColors handleValue={handleValue} data={data} property="buttonBorderColors" />
                </Grid>
              )}
              <Grid item xs={12} sm={data?.buttonBorderStyle === 'two' ? 8 : 12}>
                <Typography sx={{fontSize: 'smaller', color: theme => theme.palette.text.disabled, mt: '-10px', mb: '2px'}}>{'Displacement direction'}</Typography>
                <RenderDisplacement handleValue={handleValue} direction={data?.buttonShadowDisplacement} />
              </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Box>
      <Box sx={{p:1, mt: '-15px'}}>
        <SpacingSelector selection={data?.buttonsSeparation || 'default'} item="buttonsSeparation" message="Buttons separation" handleValues={handleValue} />
        <Typography sx={{ml: 1, fontSize: 'smaller', color: theme => theme.palette.text.disabled}}>
          {'Buttons separation will only affect those cases with several buttons in the same section'}
        </Typography>
      </Box>
    </Box>
  );
}
