import {ChangeEvent, useEffect, useRef, useState} from "react";
import Box from "@mui/material/Box";
import {blueGrey} from "@mui/material/colors";
import {DataType} from "../../types/types";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

interface RenderLayoutProps {
  data?: DataType;
  omitPrimary?: boolean;
  handleValue: Function;
}

export default function RenderLayoutHandler({data, handleValue, omitPrimary}: RenderLayoutProps) {
  const [isLeft, setIsLeft] = useState<boolean>(false);
  const [isBorder, setIsBorder] = useState<boolean>(false);
  const doneFirst = useRef<boolean>(false);

  const sender = (prop: string) => {
    let value = prop;
    if (!prop.includes('Left') && isLeft) {
      value += 'Left';
    } else if (prop.includes('Left') && !isLeft) {
      value = value.replace('Left', '');
    }
    if (!prop.includes('Border') && isBorder) {
      value += 'Border';
    } else if (prop.includes('Border') && !isBorder) {
      value = value.replace('Border', '');
    }

    handleValue('layout')(`${value}`);
  }

  const handle = (prop: string) => () => {
    sender(prop);
  }

  useEffect(() => {
    if (doneFirst.current) {
      sender(data?.layout || 'default');
    } else {
      doneFirst.current = true;
    }
  }, [isLeft, isBorder]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data?.layout) {
      if (data.layout.includes('Left')) {
        setIsLeft(true);
      }
      if (data.layout.includes('Border')) {
        setIsBorder(true);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const renderLayout = (kind: string, noMore?: boolean) => {
    const selected = (data?.layout || 'default').startsWith(kind);

    const inverse = kind.toLowerCase().includes('inverse');
    return (
      <Box
        onClick={handle(kind)}
        sx={{
          display: 'inline-block',
          mr: !noMore ? 2 : 0,
          cursor: 'pointer',
          width: '115px',
          height: '200px',
          position: 'relative',
          background: blueGrey[50],
          borderRadius: '8px',
          border: `solid 1px ${blueGrey[400]}`,
          boxShadow: selected ? '0 0 4px 3px #286ED6' : 'none',
          '&:hover': {boxShadow: !selected ? '0 0 2px 2px #849abb' : '0 0 2px 2px #286ED6'} }}>
        <Box sx={{
          width: `calc(100% - ${!isBorder ? 0 : '10px'})`,
          height: `${(!isBorder ? 65 : 60) + (inverse ? 10 : 0)}px`,
          mt: !isBorder ? 0 : '5px',
          mx: 'auto',
          background: blueGrey[300],
          borderRadius: !kind.toLowerCase().includes('soft') ? '8px 8px 0 0' : '8px'
        }}/>
        {inverse && (
          <Box sx={{width: `calc(100% - ${!isBorder ? 0 : 10}px)`, height: '20px', background: blueGrey[50],
            position: 'absolute', borderRadius: '8px', mt: '-10px', ml: isBorder ? '5px' : 0}}/>
        )}
        {!omitPrimary ? (
          <Box sx={{
            width: '48px',
            height: '48px',
            background: blueGrey[500],
            mx: 'auto',
            transform: `translate(${!isLeft ? 0 : '-25px'}, ${!inverse ? -24 : -34}px)`,
            border: 'solid 2px #fff',
            borderRadius: !data?.foregndImgType || data.foregndImgType === 'circle' ? '50%' : (data.foregndImgType === 'smooth' ? '10px' : '3px')
          }}/>) : <Box sx={{height: '48px'}} />}
        {kind.includes('sections') && (
          <Box sx={{ width: 'calc(100% - 20px)', mx: '5px', marginTop: `${(!inverse ? -18 : -28) - (omitPrimary ? 10 : 0)}px`, marginLeft: 'auto', marginRight: 'auto' }}>
            <Box sx={{ width: '100%', height: '40px', background: blueGrey[300], mb: '10px', borderRadius: '5px' }}/>
            <Box sx={{ width: '100%', height: '40px', background: blueGrey[300], borderRadius: '5px' }}/>
          </Box>
        )}
      </Box>
    )
  };

  return (
    <Box sx={{ml: 1}}>
      {renderLayout('default')}
      {renderLayout('soft')}
      {renderLayout('inverse')}
      {renderLayout('sectionsSingle')}
      {renderLayout('sectionsSoft')}
      {renderLayout('sectionsInverse', true)}
      <Box sx={{width: '100%', display: 'flex'}}>
      <FormControlLabel label="Border" control={
        <Switch checked={isBorder} inputProps={{'aria-label': 'isBorder'}}
                onChange={(event: ChangeEvent<HTMLInputElement>) => setIsBorder(event.target.checked)} />}
      />
      {!omitPrimary && (
        <FormControlLabel label="Left aligned" control={
          <Switch checked={isLeft} onChange={(event: ChangeEvent<HTMLInputElement>) => setIsLeft(event.target.checked)}
                  inputProps={{'aria-label': 'isLeft'}} />}
        />)}
      </Box>
    </Box>
  );
}
