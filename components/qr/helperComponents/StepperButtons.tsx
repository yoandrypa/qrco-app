import {styled} from "@mui/material/styles";
import Button from "@mui/material/Button";
import {grey} from "@mui/material/colors";

const StepperButtons = styled(Button)(({theme}) => ({
  width: "100px",
  height: "30px",
  "&.Mui-disabled": { backgroundColor: theme.palette.text.disabled, color: grey[300] }
}));

export default StepperButtons;
