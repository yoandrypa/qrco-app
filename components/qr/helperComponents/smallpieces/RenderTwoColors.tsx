import Box from "@mui/material/Box";

import ColorSelector from "../ColorSelector";
import {DEFAULT_COLORS} from "../../constants";
import {DataType} from "../../types/types";
import {useEffect, useRef, useState} from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import RenderDirectionSelector from "./RenderDirectionSelector";

interface RenderTwoColorsProps {
  data?: DataType;
  handleValue: Function;
  isGradient?: boolean;
}

export default function RenderTwoColors({data, handleValue, isGradient}: RenderTwoColorsProps) {
  const [prim, setPrim] = useState<string>(DEFAULT_COLORS.p);
  const [sec, setSec] = useState<string>(DEFAULT_COLORS.s);
  const [direction, setDirection] = useState<string | undefined>(undefined);
  const doneFirst = useRef<boolean>(false);

  const isWide = useMediaQuery("(min-width:855px)", { noSsr: true });

  const handleColors = (prop: string) => (col: string) => {
    if (prop === 'primColor') {
      setPrim(col);
    } else {
      setSec(col);
    }
  }

  const handleDirection = (angle: string) => () => {
    setDirection(angle === '180deg' ? undefined : angle);
  };

  useEffect(() => {
    if (doneFirst.current && prim && sec) {
      handleValue('buttonBackColor')(`${prim}|${sec}${isGradient && direction ? `@${direction}` : ''}`);
    }
    if (!doneFirst.current) {
      doneFirst.current = true;
    }
  }, [prim, sec, direction]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data?.buttonBackColor && data.buttonBackColor.includes('|')) {
      const colors = data.buttonBackColor.split('|');
      let color1 = colors[1];
      if (color1.includes('@')) {
        const tempo = color1.split('@');
        color1 = tempo[0];
        setDirection(tempo[1]);
      }
      setPrim(colors[0]);
      setSec(color1);
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Box sx={{display: 'flex', flexDirection: isWide ? 'row' : 'column'}}>
        <ColorSelector
          label=""
          color={prim}
          handleData={handleColors}
          property="primColor"
          sx={{mr: isWide ? '2px' : 0, width: isWide ? '50%' : '100%'}}
        />
        <ColorSelector
          label=""
          color={sec}
          handleData={handleColors}
          property="secColor"
          sx={{
            ml: isWide ? '3px' : 0,
            width: isWide ? '50%' : '100%',
            mt: isWide ? 0 : '-5px'
          }}
        />
        {isGradient && (
          <Box sx={{mt: isWide ? '20px' : '10px', ml: isWide ? 1 : 'auto', mr: isWide ? 'unset' : 'auto'}}>
            <RenderDirectionSelector handleDirection={handleDirection} direction={direction} isWide={false} />
          </Box>
        )}
      </Box>
    </>
  );
}
