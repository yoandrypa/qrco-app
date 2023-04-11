import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';
import Delete from "@mui/icons-material/Delete";
import {memo, MouseEvent} from "react";

interface ExpanderProps {
  multi?: boolean;
  expand: string | null;
  setExpand: (expander: string | null) => void;
  item: string;
  title: string;
  index: number;
  bold?: boolean;
  required?: boolean;
  deleteButton?: boolean;
  handleDelete?: () => void;
  editFunc?: (event: MouseEvent<HTMLElement>) => void;
}

const Expander = ({expand, setExpand, editFunc, item, title, bold, required, deleteButton, handleDelete, multi, index}: ExpanderProps) => {
  const handleExpand = (event: MouseEvent<HTMLElement>) => { // @ts-ignore
    if (event.target.tagName !== 'P') {
      if (multi === undefined && expand === item) {
        setExpand(null);
      } else {
        setExpand(item);
      }
    }
  }

  const handleEdit = (event: MouseEvent<HTMLElement>) => {
    if (editFunc !== undefined) {
      editFunc(event);
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
      <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}} onClick={handleExpand}>
        <Tooltip title={`Edit section ${index + 1} headline`} disableHoverListener={editFunc === undefined}>
          <Box sx={{display: 'flex'}} onClick={handleEdit}>
          <Typography sx={{fontSize: 'xx-large', mt: '-17px', mr: '5px', fontWeight: 'bold', color: '#AAAAAA37'}}>{index + 1}</Typography>
          <Typography sx={{fontWeight: bold ? 'bold' : 'normal', display: 'inline-flex'}}>{title}</Typography>
          </Box>
        </Tooltip>
        {required && !expand && <Typography sx={{mt: '3px'}} color="error">{'REQUIRED'}</Typography>}
      </Box>
      <Box sx={{display: 'flex'}}>
        {deleteButton &&
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
  current.expand === next.expand && current.required === next.required && current.title === next.title &&
  current.index === next.index
);
