import Box from "@mui/material/Box";

import ColorSelector from "../ColorSelector";
import {DEFAULT_COLORS} from "../../constants";
import {DataType} from "../../types/types";
import {useEffect, useRef, useState} from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

interface RenderTwoColorsProps {
  data?: DataType;
  handleValue: Function;
}

export default function RenderTwoColors({data, handleValue}: RenderTwoColorsProps) {
  const [prim, setPrim] = useState<string>(DEFAULT_COLORS.p);
  const [sec, setSec] = useState<string>(DEFAULT_COLORS.s);
  const doneFirst = useRef<boolean>(false);

  const isWide = useMediaQuery("(min-width:855px)", { noSsr: true });

  const handleColors = (prop: string) => (col: string) => {
    if (prop === 'primColor') {
      setPrim(col);
    } else {
      setSec(col);
    }
  }

  useEffect(() => {
    if (doneFirst.current && prim && sec) {
      handleValue('buttonBackColor')(`${prim}|${sec}`);
    }
    if (!doneFirst.current) {
      doneFirst.current = true;
    }
  }, [prim, sec]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data?.buttonBackColor && data.buttonBackColor.includes('|')) {
      const colors = data.buttonBackColor.split('|');
      setPrim(colors[0]);
      setSec(colors[1]);
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={{display: 'flex', flexDirection: isWide ? 'row' : 'column'}}>
      <ColorSelector
        label=""
        color={prim}
        handleData={handleColors}
        property="primColor"
        sx={{
          mr: isWide ? '2px' : 0,
          width: isWide ? '50%' : '100%'
        }}
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
    </Box>
  );
}
