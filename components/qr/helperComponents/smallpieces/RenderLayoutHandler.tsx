import {ChangeEvent, useEffect, useMemo, useRef, useState} from "react";
import Box from "@mui/material/Box";
import {blueGrey} from "@mui/material/colors";
import {CustomCommon} from "../../types/types";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

import {DEFAULT_COLORS} from "../../constants";

import dynamic from "next/dynamic";

const RenderHandleOpacityBlurness = dynamic(() => import("./RenderHandleOpacityBlurness"));
const Typography = dynamic(() => import("@mui/material/Typography"));
const LayoutSectionsColorConfig = dynamic(() => import("../looseComps/LayoutSectionsColorConfig"));
const ViewStreamIcon = dynamic(() => import("@mui/icons-material/ViewStream"));

interface RenderLayoutProps extends CustomCommon {
  omitPrimary?: boolean;
}

export default function RenderLayoutHandler({data, handleValue, omitPrimary}: RenderLayoutProps) {
  const [isLeft, setIsLeft] = useState<boolean>(false);
  const [isBorder, setIsBorder] = useState<boolean>(false);
  const [color, setColor] = useState<string | undefined>(undefined);
  const [opacity, setOpacity] = useState<number | undefined>(undefined);

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

    let index = value.indexOf('#');
    if (index !== -1) { value = value.slice(0, index); }

    index = value.indexOf('%');
    if (index !== -1) { value = value.slice(0, index); }

    if (color) {
      value += color;
    }

    if (opacity !== undefined) {
      value += `%${opacity}`;
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
  }, [isLeft, isBorder, color, opacity]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data?.layout) {
      if (data.layout.includes('Left')) {
        setIsLeft(true);
      } else if (isLeft) {
        setIsLeft(false);
      }
      if (data.layout.includes('Border')) {
        setIsBorder(true);
      }
      if (!data.layout.includes('#') && !data.layout.includes('%')) {
        setOpacity(undefined);
        setColor(undefined);
      }
    } else {
      setOpacity(undefined);
      setColor(undefined);
    }
  }, [data?.layout]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderLayout = (kind: string, noMore?: boolean) => {
    const selected = (data?.layout || 'default').startsWith(kind);
    const inverse = kind.toLowerCase().includes('inverse');
    const gradient = kind.toLowerCase().includes('gradient');
    const noBanner = kind.includes('banner');

    return (
      <Box
        onClick={handle(kind)}
        sx={{
          display: 'inline-block',
          mr: !noMore ? '10px' : 0,
          cursor: 'pointer',
          width: '80px',
          height: '155px',
          position: 'relative',
          background: blueGrey[50],
          borderRadius: '8px',
          border: `solid 1px ${blueGrey[400]}`,
          boxShadow: selected ? '0 0 4px 3px #286ED6' : 'none',
          '&:hover': {boxShadow: !selected ? '0 0 2px 2px #849abb' : '0 0 2px 2px #286ED6'} }}>
        {kind !== 'empty' && (<Box sx={{
          width: `calc(100% - ${!isBorder ? 0 : '10px'})`,
          height: `${(!isBorder ? 55 : 50) + (inverse ? 10 : 0)}px`,
          mt: !isBorder ? 0 : '5px',
          mx: 'auto',
          background: !noBanner ? (!gradient ? blueGrey[300] : `linear-gradient(to bottom, ${blueGrey[300]} 80%, rgba(0, 0, 0, 0) 100%)`) : 'unset',
          borderRadius: !kind.toLowerCase().includes('soft') ? '8px 8px 0 0' : '8px'
        }}/>)}
        {inverse && (
          <Box sx={{width: `calc(100% - ${!isBorder ? 0 : 10}px)`, height: '20px', background: blueGrey[50],
            position: 'absolute', borderRadius: '8px', mt: '-10px', ml: isBorder ? '5px' : 0}}/>
        )}
        {!omitPrimary && kind !== 'empty' ? (
          <Box sx={{
            width: '38px',
            height: '38px',
            background: blueGrey[500],
            mx: 'auto',
            transform: `translate(${!isLeft ? 0 : '-20px'}, ${!inverse ? -22 : -32}px)`,
            border: 'solid 2px #fff',
            borderRadius: !data?.foregndImgType || data.foregndImgType === 'circle' ? '50%' : (data.foregndImgType === 'smooth' ? '10px' : '3px')
          }}/>) : <Box sx={{height: '48px'}} />}
        {kind.includes('sections') && (
          <Box sx={{ width: 'calc(100% - 20px)', marginTop: `${(!inverse ? -18 : -28) - (omitPrimary ? 10 : 0)}px`, mx: 'auto' }}>
            <Box sx={{ width: '100%', height: '25px', background: blueGrey[300], mb: '15px', borderRadius: '5px' }}/>
            <Box sx={{ width: '100%', height: '25px', background: blueGrey[300], borderRadius: '5px' }}/>
          </Box>
        )}
        {kind.includes('entire') && (
          <Box sx={{
            width: 'calc(100% - 20px)',
            mt: `${(!inverse ? -18 : -28) - (omitPrimary ? 10 : 0)}px`,
            mx: 'auto', height: '67px',
            background: blueGrey[300],
            borderRadius: '5px' }}/>
        )}
      </Box>
    )
  };

  const isSectioned = data?.layout?.includes('entire') || data?.layout?.includes('sections');

  const colorObj = useMemo(() => {
    if (isSectioned) {
      const index = data?.layout?.indexOf('#') || -1;
      if (index !== -1) { // @ts-ignore
        const ind = data.layout.indexOf('%') as number;
        if (ind !== -1) { // @ts-ignore
          return data.layout.slice(index, ind);
        } // @ts-ignore
        return data.layout.slice(index);
      }
    }
    return undefined;
  }, [data?.layout]); // eslint-disable-line react-hooks/exhaustive-deps

  const colorOp = useMemo(() => {
    if (isSectioned) {
      const index = data?.layout?.indexOf('%') || -1; // @ts-ignore
      return index === -1 ? 0.5 : +data.layout.slice(index + 1);
    }
    return 0.5;
  }, [data?.layout]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleOpacity = () => (val: number) => {
    setOpacity(val);
  }

  return (
    <Box sx={{ml: 1}}>
      {renderLayout('default')}
      {renderLayout('soft')}
      {renderLayout('inverse')}
      {renderLayout('gradient')}
      {renderLayout('sectionsSingle')}
      {renderLayout('sectionsSoft')}
      {renderLayout('sectionsInverse')}
      {renderLayout('sectionsGradient')}
      {renderLayout('entireSingle')}
      {renderLayout('entireSoft')}
      {renderLayout('entireInverse')}
      {renderLayout('entireGradient')}
      {renderLayout('empty')}
      {renderLayout('nobanner')}
      {renderLayout('sectionsNobanner')}
      {renderLayout('entireNobanner', true)}
      <Box sx={{width: '100%', display: 'flex'}}>
        <FormControlLabel label="Border" control={
          <Switch checked={isBorder} inputProps={{'aria-label': 'isBorder'}}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setIsBorder(event.target.checked)} />}
        />
        {!omitPrimary && (
          <FormControlLabel label="Left aligned" control={
            <Switch onChange={(event: ChangeEvent<HTMLInputElement>) => setIsLeft(event.target.checked)}
                    inputProps={{'aria-label': 'isLeft'}} checked={isLeft} disabled={data?.layout === 'empty'} />}
          />)}
      </Box>
      {isSectioned && (
        <>
          <Box sx={{display: 'flex'}}>
            <ViewStreamIcon color="primary" sx={{mr: '5px'}} />
            <Typography>{'Blocks configuration'}</Typography>
          </Box>
          <LayoutSectionsColorConfig color={colorObj} setColor={setColor} primary={data?.primary || DEFAULT_COLORS.p} />
          <RenderHandleOpacityBlurness value={colorOp} handleValue={handleOpacity} property="" width={{sm: '675px', xs: '100%'}} />
        </>
      )}
    </Box>
  );
}
