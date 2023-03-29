import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

interface OpacityProps {
  value: number;
  maxValue?: number;
  handleValue: Function;
  property: string;
  message?: string;
  keepContainerWidth?: boolean;
  width?: Object;
}

const RenderHandleOpacityBlurness = ({value, handleValue, property, message, keepContainerWidth, maxValue, width}: OpacityProps) => {
  const isWide = useMediaQuery("(min-width:570px)", { noSsr: true });

  const handleOpacity = (_: Event, newValue: number | number[]) => {
    const value = newValue as number;
    handleValue(property)(maxValue === undefined ? Math.round(value)/100 : value);
  };

  return (
    <Box sx={{ width: width || (isWide && !keepContainerWidth ? '500px' : '100%'), mt: 1, ml: '5px'}}>
      <Typography sx={{display: 'flex'}}>
        {message || 'Opacity'}
        <Typography sx={{color: theme => theme.palette.text.disabled, ml: 1}}>
          {`(${maxValue === undefined ? Math.ceil(value * 100) : value} ${maxValue === undefined ? '%' : 'pixels'})`}
        </Typography>
      </Typography>
      <Slider value={maxValue === undefined ? value * 100 : value} onChange={handleOpacity} size="small" min={0} max={maxValue || 100} />
    </Box>
  );
}

export default RenderHandleOpacityBlurness;
