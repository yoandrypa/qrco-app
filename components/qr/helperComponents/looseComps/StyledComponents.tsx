import {styled} from "@mui/material/styles";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import {blue, grey} from "@mui/material/colors";

export const StepperButtons = styled(Button)(({theme}) => ({
  width: "100px",
  height: "30px",
  "&.Mui-disabled": { backgroundColor: theme.palette.text.disabled, color: grey[300] }
}));

export const MyBadge = styled(Badge)(({pro}: { pro?: boolean }) => ({
  '& .MuiBadge-badge': {
    top: 11,
    right: pro ? -20 : -22,
    height: 18,
    fontSize: '0.55rem',
    borderRadius: '4px',
    background: pro ? '#000' : blue[800]
  }
}));

export const ProBadge = styled(Box)(({pro}: { pro?: boolean }) => ({
  height: 18,
  borderRadius: '4px',
  marginLeft: 5,
  background: pro ? '#000' : blue[800],
  '& :first-child': {
    color: '#fff',
    fontSize: '0.55rem',
    fontWeight: 'bold',
    paddingRight: 5,
    paddingLeft: 5,
    marginTop: 4
  }
}));

export const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  userSelect: "none",
  background: isDragging ? "#ebe8e1" : "none",
  ...draggableStyle
});
