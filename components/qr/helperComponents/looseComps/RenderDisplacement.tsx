import NorthWestIcon from "@mui/icons-material/NorthWest";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import SouthEastIcon from "@mui/icons-material/SouthEast";
import SouthWestIcon from "@mui/icons-material/SouthWest";
import ClearIcon from "@mui/icons-material/Clear";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";

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
  handleValue: Function
}

export default function RenderDisplacement({direction, handleValue, sx}: DisplacementProps) {
  const handleDirection = (item?: string) => () => {
    handleValue('buttonShadowDisplacement')(item);
  }

  return (
    <Stack direction="row" spacing={2} sx={{...sx}}>
      <IconBtn selected={direction === undefined} onClick={handleDirection(undefined)}>
        <ClearIcon />
      </IconBtn>
      <IconBtn selected={direction === 'upLeft'} onClick={handleDirection('upLeft')}>
        <NorthWestIcon />
      </IconBtn>
      <IconBtn selected={direction === 'upRight'} onClick={handleDirection('upRight')}>
        <NorthEastIcon />
      </IconBtn>
      <IconBtn selected={direction === 'downRight'} onClick={handleDirection('downRight')}>
        <SouthEastIcon />
      </IconBtn>
      <IconBtn selected={direction === 'downLeft'} onClick={handleDirection('downLeft')}>
        <SouthWestIcon />
      </IconBtn>
    </Stack>
  );
}
