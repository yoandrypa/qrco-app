import SouthIcon from "@mui/icons-material/South";
import EastIcon from "@mui/icons-material/East";
import SouthEastIcon from "@mui/icons-material/SouthEast";
import SouthWestIcon from "@mui/icons-material/SouthWest";
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

interface RenderDirectionProps {
  isWide?: boolean;
  direction?: string;
  handleDirection: (angle: string) => () => void;
}

export default function RenderDirectionSelector({isWide, direction, handleDirection}: RenderDirectionProps) {
  return (
    <Stack direction="row" spacing={2} sx={{mt: isWide ? 0 : '-8px'}}>
      <IconBtn selected={direction === undefined || direction === '180deg'} onClick={handleDirection('180deg')}>
        <SouthIcon />
      </IconBtn>
      <IconBtn selected={direction === '90deg'} onClick={handleDirection('90deg')}>
        <EastIcon />
      </IconBtn>
      <IconBtn selected={direction === '135deg'} onClick={handleDirection('135deg')}>
        <SouthEastIcon />
      </IconBtn>
      <IconBtn selected={direction === '225deg'} onClick={handleDirection('225deg')}>
        <SouthWestIcon />
      </IconBtn>
    </Stack>
  )
}
