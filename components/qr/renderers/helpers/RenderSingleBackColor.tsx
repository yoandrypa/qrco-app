import Box from "@mui/material/Box";
import ColorSelector from "../../helperComponents/ColorSelector";
import {ColorTypes, DataType} from "../../types/types";
import {COLORS} from "../../constants";
import RenderColorPreset from "./RenderColorPreset";

interface SingleColorProps {
  data?: DataType;
  handleValue: Function;
}

export default function RenderSingleBackColor({data, handleValue}: SingleColorProps) {
  const before = () => (payload: ColorTypes) => {
    handleValue('backgroundColor')(payload.s);
  }

  return (
    <Box sx={{mt: '12px'}}>
      {[{ p: "#ffffff", s: "#ffffff" }, ...COLORS].slice(0, -1).map(x => (
        <RenderColorPreset
          onlyOne
          handleValue={before}
          colors={x}
          key={x.s}
          selected={(!data?.backgroundColor && x.s === '#ffffff') || x.s === data?.backgroundColor}
        />
      ))}
      <ColorSelector
        label=""
        color={data?.backgroundColor || '#ffffff'}
        allowClear
        handleData={handleValue}
        property="backgroundColor"
      />
    </Box>
  );
}
