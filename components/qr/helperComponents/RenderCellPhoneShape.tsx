import Box from "@mui/material/Box";
import {ReactNode} from "react";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

interface CellPhoneProps {
  children?: ReactNode;
  onClose: () => void;
  closePreviewText?: string;
  offlineText?: string;
}

export default function RenderCellPhoneShape({offlineText, children, closePreviewText, onClose}: CellPhoneProps) {
  return (
    <Box sx={{
      position: 'relative',
      width: '340px',
      height: '640px',
      margin: 'auto',
      border: '16px black solid',
      borderTopWidth: '60px',
      borderBottomWidth: '70px',
      borderRadius: '30px',
      '&::before': {
        content: '""',
        display: 'block',
        width: '60px',
        height: '5px',
        position: 'absolute',
        top: '-30px',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#333',
        borderRadius: '10px'
      }
    }}>
      <Box sx={{
        width: '308px',
        height: '510px',
        background: 'white'
      }}>
        <Tooltip title={closePreviewText || "Close preview"}>
          <Box
            sx={{
              cursor: 'pointer',
              content: '""',
              display: 'block',
              width: '35px',
              height: '35px',
              position: 'absolute',
              left: '50%',
              bottom: '-65px',
              transform: 'translate(-50%, -50%)',
              background: '#333',
              borderRadius: '50%',
              '&:hover': {background: '#444'}
            }}
            onClick={onClose}
          />
        </Tooltip>
        {children || (
          <Box sx={{height: '510px', width: '100%', position: 'relative'}}>
            <Typography sx={{m: 0, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
              {offlineText || 'Offline content'}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
