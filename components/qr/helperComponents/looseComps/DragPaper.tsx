import {ReactNode} from "react";
import Paper, {PaperProps} from "@mui/material/Paper";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import {blueGrey} from "@mui/material/colors";

interface DragPaper extends PaperProps {
  children: ReactNode;
  avoidIcon?: boolean;
}

export default function DragPaper({children, avoidIcon, ...otherProps}: DragPaper) {
  return (
    <Paper {...otherProps}>
      {!avoidIcon && (<Tooltip title="Drag knob">
        <IconButton color="primary" size="small" sx={{
          mt: '-42px', mr: '5px', background: blueGrey[50], '&:hover': {background: blueGrey[100]}
        }}>
          <DragIndicatorIcon sx={{color: theme => theme.palette.text.disabled}} fontSize="small"/>
        </IconButton>
      </Tooltip>)}
      <Box sx={{ mt: '-20px' }}>
        {children}
      </Box>
    </Paper>
  );
}
