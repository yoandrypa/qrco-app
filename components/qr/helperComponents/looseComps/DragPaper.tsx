import {ReactNode} from "react";
import Paper, {PaperProps} from "@mui/material/Paper";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import {blueGrey, red} from "@mui/material/colors";

import dynamic from "next/dynamic";

const DeleteIcon = dynamic(() => import("@mui/icons-material/Delete"));

interface DragPaper extends PaperProps {
  children: ReactNode;
  avoidIcon?: boolean;
  removeFunc?: () => void;
}

export default function DragPaper({children, avoidIcon, removeFunc, ...otherProps}: DragPaper) {
  return (
    <Paper {...otherProps}>
      {!avoidIcon ? (<Tooltip title="Drag knob">
        <IconButton size="small" sx={{
          mt: '-42px', ml: '5px', background: blueGrey[50], '&:hover': {background: blueGrey[100]}
        }}>
          <DragIndicatorIcon sx={{color: theme => theme.palette.text.disabled}} fontSize="small"/>
        </IconButton>
      </Tooltip>) : <Box sx={{height: !removeFunc ? '25px' : 0}}/>}
      {removeFunc !== undefined && (
        <Tooltip title="Remove">
          <IconButton size="small" onClick={removeFunc} sx={{
            mt: '-42px', ml: '5px', background: red[300], '&:hover': {background: red[500]}
          }}>
            <DeleteIcon sx={{color: '#fff'}} fontSize="small"/>
          </IconButton>
        </Tooltip>
      )}
      <Box sx={{ mt: !avoidIcon && !removeFunc ? '-20px' : '-5px' }}>
        {children}
      </Box>
    </Paper>
  );
}
