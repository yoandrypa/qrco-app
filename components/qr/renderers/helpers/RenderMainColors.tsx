import {COLORS, DEFAULT_COLORS} from "../../constants";
import RenderColorPreset from "./RenderColorPreset";
import Box from "@mui/material/Box";
import ColorSelector from "../../helperComponents/ColorSelector";
import {DataType} from "../../types/types";

interface MainColorsProps {
  data?: DataType;
  handleValue: Function;
}

export default function RenderMainColors({data, handleValue}: MainColorsProps) {
  return (
    <>
      {COLORS.map(x => (
        <RenderColorPreset
          handleValue={handleValue}
          colors={x}
          key={x.p}
          selected={
            (!data?.primary && !data?.secondary && x.p === DEFAULT_COLORS.p && x.s === DEFAULT_COLORS.s) ||
            (x.p === data?.primary && x.s === data?.secondary)
          }
        />
      ))}
      <Box sx={{width: '100%', display: 'flex', flexDirection: {sm: 'row', xs: 'column'}}}>
        <Box sx={{minWidth: '120px', width: '100%', mr: {sm: '4px', xs: 0}}}>
          <ColorSelector
            label="Primary color"
            color={data?.primary || DEFAULT_COLORS.p}
            handleData={handleValue}
            property="primary"
          />
        </Box>
        <Box sx={{minWidth: '120px', width: '100%', ml: {sm: '4px', xs: 0}}}>
          <ColorSelector
            label="Secondary color"
            color={data?.secondary || DEFAULT_COLORS.s}
            handleData={handleValue}
            property="secondary"
          />
        </Box>
      </Box>
    </>
  );
}
