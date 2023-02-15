import {useCallback, useState} from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import {grey} from "@mui/material/colors";

import SectionSelector from "../SectionSelector";
import {DataType, FontTypes} from "../../types/types";
import {FONTS} from "../../constants";
import RenderFontsSelector from "./RenderFontsSelector";
import RenderFontsSizeSelector from "./RenderFontsSizeSelector";
import RenderFontStyles from "./RenderFontStyles";
import ColorSelector from "../ColorSelector";
import useMediaQuery from "@mui/material/useMediaQuery";
import Expander from "../../renderers/helpers/Expander";

import dynamic from "next/dynamic";

const RenderButtonsFontsHandler = dynamic(() => import("./RenderMainFontsHandler"));

interface RenderFontsHandlerProps {
  data?: DataType;
  handleValue: Function;
  selected: string;
}

export default function RenderFontsHandler({data, handleValue, selected}: RenderFontsHandlerProps) {
  const [expander, setExpander] = useState<string>('global');

  const isWide = useMediaQuery("(min-width:1010px)", { noSsr: true });
  const isWideEnough = useMediaQuery("(min-width:483px)", { noSsr: true });

  const before = useCallback((property: string) => (payload: string): void => {
    handleValue(property)(payload);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleExpander = useCallback((item: string | null) => {
    setExpander((prev: string) => (!item ? (prev === 'global' ? 'custom' : 'global') : item));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const renderFontType = useCallback((font: FontTypes) => {
    return ( // @ts-ignore
      <SectionSelector selected={(!data.globalFont && font.name === 'Default') || data.globalFont === font.name}
                       handleSelect={before('globalFont')} property={font.name} h={'50px'} w={'190px'} separate>
        <Box sx={{width: '100%', textAlign: 'left'}}>
          <Typography sx={{fontFamily: font.type, fontWeight: 'bold', color: grey[800]}}>{font.name}</Typography>
          <Typography sx={{
            fontFamily: font.type,
            textTransform: 'none',
            mb: '-5px',
            color: grey[700]
          }}>{'AaBbCc...Zz, 123'}</Typography>
        </Box>
      </SectionSelector>
    );
  }, [data?.globalFont]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Paper elevation={2} sx={{p: 1}}>
        <Expander expand={expander} setExpand={handleExpander} item="global" title="Global microsite's font" />
        {expander === 'global' && (<>
          {FONTS.map(x => renderFontType(x))}
          <Typography sx={{mb: '-10px'}}>{'Global font color'}</Typography>
          <Box sx={{ width: 'calc(100% - 10px)'}}>
            <ColorSelector label="" color={data?.globalFontColor || '#000000'} allowClear handleData={handleValue} property="globalFontColor"/>
          </Box>
        </>)}
      </Paper>
      <Paper elevation={2} sx={{p: 1, mt: 1}}>
        <Expander expand={expander} setExpand={handleExpander} item="custom" title="Custom fonts" />
        {expander === 'custom' && (<>
        <Paper elevation={2} sx={{p: 1, width: '100%', mb: 2}}>
          <Typography sx={{fontWeight: 'bold', mb: '5px'}}>{'Titles'}</Typography>
          <Grid container spacing={2}>
            <Grid item xs={isWide ? 4 : 12}>
              <RenderFontsSelector handleSelect={handleValue} property="titlesFont" value={data?.titlesFont || "none"} label="Font"/>
            </Grid>
            <Grid item xs={isWide ? 4 : isWideEnough ? 6 : 4}>
              <RenderFontsSizeSelector handleSelect={handleValue} property="titlesFontSize" value={data?.titlesFontSize || "default"} label="Size"/>
            </Grid>
            <Grid item xs={isWide ? 4 : isWideEnough ? 6 : 4}>
              <RenderFontStyles value={data?.titlesFontStyle} property="titlesFontStyle" handleValue={handleValue}/>
            </Grid>
          </Grid>
          </Paper>
          {!['vcard+'].includes(selected) && (<Paper elevation={2} sx={{p: 1, width: '100%', mb: 2}}>
            <Typography sx={{fontWeight: 'bold', mb: '5px'}}>{'Sub titles'}</Typography>
            <Grid container spacing={2}>
              <Grid item xs={isWide ? 4 : 12}>
                <RenderFontsSelector handleSelect={handleValue} property="subtitlesFont" value={data?.subtitlesFont || "none"} label="Font"/>
              </Grid>
              <Grid item xs={isWide ? 4 : isWideEnough ? 6 : 12}>
                <RenderFontsSizeSelector handleSelect={handleValue} property="subtitlesFontSize" value={data?.subtitlesFontSize || "default"} label="Size"/>
              </Grid>
              <Grid item xs={isWide ? 4 : isWideEnough ? 6 : 12}>
                <RenderFontStyles value={data?.subtitlesFontStyle} property="subtitlesFontStyle" handleValue={handleValue}/>
              </Grid>
            </Grid>
          </Paper>)}
          {!['social', 'link'].includes(selected) && (<Paper elevation={2} sx={{p: 1, width: '100%', mb: 2}}>
            <Typography sx={{fontWeight: 'bold', mb: '5px'}}>{'Messages'}</Typography>
            <Grid container spacing={2}>
              <Grid item xs={isWide ? 4 : 12}>
                <RenderFontsSelector handleSelect={handleValue} property="messagesFont" value={data?.messagesFont || "none"} label="Font"/>
              </Grid>
              <Grid item xs={isWide ? 4 : isWideEnough ? 6 : 12}>
                <RenderFontsSizeSelector handleSelect={handleValue} property="messagesFontSize" value={data?.messagesFontSize || "default"} label="Size"/>
              </Grid>
              <Grid item xs={isWide ? 4 : isWideEnough ? 6 : 12}>
                <RenderFontStyles value={data?.messagesFontStyle} property="messagesFontStyle" handleValue={handleValue}/>
              </Grid>
            </Grid>
          </Paper>)}
          {!['social', 'gallery'].includes(selected) && (<Paper elevation={2} sx={{p: 1, width: '100%'}}>
            <Typography sx={{fontWeight: 'bold', mb: '5px'}}>{'Buttons'}</Typography>
            <RenderButtonsFontsHandler handleValue={handleValue} data={data} />
          </Paper>)}
        </>)}
      </Paper>
    </>
  );
}
