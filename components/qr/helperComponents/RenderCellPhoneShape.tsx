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
      width: '315px',
      height: '630px',
      margin: 'auto',
      background: '#f7f7f7',
      border: '1px #9e9e9e solid',
      borderRadius: '25px',
      '&::before': {
        content: '""',
        display: 'block',
        width: '60px',
        height: '5px',
        position: 'absolute',
        top: '23px',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#9e9e9e',
        borderRadius: '10px'
      }
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
              bottom: '-5px',
              transform: 'translate(-50%, -50%)',
              background: '#dbdbdb',
              border: 'solid 1px #9e9e9e',
              borderRadius: '50%',
              '&:hover': {background: '#9e9e9e'}
            }}
            onClick={onClose}
          />
        </Tooltip>
        <Box sx={{
          position: 'absolute',
          top: '47px',
          left: '10px',
          right: '10px',
          bottom: '59px',
          border: 'solid 1px #9e9e9e'
        }}>
          {children || (
            <Box sx={{height: '520px', width: '100%', position: 'absolute', background: '#fff'}}>
              <Typography
                sx={{m: 0, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                {offlineText || 'Offline content'}
              </Typography>
            </Box>
          )}
        </Box>
    </Box>
  );
}
