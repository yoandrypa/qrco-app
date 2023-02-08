import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';
import { Delete } from "@mui/icons-material";
import {memo} from "react";

interface ExpanderProps {
  multi?: boolean;
  expand: string | null;
  setExpand: (expander: string | null) => void;
  item: string;
  title: string;
  bold?: boolean;
  required?: boolean;
  deleteButton?: boolean;
  handleDelete?: () => void;
}

const Expander = ({expand, setExpand, item, title, bold, required, deleteButton, handleDelete, multi}: ExpanderProps) => {
  const handleExpand = () => {
    if (multi === undefined && expand === item) {
      setExpand(null);
    } else {
      setExpand(item);
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        cursor: 'pointer'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }} onClick={handleExpand}>
        <Typography sx={{fontWeight: bold ? 'bold' : 'normal'}}>{title}</Typography>
        {required && !expand && <Typography sx={{ mt: '3px'}} color="error">{'REQUIRED'}</Typography>}
      </Box>
      <Box sx={{display:'flex'}}>
        {deleteButton&&
          <Tooltip title="Delete">
            <IconButton size="small" onClick={handleDelete}>
              <Delete fontSize="small" color="error"/>
            </IconButton>
          </Tooltip>
        }
        <Tooltip title={expand === item ? "Collapse" : "Expand"}>
          <IconButton size="small" onClick={handleExpand}>
            {expand === item ? <ExpandLessIcon fontSize="small"/> : <ExpandMoreIcon fontSize="small"/>}
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default memo(Expander, (current: ExpanderProps, next: ExpanderProps) =>
  current.expand === next.expand && current.required === next.required);
