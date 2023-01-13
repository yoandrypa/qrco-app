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
    handleValue('backgroundColor')(payload.p);
  }

  return (
    <>
      {[{ p: "#ffffff", s: "#ffffff" }, ...COLORS].slice(0, -1).map(x => (
        <RenderColorPreset
          onlyPrimary
          handleValue={before}
          colors={x}
          key={x.p}
          selected={(!data?.backgroundColor && x.p === '#ffffff') || x.p === data?.backgroundColor}
        />
      ))}
      <ColorSelector
        label=""
        color={data?.backgroundColor || '#ffffff'}
        allowClear
        handleData={handleValue}
        property="backgroundColor"
      />
    </>
  );
}
