import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

import { FramesType } from '../types/types';
import { downloadAsPNG, downloadAsSVGOrVerify } from '../../../helpers/qr/helpers';

interface RenderDownloadProps {
  qrImageData: any;
  anchor: any;
  setAnchor: Function;
  frame?: FramesType | { type: string } | null;
  contrast?: {color1?: string; color2: string} | undefined
}

const RenderDownload = ({ anchor, qrImageData, frame, setAnchor, contrast }: RenderDownloadProps) => {
  const [isReadable, setIsReadable] = useState<{readable: boolean} | undefined>(undefined);

  useEffect(() => {
    downloadAsSVGOrVerify(qrImageData, setIsReadable, contrast);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Popover
      id="downloadPopover"
      open
      anchorEl={anchor}
      onClose={() => { setAnchor(null); }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Box sx={{ p: 1, width: '230px' }}>
        {isReadable !== undefined && !Boolean(isReadable?.readable) && (
          <Box sx={{ color: theme => theme.palette.error.dark, width: '100%', textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 'bold' }}>
              {'Warning!'}
            </Typography>
            <Typography>
              {'The generated QR code may not be readable by scanners.'}
            </Typography>
            <Divider sx={{ my: 2 }} />
          </Box>
        )}
        <Box sx={{ width: '100%', color: theme => theme.palette.text.disabled, textAlign: 'center', mb: 2 }}>
          <Typography sx={{ fontSize: 'small', fontWeight: 'bold', display: 'inline', color: theme => theme.palette.error.dark }}>Be advised:</Typography>
          <Typography sx={{ fontSize: 'small', ml: '5px', display: 'inline' }}>You should consider testing your QR before using it.</Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography sx={{ width: '100%', textAlign: 'center' }}>Download as</Typography>
        <Box sx={{ display: 'flex' }}>
          <Button
            variant="outlined"
            sx={{ width: '100%'}}
            onClick={() => {
              // @ts-ignore
              downloadAsPNG(qrImageData, Boolean(frame?.type) ? frame : { type: '' }, undefined, undefined);
              setAnchor(null);
            }}>PNG</Button>
          <Button
            variant="outlined"
            sx={{ ml: '5px', width: '100%' }}
            onClick={() => {
              downloadAsSVGOrVerify(qrImageData, undefined, undefined);
              setAnchor(null);
            }}>SVG</Button>
        </Box>
      </Box>
    </Popover>
  );
};

export default RenderDownload;
