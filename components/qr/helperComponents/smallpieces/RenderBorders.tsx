import TextField from "@mui/material/TextField";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import NorthEastIcon from '@mui/icons-material/NorthEast';
import NorthWestIcon from '@mui/icons-material/NorthWest';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import SouthWestIcon from '@mui/icons-material/SouthWest';

import {DataType} from "../../types/types";

interface RenderBordersProps {
  data?: DataType;
  handleValue: Function;
}

export default function RenderBorders({data, handleValue}: RenderBordersProps) {
  const [topL, setTopL] = useState<number>(25);
  const [topR, setTopR] = useState<number>(10);
  const [belowL, setBelowL] = useState<number>(0);
  const [belowR, setBelowR] = useState<number>(15);
  const doneFirst = useRef<boolean>(false);

  const handler = (prop: string) => (event: ChangeEvent): void => { // @ts-ignore
    const value = +(event.target?.value || 0);
    if (prop === 'topL') { setTopL(value); }
    else if (prop === 'topR') { setTopR(value); }
    else if (prop === 'topL') { setBelowL(value); }
    else { setBelowR(value); }
  }

  const renderSelector = (item: string) => {
    let value;
    let icon;
    if (item === 'topL') {
      value = topL;
      icon = <NorthWestIcon fontSize="small"/>;
    } else if (item === 'topR') {
      value = topR;
      icon = <NorthEastIcon fontSize="small"/>;
    } else if (item === 'belowL') {
      value = belowL;
      icon = <SouthWestIcon fontSize="small"/>;
    } else {
      value = belowR;
      icon = <SouthEastIcon fontSize="small"/>;
    }
    return (<TextField
      size="small"
      type="number"
      label={icon}
      onKeyDown={evt => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
      margin="dense"
      sx={{ mr: item !== 'belowR' ? '10px' : 0, width: '70px' }}
      value={value}
      onChange={handler(item)}
      variant="outlined" // @ts-ignore
      InputProps={{ inputMode: 'numeric', pattern: '[0-9]{2}', inputProps: { min: 0, max: 30 } }}
    />);
  }

  useEffect(() => {
    if (doneFirst.current && topL && topR && belowL && belowR) {
      handleValue('buttonBorders')(`${topL}px ${topR}px ${belowL}px ${belowR}px`);
    }
    if (!doneFirst.current) {
      doneFirst.current = true;
    }
  }, [topL, topR, belowL, belowR]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data?.buttonBorders && data.buttonBorders.includes(' ')) {
      const borders = data.buttonBorders.split(' ');
      setTopL(+borders[0]);
      setTopR(+borders[1]);
      setBelowL(+borders[2]);
      setBelowR(+borders[3]);
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (<>
    {renderSelector('topL')}
    {renderSelector('topR')}
    {renderSelector('belowL')}
    {renderSelector('belowR')}
  </>)
}
