import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import IconButton from '@mui/material/IconButton';

interface ExpanderProps {
  expand: string | null;
  setExpand: (expander: string | null) => void;
  item: string;
  title: string;
  bold?: boolean;
  required?: boolean;
}

const Expander = ({expand, setExpand, item, title, bold, required}: ExpanderProps) => {
  const handleExpand = () => {
    if (expand === item) {
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
      onClick={handleExpand}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Typography sx={{fontWeight: bold ? 'bold' : 'normal'}}>{title}</Typography>
        {required && !expand && <Typography sx={{ mt: '3px'}} color="error">{'REQUIRED'}</Typography>}
      </Box>
      <Tooltip title={expand === item ? "Collapse" : "Expand"}>
        <IconButton size="small">
          {expand === item ? <ExpandLessIcon fontSize="small"/> : <ExpandMoreIcon fontSize="small"/>}
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default Expander;
