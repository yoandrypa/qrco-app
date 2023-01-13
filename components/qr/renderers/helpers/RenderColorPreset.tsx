import Box from "@mui/material/Box";
import {ColorTypes} from "../../types/types";

interface RenderColorPresetProps {
  handleValue: Function;
  colors: ColorTypes;
  selected?: boolean;
  gradient?: boolean;
  onlyPrimary?: boolean;
}

export default function RenderColorPreset({gradient, handleValue, selected, colors, onlyPrimary}: RenderColorPresetProps) {
  return (
    <Box sx={{display: 'inline-flex', mr: '10px'}}>
      <Box
        onClick={() => handleValue(`both${gradient ? '-gradient' : ''}`)(colors)}
        sx={{
          cursor: 'pointer',
          display: 'flex',
          p: '2px',
          mt: 1,
          border: theme => `solid 1px ${theme.palette.text.disabled}`,
          boxShadow: selected ? '0 0 3px 2px #286ED6' : 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          '&:hover': {boxShadow: !selected ? '0 0 2px 2px #849abb' : '0 0 2px 2px #286ED6'}
        }}>
        {!gradient ? (
          <>
            <Box sx={{
              background: colors.p,
              width: !onlyPrimary ? '25px' : '100%',
              height: '44px',
              borderRadius: !onlyPrimary ? '25px 0 0 25px' : '25px'
            }}/>
            {!onlyPrimary && <Box sx={{background: colors.s, width: '25px', height: '44px', borderRadius: '0 25px 25px 0'}}/>}
          </>
        ) : (
          <Box sx={{
            width: '50px',
            height: '44px',
            borderRadius: '25px',
            backgroundImage: `linear-gradient(90deg, ${colors.p}, ${colors.s})`
          }}/>
        )}
      </Box>
    </Box>
  );
}
