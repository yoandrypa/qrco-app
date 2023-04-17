import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

interface Props {
  handleValues: Function;
  customFont?: boolean;
  index: number;
}

export default function AllowFonts({handleValues, customFont, index}: Props) {
  const handleCustomFont = (event: {target: {checked: boolean}}) => {
    handleValues('customFont', index)(event.target.checked);
  }

  return (
    <>
      <Divider sx={{my: 1}}/>
      <Box sx={{display: 'flex'}}>
        <TextFieldsIcon sx={{color: theme => theme.palette.primary.dark, mr: '5px', mt: '-2px'}}/>
        <Typography sx={{fontWeight: 'bold'}}>{'Headline font'}</Typography>
      </Box>
      <FormControl>
        <FormControlLabel label="Use custom headline font" control={<Switch checked={customFont || false} onChange={handleCustomFont} />} />
      </FormControl>
    </>
  );
}
