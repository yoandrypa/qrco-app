import {ChangeEvent} from 'react';
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";

import ColorSelector from "../../helperComponents/ColorSelector";
import {COLORS, DEFAULT_COLORS, IS_DEV_ENV} from "../../constants";
import {DataType} from "../../types/types";
import RenderGradientSelector from "./RenderGradientSelector";
import RenderColorPreset from "./RenderColorPreset";
import SectionSelector from "../../helperComponents/SectionSelector";

interface RenderColorProps {
  data?: DataType;
  handleValue: Function;
}

const RenderColorsAndBackgnd = ({data, handleValue}: RenderColorProps) => {
  const handleSelectBackground = (event: ChangeEvent<HTMLInputElement>) => {
    handleValue('backgroundType')(event);
  };

  return (
    <Paper sx={{p: 1}} elevation={2}>
      <Typography sx={{fontWeight: 'bold', color: theme => theme.palette.primary.dark}}>{'Main Design'}</Typography>
      <Paper sx={{p: 1, mb: '10px'}} elevation={2}>
        <Typography sx={{fontWeight: 'bold'}}>{'Main colors'}</Typography>
        <Typography>{'Presets'}</Typography>
        {COLORS.map(x => {
          const selected = (!data?.primary && !data?.secondary && x.p === DEFAULT_COLORS.p && x.s === DEFAULT_COLORS.s) ||
            (x.p === data?.primary && x.s === data?.secondary);
          return <RenderColorPreset handleValue={handleValue} colors={x} selected={selected} key={x.p}/>
        })}
        <Box sx={{width: '100%', display: 'flex', flexDirection: {sm: 'row', xs: 'column'}}}>
          <Box sx={{minWidth: '120px', width: '100%', mr: {sm: '4px', xs: 0}}}>
            <ColorSelector label="Primary color" color={data?.primary || DEFAULT_COLORS.p} handleData={handleValue} property="primary"/>
          </Box>
          <Box sx={{minWidth: '120px', width: '100%', ml: {sm: '4px', xs: 0}}}>
            <ColorSelector label="Secondary color" color={data?.secondary || DEFAULT_COLORS.s} handleData={handleValue} property="secondary"/>
          </Box>
        </Box>
      </Paper>
      {IS_DEV_ENV && (<Paper sx={{p: 1, mb: '10px'}} elevation={2}>
        <Typography sx={{fontWeight: 'bold'}}>{'Background'}</Typography>
        <RadioGroup
          aria-labelledby="backgroundType" name="backgroundType" value={data?.backgroundType || 'single'}
          onChange={handleSelectBackground} row sx={{mb: '-10px'}}>
          <FormControlLabel value="single" control={<Radio/>} label="Single color"/>
          <FormControlLabel value="gradient" control={<Radio/>} label="Gradient"/>
          <FormControlLabel value="image" control={<Radio/>} label="Image"/>
        </RadioGroup>
        {(data?.backgroundType === undefined || data.backgroundType === 'single') && (
          <ColorSelector label="" color={data?.backgroundColor || '#ffffff'} allowClear handleData={handleValue} property="backgroundColor"/>
        )}
        {data?.backgroundType === 'gradient' && (
          <RenderGradientSelector
            colorLeft={data?.backgroundColor || DEFAULT_COLORS.p}
            colorRight={data?.backgroundColorRight || DEFAULT_COLORS.s}
            direction={data?.backgroundDirection}
            handleData={handleValue}/>
        )}
        {data?.backgroundType === 'image' && (
          <Box sx={{ mt: 2 }}>
            <SectionSelector
              icon="/images/backgnds/back1.png" label="Background 1" separate h='100px' w='100px'
              selected={data?.backgroundImage === '/images/backgnds/back1.png'}
              handleSelect={() => {}} />
            <SectionSelector
              icon="/images/backgnds/back2.png" label="Background 2" separate h='100px' w='100px'
              selected={data?.backgroundImage === '/images/backgnds/back2.png'}
              handleSelect={() => {}} />
            <SectionSelector
              icon="/images/backgnds/back3.png" label="Background 3" separate h='100px' w='100px'
              selected={data?.backgroundImage === '/images/backgnds/back3.png'}
              handleSelect={() => {}} />
            <SectionSelector
              icon="/images/backgnds/back4.png" label="Background 4" separate h='100px' w='100px'
              selected={data?.backgroundImage === '/images/backgnds/back4.png'}
              handleSelect={() => {}} />
            <SectionSelector
              icon="/images/backgnds/back5.png" label="Background 5" separate h='100px' w='100px'
              selected={data?.backgroundImage === '/images/backgnds/back5.png'}
              handleSelect={() => {}} />
            <SectionSelector
              isUpload icon={''} h='100px' w='100px' label="Upload" selected={false}
              handleSelect={() => {}} />
          </Box>
        )}
      </Paper>)}
    </Paper>
  );
};

export default RenderColorsAndBackgnd;
