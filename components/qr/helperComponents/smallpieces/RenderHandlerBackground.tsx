import {ChangeEvent} from "react";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

import RenderSingleBackColor from "../../renderers/helpers/RenderSingleBackColor";
import {DEFAULT_COLORS} from "../../constants";
import {DataType} from "../../types/types";

import dynamic from "next/dynamic";

const RenderBackgroundImageSelector = dynamic(() => import("../../renderers/helpers/RenderBackgroundImageSelector"));
const RenderGradientSelector = dynamic(() => import("../../renderers/helpers/RenderGradientSelector"));

interface HandleBackProps {
  handleValue: Function;
  data?: DataType;
  micrositesImg?: File | string;
}

const RenderHandlerBackground = ({handleValue, data, micrositesImg}: HandleBackProps) => {
  const handleSelectBackground = (event: ChangeEvent<HTMLInputElement>) => {
    handleValue('backgroundType')(event);
  };

  return (
    <>
      <RadioGroup
        aria-labelledby="backgroundType" name="backgroundType" value={data?.backgroundType || 'single'}
        onChange={handleSelectBackground} row sx={{mb: '-12px'}}>
        <FormControlLabel value="single" control={<Radio/>} label="Color solid"/>
        <FormControlLabel value="gradient" control={<Radio/>} label="Gradient"/>
        <FormControlLabel value="image" control={<Radio/>} label="Image"/>
      </RadioGroup>
      {(data?.backgroundType === undefined || data.backgroundType === 'single') && (
        <RenderSingleBackColor data={data} handleValue={handleValue}/>
      )}
      {data?.backgroundType === 'gradient' && (
        <RenderGradientSelector
          colorLeft={data?.backgroundColor || DEFAULT_COLORS.s}
          colorRight={data?.backgroundColorRight || DEFAULT_COLORS.p}
          direction={data?.backgroundDirection}
          handleData={handleValue}/>
      )}
      {data?.backgroundType === 'image' && (
        <RenderBackgroundImageSelector
          handleValue={handleValue}
          micrositesImg={micrositesImg}
          opacity={data.micrositeBackImageOpacity !== undefined ? data.micrositeBackImageOpacity : 1}/>
      )}
    </>
  )
};

export default RenderHandlerBackground;
