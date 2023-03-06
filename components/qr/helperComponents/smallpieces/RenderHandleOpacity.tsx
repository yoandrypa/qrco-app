import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

interface OpacityProps {
  opacity: number;
  handleValue: Function;
  property: string;
  message?: string;
  keepContainerWidth?: boolean;
}

const RenderHandleOpacity = ({opacity, handleValue, property, message, keepContainerWidth}: OpacityProps) => {
  const isWide = useMediaQuery("(min-width:570px)", { noSsr: true });

  const handleOpacity = (_: Event, newValue: number | number[]) => {
    const value = newValue as number;
    handleValue(property)(Math.round(value)/100);
  };

  return (
    <Box sx={{ width: isWide && !keepContainerWidth ? '500px' : '100%', mt: 1, ml: '5px'}}>
      <Typography sx={{display: 'flex'}}>
        {message || 'Opacity'}
        <Typography sx={{color: theme => theme.palette.text.disabled, ml: 1}}>{`(${Math.ceil(opacity * 100)} %)`}</Typography>
      </Typography>
      <Slider value={opacity * 100} onChange={handleOpacity} size="small" min={0} max={100} />
    </Box>
  );
}

export default RenderHandleOpacity;
