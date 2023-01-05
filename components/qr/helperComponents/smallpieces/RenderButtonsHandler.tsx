import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import dynamic from "next/dynamic";

import RenderMainFontsHandler from "./RenderMainFontsHandler";
import {DataType} from "../../types/types";
import SectionSelector from "../SectionSelector";
import ColorSelector from "../ColorSelector";
import {DEFAULT_COLORS} from "../../constants";
import useMediaQuery from "@mui/material/useMediaQuery";

const RenderBorders = dynamic(() => import("./RenderBorders"));
const RenderTwoColors = dynamic(() => import("./RenderTwoColors"));

interface ButtonsHandlerProps {
  data?: DataType;
  handleValue: Function;
}

export default function RenderButtonsHandler({data, handleValue}: ButtonsHandlerProps) {
  const isWide = useMediaQuery("(min-width:900px)", {noSsr: true});
  const isWideEnough = useMediaQuery("(min-width:815px)", {noSsr: true});

  const renderShape = (item: number) => (
    <SectionSelector
      selected={(!data?.buttonShape && item === 1) || (data?.buttonShape === `${item}`)}
      property={`${item}`} h={'40px'} w={'70px'} separate handleSelect={handleValue('buttonShape')}>
      <Box sx={{
        width: '60px',
        height: '30px',
        border: theme => `solid 2px ${theme.palette.primary.dark}`,
        background: theme => theme.palette.primary.light,
        borderRadius: item === 0 ? 'unset' : (item === 1 ? '10px' : (item === 2 ? '15px' : '25px 8px 12px 0'))
      }}/>
    </SectionSelector>
  );

  const handler = (event: SelectChangeEvent) => {
    handleValue('buttonBack')(event.target.value);
  }

  return (
    <Box sx={{mt: 1}}>
      <RenderMainFontsHandler handleValue={handleValue} data={data}/>
      <Paper elevation={2} sx={{p: 1, my: 2, display: 'flex', flexDirection: isWide ? 'row' : 'column'}}>
        <Box>
          <Typography>{'Shape'}</Typography>
          {[...Array(4).keys()].map(x => renderShape(x))}
        </Box>
        {data?.buttonShape === `${3}` && (
          <Box sx={{mt: isWide ? '17px' : '10px', ml: isWide ? '10px' : 0}}>
            <RenderBorders handleValue={handleValue} data={data} />
          </Box>
        )}
      </Paper>
      <Paper elevation={2} sx={{p: 1}}>
        <Typography>{'Background'}</Typography>
        <Box sx={{display: 'flex', flexDirection: isWide && isWideEnough ? 'row' : 'column', width: '100%'}}>
          <FormControl sx={{m: 0, mt: 1, width: '100%'}} size="small">
            <InputLabel id="buttonBackColor">Behaviour</InputLabel>
            <Select
              labelId="buttonBackColor"
              id="buttonBackColor"
              value={data?.buttonBack || 'default'}
              label="Behaviour"
              onChange={handler}
            >
              <MenuItem value="default">Use main colors as default behaviour</MenuItem>
              <MenuItem value="solid">Keep same color even on hover</MenuItem>
              <MenuItem value="two">Custom primary and secondary colors</MenuItem>
              <MenuItem value="gradient">Gradient custom primary and secondary colors</MenuItem>
            </Select>
          </FormControl>
          {data?.buttonBack === 'solid' && (
            <Box sx={{width: isWide && isWideEnough ? '45%' : '100%', ml: isWide && isWideEnough ? '5px' : 0}}>
              <ColorSelector label="" color={data?.buttonBackColor || data?.primary || DEFAULT_COLORS.p}
                             handleData={handleValue} property="buttonBackColor"/>
            </Box>
          )}
        </Box>
        {data?.buttonBack === 'two' && <RenderTwoColors handleValue={handleValue} data={data}/>}
        {data?.buttonBack === 'gradient' && <RenderTwoColors handleValue={handleValue} data={data} isGradient/>}
      </Paper>
    </Box>
  );
}
