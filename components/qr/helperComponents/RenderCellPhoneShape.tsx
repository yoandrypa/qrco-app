import Box from "@mui/material/Box";
import {ReactNode} from "react";
import Typography from "@mui/material/Typography";

interface CellPhoneProps {
  children?: ReactNode;
  offlineText?: string;
  width?: number;
  height?: number;
}

const border = '#b7b7b7';
const background = '#d7d4d4';

export default function RenderCellPhoneShape({width, height, offlineText, children}: CellPhoneProps) {
  return (
    <Box sx={{
      position: 'relative',
      width: width ? `${width}px` : '315px',
      height: height ? `${height}px` : '550px',
      margin: 'auto',
      background,
      border: `1px solid ${border}`,
      borderRadius: '25px',
      boxShadow: '0px 3px 5px #808080'
    }}>
      <Box sx={{ position: 'absolute', width: '3px', height: '25px', top: '100px', left: '-3px', background: '#9e9e9e' }}/>
      <Box sx={{ position: 'absolute', width: '3px', height: '25px', top: '150px', left: '-3px', background: '#9e9e9e' }}/>
      <Box sx={{
        position: 'absolute',
        top: '5px',
        left: '5px',
        right: '5px',
        bottom: '5px',
        border: `solid 1px ${border}`,
        borderRadius: '17px'
      }}>
        <Box sx={{borderRadius: '17px', height: '100%', width: '100%', position: 'absolute', background: '#fff'}}>
          {children || (
            <Typography
              sx={{m: 0, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
              {offlineText || 'Offline content'}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
