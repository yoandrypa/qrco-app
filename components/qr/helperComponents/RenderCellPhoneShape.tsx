import Box from "@mui/material/Box";
import {ReactNode} from "react";
import Typography from "@mui/material/Typography";

interface CellPhoneProps {
  children?: ReactNode;
  offlineText?: string;
  width?: number;
  height?: number;
}

const border = '#9e9e9e';
const background = '#d7d4d4';

export default function RenderCellPhoneShape({width, height, offlineText, children}: CellPhoneProps) {
  return (
    <Box sx={{
      position: 'relative',
      width: width ? `${width}px` : '315px',
      height: height ? `${height}px` : '630px',
      margin: 'auto',
      background,
      border: `1px solid ${border}`,
      borderRadius: '25px',
      boxShadow: '0px 4px 10px #808080'
    }}>
      <Box sx={{
        position: 'absolute',
        top: '10px',
        left: '5px',
        right: '5px',
        bottom: '20px',
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
        <Box sx={{
          position: 'absolute',
          width: 'calc(100% - 130px)',
          height: '10px',
          background,
          left: '50%',
          top: '-1px',
          transform: 'translate(-50%, 0)',
          borderBottom: `solid 1px ${border}`,
          borderLeft: `solid 1px ${border}`,
          borderRight: `solid 1px ${border}`,
          borderRadius: '0 0 10px 10px'
        }} />
      </Box>
    </Box>
  );
}
