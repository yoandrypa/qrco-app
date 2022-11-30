import {ChangeEvent} from 'react';
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";

import ColorSelector from "../../helperComponents/ColorSelector";
import {COLORS, DEFAULT_COLORS} from "../../constants";
import {ColorTypes, DataType} from "../../types/types";
import RenderGradientSelector from "./RenderGradientSelector";
import RenderColorPreset from "./RenderColorPreset";

interface RenderColorProps {
  data?: DataType;
  handleValue: Function;
}

const RenderColors = ({data, handleValue}: RenderColorProps) => {
  const handleSelectBackground = (event: ChangeEvent<HTMLInputElement>) => {
    handleValue('backgroundType')(event);
  };

  return (
    <Paper sx={{p: 1}} elevation={2}>
      <Typography sx={{fontWeight: 'bold'}}>{'Colors'}</Typography>
      <Paper sx={{p: 1, mb: '10px'}} elevation={2}>
        <Typography>{'Presets'}</Typography>
          {COLORS.map(x => {
            const selected = (!data?.primary && !data?.secondary && x.p === DEFAULT_COLORS.p && x.s === DEFAULT_COLORS.s) ||
              (x.p === data?.primary && x.s === data?.secondary);
            return <RenderColorPreset handleValue={handleValue} colors={x} selected={selected} key={x.p} />
          })}
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <ColorSelector label="Primary color" color={data?.primary || DEFAULT_COLORS.p} handleData={handleValue} property="primary"/>
          </Grid>
          <Grid item xs={6}>
            <ColorSelector label="Secondary color" color={data?.secondary || DEFAULT_COLORS.s} handleData={handleValue} property="secondary"/>
          </Grid>
        </Grid>
      </Paper>
      <Paper sx={{p: 1, mb: '10px'}} elevation={2}>
        <Typography>{'Background'}</Typography>
        <RadioGroup
          aria-labelledby="backgroundType"
          name="backgroundType"
          value={data?.backgroundType || 'single'}
          onChange={handleSelectBackground}
          row
        >
          <FormControlLabel value="single" control={<Radio/>} label="Single color"/>
          <FormControlLabel value="gradient" control={<Radio/>} label="Gradient"/>
        </RadioGroup>
        {(data?.backgroundType === undefined || data.backgroundType === 'single') ? (
          <ColorSelector label="" color={data?.backgroundColor || '#ffffff'} allowClear handleData={handleValue} property="backgroundColor"/>
        ) : (
          <RenderGradientSelector
            colorLeft={data?.backgroundColor || '#ffffff'}
            colorRight={data?.backgroundColorRight || '#ffffff'}
            direction={data?.backgroundDirection}
            handleData={handleValue} />
        )}
      </Paper>
    </Paper>
  );
};

export default RenderColors;
