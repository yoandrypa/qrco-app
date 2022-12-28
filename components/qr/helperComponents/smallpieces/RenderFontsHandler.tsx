import {useCallback, useContext, useState} from "react";
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
import Context from "../../../context/Context";
import useMediaQuery from "@mui/material/useMediaQuery";
import Expander from "../../renderers/helpers/Expander";

interface RenderFontsHandlerProps {
  data?: DataType;
  handleValue: Function;
}

export default function RenderFontsHandler({data, handleValue}: RenderFontsHandlerProps) {
  const [expander, setExpander] = useState<string>('global');
  // @ts-ignore
  const {selected} = useContext(Context);

  const isWide = useMediaQuery("(min-width:1010px)", { noSsr: true });
  const isWideEnough = useMediaQuery("(min-width:483px)", { noSsr: true });

  const before = useCallback((property: string) => (payload: string): void => {
    handleValue(property)(payload);
  }, []);

  const handleExpander = useCallback((item: string | null) => {
    if (item) {
      setExpander(item);
    }
  }, []);

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
  }, [data?.globalFont]);

  return (
    <>
      <Paper elevation={2} sx={{p: 1}}>
        <Expander expand={expander} setExpand={handleExpander} item="global" title="Global microsite's font" />
        {expander === 'global' && (<>
          {FONTS.map(x => renderFontType(x))}
          <Typography sx={{fontWeight: 'bold', mb: '-10px'}}>{'Global font color'}</Typography>
          <Box sx={{ width: 'calc(100% - 10px)'}}>
            <ColorSelector label="" color={data?.globalFontColor || '#000000'} allowClear handleData={handleValue} property="globalFontColor"/>
          </Box>
        </>)}
      </Paper>
      <Paper elevation={2} sx={{p: 1, mt: 1}}>
        <Expander expand={expander} setExpand={handleExpander} item="custom" title="Custom fonts" />
        {expander === 'custom' && (<>
        <Paper elevation={2} sx={{p: 1, width: '100%', mb: 2, mt: 3}}>
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
          <Paper elevation={2} sx={{p: 1, width: '100%', mb: 2}}>
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
          </Paper>
          {!['social', 'link', 'vcard+'].includes(selected) && (<Paper elevation={2} sx={{p: 1, width: '100%', mb: 2}}>
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
          {!['social'].includes(selected) && (<Paper elevation={2} sx={{p: 1, width: '100%'}}>
            <Typography sx={{fontWeight: 'bold', mb: '5px'}}>{'Buttons'}</Typography>
            <Grid container spacing={2}>
              <Grid item xs={isWide ? 4 : 12}>
                <RenderFontsSelector handleSelect={handleValue} property="buttonsFont" value={data?.buttonsFont || "none"} label="Font"/>
              </Grid>
              <Grid item xs={isWide ? 4 : isWideEnough ? 6 : 12}>
                <RenderFontsSizeSelector handleSelect={handleValue} property="buttonsFontSize" value={data?.buttonsFontSize || "default"} label="Size"/>
              </Grid>
              <Grid item xs={isWide ? 4 : isWideEnough ? 6 : 12}>
                <RenderFontStyles value={data?.buttonsFontStyle} property="buttonsFontStyle" handleValue={handleValue}/>
              </Grid>
            </Grid>
          </Paper>)}
        </>)}
      </Paper>
    </>
  );
}
