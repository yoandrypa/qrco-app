import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import dynamic from "next/dynamic";

import RenderMainFontsHandler from "../smallpieces/RenderMainFontsHandler";
import {DataType} from "../../types/types";
import SectionSelector from "../SectionSelector";
import ColorSelector from "../ColorSelector";
import {DEFAULT_COLORS} from "../../constants";
import useMediaQuery from "@mui/material/useMediaQuery";
import RenderHandleOpacity from "../smallpieces/RenderHandleOpacity";
import Grid from "@mui/material/Grid";

const RenderBorders = dynamic(() => import("./RenderBorders"));
const RenderTwoColors = dynamic(() => import("../smallpieces/RenderTwoColors"));

interface ButtonsHandlerProps {
  data?: DataType;
  handleValue: Function;
}

export default function RenderButtonHandler({data, handleValue}: ButtonsHandlerProps) {
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

  const handler = (prop: string) => (event: SelectChangeEvent) => {
    handleValue(prop)(event.target.value);
  }

  return (
    <Box sx={{mt: 1}}>
      <RenderMainFontsHandler handleValue={handleValue} data={data}/>
      <Box sx={{p: 1, display: 'flex', flexDirection: isWide ? 'row' : 'column'}}>
        <Box>
          <Typography>{'Shape'}</Typography>
          {[...Array(4).keys()].map(x => renderShape(x))}
        </Box>
        {data?.buttonShape === `${3}` && (
          <Box sx={{mt: isWide ? '17px' : '10px', ml: isWide ? '10px' : 0}}>
            <RenderBorders handleValue={handleValue} data={data} />
          </Box>
        )}
      </Box>
      <Box sx={{p: 1, mt: '-20px'}}>
        <Typography>{'Background'}</Typography>
        <Box sx={{display: 'flex', flexDirection: isWide && isWideEnough ? 'row' : 'column', width: '100%'}}>
          <FormControl sx={{m: 0, mt: 1, width: '100%'}} size="small">
            <InputLabel id="buttonBackColor">Behaviour</InputLabel>
            <Select
              labelId="buttonBackColor"
              id="buttonBackColor"
              value={data?.buttonBack || 'default'}
              label="Behaviour"
              onChange={handler('buttonBack')}
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
        {data?.buttonBack === 'two' && <RenderTwoColors handleValue={handleValue} data={data} property="buttonBackColor"/>}
        {data?.buttonBack === 'gradient' ? <RenderTwoColors handleValue={handleValue} data={data} isGradient property="buttonBackColor"/> :
          (
            <Box sx={{width: 'calc(100% - 10px)'}}>
              <RenderHandleOpacity
                opacity={data?.buttonsOpacity !== undefined ? data?.buttonsOpacity : 1}
                handleValue={handleValue}
                property="buttonsOpacity"
                message="Button's background opacity"
                keepContainerWidth />
            </Box>
          )
        }
      </Box>
      <Box sx={{p: 1, mt: '-20px'}}>
        <Typography>{'Borders'}</Typography>
        <Grid container spacing={2}>
          <Grid item sm={data?.buttonBorderStyle && data?.buttonBorderStyle !== 'noBorders' ? 4 : 12} xs={12}>
            <FormControl sx={{m: 0, mt: 1, width: '100%'}} size="small">
              <InputLabel id="buttonBorderColorLabel">Color</InputLabel>
              <Select
                labelId="buttonBorderColorLabel"
                id="buttonBorderStyle"
                value={data?.buttonBorderStyle || 'noBorders'}
                label="Color"
                onChange={handler('buttonBorderStyle')}
              >
                <MenuItem value="default">Use main colors</MenuItem>
                <MenuItem value="two">Custom colors</MenuItem>
                <MenuItem value="noBorders">No borders</MenuItem>
              </Select>
            </FormControl>
            {data?.buttonBorderStyle === 'two' && (
              <RenderTwoColors handleValue={handleValue} data={data} property="buttonBorderColors" />
            )}
          </Grid>
          {data?.buttonBorderStyle && data?.buttonBorderStyle !== 'noBorders' && (
            <>
              <Grid item sm={4} xs={12}>
                <FormControl sx={{m: 0, mt: 1, width: '100%'}} size="small">
                  <InputLabel id="buttonBorderTypeLabel">Style</InputLabel>
                  <Select
                    labelId="buttonBorderTypeLabel"
                    id="buttonBorderType"
                    value={data?.buttonBorderType || 'solid'}
                    label="Weight"
                    onChange={handler('buttonBorderType')}
                  >
                    <MenuItem value="dashed">Dashed</MenuItem>
                    <MenuItem value="dotted">Dotted</MenuItem>
                    <MenuItem value="double">Double</MenuItem>
                    <MenuItem value="solid">Solid</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item sm={4} xs={12}>
                <FormControl sx={{m: 0, mt: 1, width: '100%'}} size="small">
                  <InputLabel id="buttonBorderWeightLabel">Weight</InputLabel>
                  <Select
                    labelId="buttonBorderWeightLabel"
                    id="buttonBorderWeight"
                    value={data?.buttonBorderWeight || 'thin'}
                    label="Weight"
                    onChange={handler('buttonBorderWeight')}
                  >
                    <MenuItem value="thin">Thin</MenuItem>
                    <MenuItem value="normal">Medium</MenuItem>
                    <MenuItem value="weight">Thick</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Box>
  );
}
