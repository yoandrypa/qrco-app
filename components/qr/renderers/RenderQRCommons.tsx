import {useCallback, useContext, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import {DataType} from "../types/types";
import Expander from "./helpers/Expander";
import Context from "../../context/Context";

import dynamic from "next/dynamic";

const RenderHandlerBackground = dynamic(() => import ("../helperComponents/smallpieces/RenderHandlerBackground"));
const RenderMainImgsSelector = dynamic(() => import("../helperComponents/smallpieces/RenderMainImgsSelector"));
const RenderButtonsHandler = dynamic(() => import('../helperComponents/looseComps/RenderButtonHandler'));
const RenderFontsHandler = dynamic(() => import('../helperComponents/smallpieces/RenderFontsHandler'));
const RenderLayoutHandler = dynamic(() => import("../helperComponents/smallpieces/RenderLayoutHandler"));
const RenderMainColors = dynamic(() => import("./helpers/RenderMainColors"));
const Typography = dynamic(() => import("@mui/material/Typography"));
const CircularProgress = dynamic(() => import("@mui/material/CircularProgress"));

interface QRCommonsProps {
  omitPrimaryImg?: boolean;
  data?: DataType;
  loading?: boolean;
  isWideForPreview?: boolean;
  backgndImg?: File | string;
  foregndImg?: File | string;
  micrositesImg?: File | string;
  backError?: boolean;
  foreError?: boolean;
  handleValue: Function;
  forcePick?: string;
}

function RenderQRCommons({loading, data, omitPrimaryImg, foregndImg, backgndImg, micrositesImg, backError, foreError, handleValue, isWideForPreview, forcePick}: QRCommonsProps) { // @ts-ignore
  const [expander, setExpander] = useState<string | null>('mainColors');

  // @ts-ignore
  const {selected}: {selected: string} = useContext(Context);

  const handleExpander = useCallback((item: string): void => {
    setExpander(item === expander ? null : item);
  }, [expander]);

  useEffect(() => {
    if (data?.layout?.includes('banner') && backgndImg) {
      handleValue('backgndImg')(undefined)
    }
  }, [data?.layout]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (data?.backgroundType !== 'image' && micrositesImg) {
      handleValue('micrositesImg')(undefined);
    }
  }, [data?.backgroundType]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {loading && (
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', mt: '10px', mb: '-10px' }}>
          <CircularProgress size={20} sx={{ mr: '5px' }} />
          <Typography sx={{ fontSize: 'small', color: theme => theme.palette.text.disabled}}>
            {'Loading data. Please wait...'}
          </Typography>
        </Box>
      )}
      <Box sx={{p: 1, mt: 1}}>
        <Paper sx={{p: 1, mb: '10px'}} elevation={2}> {/* @ts-ignore */}
          <Expander expand={expander} setExpand={handleExpander} item="mainColors" title="Main colors" bold/>
          {expander === 'mainColors' && <RenderMainColors data={data} handleValue={handleValue} />}
        </Paper>
        <Paper sx={{p: 1, mb: '10px'}} elevation={2}> {/* @ts-ignore */}
          <Expander expand={expander} setExpand={handleExpander} item="images" title="Banner and profile images" bold/>
          {expander === 'images' && (
            <RenderMainImgsSelector handleValue={handleValue} data={data} foregndImg={foregndImg} forcePick={forcePick}
                                    backgndImg={backgndImg} isWideForPreview={isWideForPreview} backError={backError}
                                    foreError={foreError} omitPrimaryImg={omitPrimaryImg} loading={loading} />
          )}
        </Paper>
        <Paper sx={{p: 1, mb: '10px'}} elevation={2}> {/* @ts-ignore */}
          <Expander expand={expander} setExpand={handleExpander} item="background" title="Background" bold/>
          {expander === 'background' && (
            <RenderHandlerBackground handleValue={handleValue} data={data} micrositesImg={micrositesImg}/>
          )}
        </Paper>
        <Paper sx={{p: 1, mb: '10px'}} elevation={2}> {/* @ts-ignore */}
          <Expander expand={expander} setExpand={handleExpander} item="fonts" title="Fonts" bold/>
          {expander === 'fonts' && <RenderFontsHandler data={data} handleValue={handleValue} />}
        </Paper>
        {!['social', 'petId', 'gallery'].includes(selected) && (<Paper sx={{p: 1, mb: '10px'}} elevation={2}> {/* @ts-ignore */}
          <Expander expand={expander} setExpand={handleExpander} item="buttons" title="Buttons" bold/>
          {expander === 'buttons' && <RenderButtonsHandler handleValue={handleValue} data={data}/>}
        </Paper>)}
        <Paper sx={{p: 1, mb: '10px'}} elevation={2}> {/* @ts-ignore */}
          <Expander expand={expander} setExpand={handleExpander} item="layout" title="Layout" bold/>
          {expander === 'layout' && (
            <RenderLayoutHandler handleValue={handleValue} data={data} omitPrimary={omitPrimaryImg}/>
          )}
        </Paper>
      </Box>
    </>
  );
}

export default RenderQRCommons;
