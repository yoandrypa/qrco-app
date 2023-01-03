import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import dynamic from "next/dynamic";

import RenderButtonsFontsHandler from "./RenderButtonsFontsHandler";
import {DataType} from "../../types/types";
import SectionSelector from "../SectionSelector";
import ColorSelector from "../ColorSelector";
import {DEFAULT_COLORS} from "../../constants";
import useMediaQuery from "@mui/material/useMediaQuery";

const RenderTwoColors = dynamic(() => import("./RenderTwoColors"));

interface ButtonsHandlerProps {
  data?: DataType;
  handleValue: Function;
}

export default function RenderButtonsHandler({data, handleValue}: ButtonsHandlerProps) {
  const isWide = useMediaQuery("(min-width:900px)", { noSsr: true });
  const isWideEnough = useMediaQuery("(min-width:815px)", { noSsr: true });

  const renderShape = (item: number) => (
    <SectionSelector
      selected={(!data?.buttonShape && item === 1) || (data?.buttonShape === `${item}`)}
      property={`${item}`} h={'40px'} w={'70px'} separate handleSelect={handleValue('buttonShape')}>
      <Box sx={{
        width: '60px',
        height: '30px',
        border: theme => `solid 2px ${theme.palette.primary.dark}`,
        background: theme => theme.palette.primary.light,
        borderRadius: item === 0 ? 'unset' : (item === 1 ? '10px' : '15px')}} />
    </SectionSelector>
  );

  const handler = (event: SelectChangeEvent) => {
    handleValue('buttonBack')(event.target.value);
  }

  return (
    <Box sx={{mt: 1}}>
      <RenderButtonsFontsHandler handleValue={handleValue} data={data} />
      <Box sx={{display: 'flex', mt: 2}}>
        <Paper elevation={2} sx={{mr: 2, p: 1}}>
          <Typography>{'Shape'}</Typography>
          {[...Array(3).keys()].map(x => renderShape(x))}
        </Paper>
        <Paper elevation={2} sx={{p : 1}}>
          <Typography>{'Background'}</Typography>
          <FormControl sx={{ m: 0, mt: 1, width: '100%' }} size="small">
            <InputLabel id="buttonBackColor">Page size</InputLabel>
            <Select
              labelId="buttonBackColor"
              id="buttonBackColor"
              sx={{width: isWide ? '428px' : '210px'}}
              value={data?.buttonBack || 'default'}
              label="Page size"
              onChange={handler}
            >
              <MenuItem value="default">Use main colors as default behaviour</MenuItem>
              <MenuItem value="solid">Solid color</MenuItem>
              <MenuItem value="two">Custom primary and secondary colors</MenuItem>
              <MenuItem value="gradient">Gradient custom primary and secondary colors</MenuItem>
            </Select>
          </FormControl>
          {data?.buttonBack === 'solid' && (
            <ColorSelector label="" color={data?.buttonBackColor || data?.primary || DEFAULT_COLORS.p}
                           handleData={handleValue} property="buttonBackColor"/>
          )}
          {data?.buttonBack === 'two' && (
            <RenderTwoColors handleValue={handleValue} data={data} isWideEnough={isWideEnough} />
          )}
          {data?.buttonBack === 'gradient' && (
            <RenderTwoColors handleValue={handleValue} data={data} isWideEnough={isWideEnough} />
          )}
        </Paper>
    </Box>
    </Box>
  );
}
