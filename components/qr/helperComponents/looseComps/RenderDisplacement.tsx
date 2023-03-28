import NorthWestIcon from "@mui/icons-material/NorthWest";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import SouthEastIcon from "@mui/icons-material/SouthEast";
import SouthWestIcon from "@mui/icons-material/SouthWest";
import ReplayIcon from '@mui/icons-material/Replay';
import ClearIcon from "@mui/icons-material/Clear";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import {styled} from "@mui/material/styles";

const IconBtn = styled(IconButton)(({selected}: {
  selected: boolean;
}) => ({
  width: '32px', height: '32px', borderRadius: '50%',
  border: 'solid 1px #c4c4c4',
  boxShadow: selected ? '0 0 3px 2px #286ED6' : 'none',
  '&:hover': {boxShadow: !selected ? '0 0 2px 2px #849abb' : '0 0 2px 2px #286ED6'}
}));

interface DisplacementProps {
  direction?: string;
  sx?: any;
  disabled?: string[];
  hideClear?: boolean;
  includeDefault?: boolean;
  includeNo?: boolean;
  property: string;
  handleValue: Function;
}

const RenderDisplacement = ({direction, handleValue, sx, property, disabled, hideClear, includeNo, includeDefault}: DisplacementProps) => {
  const handleDirection = (item?: string) => () => {
    handleValue(property)(item);
  }

  const isDisabled = (item: string) => !!disabled?.includes(item);

  return (
    <Stack direction="row" spacing={2} sx={{...sx}}>
      {!hideClear && (
        <Tooltip title="Clear">
          <IconBtn selected={direction === undefined} onClick={handleDirection(undefined)}>
            <ClearIcon/>
          </IconBtn>
        </Tooltip>)}
      {includeNo && (
        <Tooltip title="No sharer">
          <IconBtn selected={direction === 'no'} onClick={handleDirection('no')}>
            <ClearIcon/>
          </IconBtn>
        </Tooltip>
      )}
      {includeDefault && (
        <Tooltip title="Default position">
          <IconBtn selected={direction === undefined || direction === 'default'} onClick={handleDirection('default')}>
            <ReplayIcon/>
          </IconBtn>
        </Tooltip>
      )}
      <Tooltip title="Up left">
        <IconBtn selected={direction === 'upLeft'} onClick={handleDirection('upLeft')} disabled={isDisabled('upLeft')}>
          <NorthWestIcon />
        </IconBtn>
      </Tooltip>
      <Tooltip title="Up right">
        <IconBtn selected={direction === 'upRight'} onClick={handleDirection('upRight')} disabled={isDisabled('upRight')}>
          <NorthEastIcon />
        </IconBtn>
      </Tooltip>
      <Tooltip title="Bottom left">
        <IconBtn selected={direction === 'downLeft'} onClick={handleDirection('downLeft')} disabled={isDisabled('downLeft')}>
          <SouthWestIcon />
        </IconBtn>
      </Tooltip>
      <Tooltip title="Bottom right">
        <IconBtn selected={direction === 'downRight'} onClick={handleDirection('downRight')} disabled={isDisabled('downRight')}>
          <SouthEastIcon />
        </IconBtn>
      </Tooltip>
    </Stack>
  );
}

export default RenderDisplacement;
