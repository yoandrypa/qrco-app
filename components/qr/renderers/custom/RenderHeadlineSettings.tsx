import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Settings from "@mui/icons-material/Settings";
import ReplayIcon from "@mui/icons-material/Replay";
import VerticalSplitIcon from "@mui/icons-material/VerticalSplit";
import ImportExportIcon from "@mui/icons-material/ImportExport";

import dynamic from 'next/dynamic';
import {Type} from "../../types/types";

import SpacingSelector from "../../helperComponents/looseComps/SpacingSelector";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const HeadLineSettings = dynamic(() => import("./headline/HeadLineSettings"));
const AllowFonts = dynamic(() => import("./headline/AllowFonts"));
const CustomFont = dynamic(() => import("./headline/CustomFont"));

interface HeadStngsProps {
  hideHeadline: boolean;
  handleValues: Function;
  handleClose: () => void;
  anchor: HTMLElement;
  data?: Type;
  index: number;
}

export default function RenderHeadlineSettings({hideHeadline, handleValues, handleClose, data, index, anchor}: HeadStngsProps) {
  const handleValue = (prop: string) => (payload: string) => {
    handleValues(prop, index)(payload);
  }

  const handleSectionDesign = (event: {target: {value: string}}) => {
    handleValues('sectionArrangement', index)(event.target.value);
  }

  const handleReset = () => {
    handleValue('reset')('reset');
  }

  const showHeadline = data?.hideHeadLine === undefined || hideHeadline;
  const allowFonts = showHeadline && !hideHeadline;
  const reseteable = !(data?.topSpacing !== undefined || data?.bottomSpacing !== undefined || data?.customFont !== undefined ||
    data?.sectionArrangement !== undefined || data?.centerHeadLine !== undefined || data?.hideHeadLineIcon !== undefined || data?.hideHeadLine !== undefined);

  return (
    <Popover
      open
      anchorEl={anchor}
      onClose={handleClose}
      anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
      transformOrigin={{vertical: 'top', horizontal: 'left'}}
    >
      <Box sx={{p: 2, width: {sm: '640px', xs: '100%'}}}>
        <Box sx={{display: 'flex', mb: 1}}>
          <Settings sx={{color: theme => theme.palette.primary.dark, mr: '5px', mt: '-2px'}}/>
          <Typography sx={{fontWeight: 'bold'}}>{'Section settings'}</Typography>
        </Box>
        {!hideHeadline && <HeadLineSettings showHeadline={showHeadline} index={index} handleValues={handleValues} data={data} />}
        {allowFonts && <AllowFonts handleValues={handleValues} index={index} customFont={data?.customFont} />}
        {data?.customFont && (
          <CustomFont headlineFont={data?.headlineFont} headlineFontSize={data?.headlineFontSize}
                      headLineFontStyle={data?.headLineFontStyle} handleValue={handleValue} />
        )}
        {allowFonts && (<>
          <Divider sx={{my: 1}}/>
          <Box sx={{display: 'flex'}}>
            <VerticalSplitIcon sx={{color: theme => theme.palette.primary.dark, mr: '5px', mt: '-2px'}}/>
            <Typography sx={{fontWeight: 'bold'}}>{'Section arrangement mode'}</Typography>
          </Box>
          <Select value={data?.sectionArrangement || 'default'} onChange={handleSectionDesign} size='small' fullWidth>
            <MenuItem value='default'>Always expanded</MenuItem>
            <MenuItem value='collapseButton'>Button collapsible</MenuItem>
            <MenuItem value='collapsible'>Classic collapsible</MenuItem>
            <MenuItem value='tabbed'>Tabbed</MenuItem>
          </Select>
        </>)}
        <Divider sx={{my: 1}}/>
        <Box sx={{display: 'flex'}}>
          <ImportExportIcon sx={{color: theme => theme.palette.primary.dark, mr: '5px', mt: '-2px'}}/>
          <Typography sx={{fontWeight: 'bold'}}>{'Section spacing'}</Typography>
        </Box>
        <SpacingSelector selection={data?.topSpacing || 'default'} item="topSpacing" message="Top spacing" handleValues={handleValues} index={index}/>
        <SpacingSelector selection={data?.bottomSpacing || 'default'} item="bottomSpacing" message="Bottom spacing" handleValues={handleValues} index={index}/>
        <Divider sx={{mt: 2, mb: 1}}/>
        <Box sx={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
          <Button onClick={handleReset} variant="outlined" startIcon={<ReplayIcon />} disabled={reseteable}>
            {'Reset'}
          </Button>
          <Button onClick={handleClose} variant="outlined">{'Close'}</Button>
        </Box>
      </Box>
    </Popover>
  );
}
