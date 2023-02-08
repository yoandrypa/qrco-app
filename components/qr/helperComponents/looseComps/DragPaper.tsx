import {memo, MouseEvent, ReactNode} from "react";
import Paper, {PaperProps} from "@mui/material/Paper";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import {blueGrey, red, blue} from "@mui/material/colors";

import dynamic from "next/dynamic";

const DeleteIcon = dynamic(() => import("@mui/icons-material/Delete"));
const EditIcon = dynamic(() => import("@mui/icons-material/Edit"));

interface DragPaper extends PaperProps {
  children: ReactNode;
  avoidIcon?: boolean;
  removeFunc?: () => void;
  editFunc?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const buttonStyles = (edit: boolean) => {
  return {
    mt: '-42px', ml: '5px', background: edit ? blue[300] : red[300], '&:hover': {background: edit ? blue[500] : red[500]}
  }
}

const DragPaper = ({children, avoidIcon, editFunc, removeFunc, ...otherProps}: DragPaper) => (
  <Paper {...otherProps}>
    {!avoidIcon ? (<Tooltip title="Drag knob">
      <IconButton size="small" sx={{
        mt: '-42px', ml: '5px', background: blueGrey[50], '&:hover': {background: blueGrey[100]}
      }}>
        <DragIndicatorIcon sx={{color: theme => theme.palette.text.disabled}} fontSize="small"/>
      </IconButton>
    </Tooltip>) : <Box sx={{height: !removeFunc ? '25px' : 0}}/>}
    {editFunc !== undefined && (
      <Tooltip title="Edit section name">
        <IconButton size="small" onClick={editFunc} sx={buttonStyles(true)}>
          <EditIcon sx={{color: '#fff'}} fontSize="small"/>
        </IconButton>
      </Tooltip>
    )}
    {removeFunc !== undefined && (
      <Tooltip title="Remove">
        <IconButton size="small" onClick={removeFunc} sx={buttonStyles(false)}>
          <DeleteIcon sx={{color: '#fff'}} fontSize="small"/>
        </IconButton>
      </Tooltip>
    )}
    <Box sx={{ mt: !avoidIcon && !removeFunc ? '-20px' : '-5px' }}>
      {children}
    </Box>
  </Paper>
);

export default memo(DragPaper);
