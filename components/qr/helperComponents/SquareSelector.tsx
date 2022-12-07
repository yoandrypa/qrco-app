import {alpha} from "@mui/material/styles";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import RenderIcon from "./smallpieces/RenderIcon";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import {ColorTypes} from "../types/types";

interface SquareSelectorProps {
  selected: boolean;
  item: string;
  label: string;
  tooltips?: boolean;
  handleSelection?: Function;
  colors?: ColorTypes;
}

const SquareSelector = ({colors, tooltips, selected, item, label, handleSelection}: SquareSelectorProps) => {
  const beforeHandle = () => {
    if (handleSelection !== undefined) {
      handleSelection(item);
    }
  };

  return (
    <Box sx={{ mr: 1, mb: 1 }}>
      <Tooltip title={label} disableHoverListener={!tooltips} arrow>
        <Button
          sx={{
            width: !tooltips ? '100px' : '55px',
            minWidth: !tooltips ? '100px' : '55px',
            height: !tooltips ? '60px' : '50px',
            backgroundColor: theme => alpha(!colors ? theme.palette.info.light : colors.s, selected ? 0.25 : 0.1),
            cursor: !tooltips ? 'pointer' : 'auto',
            '&:hover': {
              backgroundColor: !tooltips ? theme => alpha(!colors ? theme.palette.info.light : colors.s, 0.4) : 'inherit'
            }
          }}
          variant={selected ? 'outlined' : 'text'}
          onClick={beforeHandle}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ width: '100%', mx: 'auto' }}>
              <RenderIcon icon={item} enabled color={colors?.p} />
            </Box>
            {!tooltips && (<Typography sx={{
              width: '100%',
              textAlign: 'center',
              fontWeight: selected ? 'bold' : 'normal',
              fontSize: 'small',
              fontVariantCaps: 'all-petite-caps'
            }}>
              {label}
            </Typography>)}
          </Box>
        </Button>
      </Tooltip>
    </Box>
  );
};

export default SquareSelector;
