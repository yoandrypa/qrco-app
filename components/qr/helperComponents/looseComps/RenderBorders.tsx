import TextField from "@mui/material/TextField";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import NorthEastIcon from '@mui/icons-material/NorthEast';
import NorthWestIcon from '@mui/icons-material/NorthWest';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import SouthWestIcon from '@mui/icons-material/SouthWest';

interface RenderBordersProps {
  data?: { buttonBorders?: string; };
  handleValue: Function;
}

export default function RenderBorders({data, handleValue}: RenderBordersProps) {
  const [topL, setTopL] = useState<number>(30);
  const [topR, setTopR] = useState<number>(10);
  const [belowL, setBelowL] = useState<number>(0);
  const [belowR, setBelowR] = useState<number>(15);
  const doneFirst = useRef<boolean>(false);

  const handler = (prop: string) => (event: ChangeEvent): void => { // @ts-ignore
    const value = +(event.target?.value || 0);
    if (prop === 'topL') { setTopL(value); }
    else if (prop === 'topR') { setTopR(value); }
    else if (prop === 'belowL') { setBelowL(value); }
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
      sx={{ mr: item !== 'belowR' ? '10px' : 0, width: '70px', display: 'inline-flex' }}
      value={value}
      onChange={handler(item)}
      variant="outlined" // @ts-ignore
      InputProps={{ inputMode: 'numeric', pattern: '[0-9]{2}', inputProps: { min: 0, max: 35 } }}
    />);
  }

  useEffect(() => {
    if (doneFirst.current) {
      handleValue('buttonBorders')(`${topL}px ${topR}px ${belowL}px ${belowR}px`);
    }
  }, [topL, topR, belowL, belowR]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data?.buttonBorders && data.buttonBorders.includes(' ')) {
      const borders = data.buttonBorders.split(' ');
      const handleValue = (corner: string) => +(corner.endsWith('px') ? corner.slice(0, -2) : corner);

      setTopL(handleValue(borders[0]));
      setTopR(handleValue(borders[1]));
      setBelowL(handleValue(borders[2]));
      setBelowR(handleValue(borders[3]));
    }
    doneFirst.current = true;
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (<>
    {renderSelector('topL')}
    {renderSelector('topR')}
    {renderSelector('belowL')}
    {renderSelector('belowR')}
  </>)
}
