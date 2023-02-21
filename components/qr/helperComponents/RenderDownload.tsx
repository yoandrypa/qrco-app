import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

import { FramesType } from '../types/types';
import { downloadAsImg, downloadAsSVGOrVerify } from '../../../helpers/qr/helpers';
import RenderConfirmDlg from "../../renderers/RenderConfirmDlg";

interface RenderDownloadProps {
  qrImageData: any;
  anchor: any;
  setAnchor: Function;
  frame?: FramesType | { type: string } | null;
  contrast?: {color1?: string; color2: string} | undefined
}

const lookforA = "<rect x=\"0\" y=\"0\" height=\"280\" width=\"280\" clip-path=\"url('#clip-path-background-color')\" fill=\"#ffffff\"></rect>";
const lookforB = "<g id=\"background\"><rect width=\"280\" height=\"280\" x=\"0\" y=\"0\" fill=\"#ffffff\"></rect></g>";

const RenderDownload = ({ anchor, qrImageData, frame, setAnchor, contrast }: RenderDownloadProps) => {
  const [isReadable, setIsReadable] = useState<{readable: boolean} | undefined>(undefined);
  const [open, setOpen] = useState<string | null>(null);

  const proceedWithPng = (dataImg: string) => { // @ts-ignore
    downloadAsImg(dataImg, Boolean(frame?.type) ? frame : { type: '' }, undefined, undefined);
    setAnchor(null);
    if (open !== null) {
      setOpen(null);
    }
  }

  const handlePng = () => {
    const image = qrImageData;
    const doc = structuredClone(typeof image === 'string' ? image : image.outerHTML);
    const includes = doc.includes(lookforA) && doc.includes(lookforB);
    if (!includes) {
      proceedWithPng(doc);
    } else {
      setOpen(doc);
    }
  }

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
            id="buttonPNG"
            variant="outlined"
            sx={{ width: '100%'}}
            onClick={handlePng}>PNG</Button>
          <Button
            id="buttonJPG"
            variant="outlined"
            sx={{ ml: '5px', width: '100%'}}
            onClick={() => { // @ts-ignore
              downloadAsImg(qrImageData, Boolean(frame?.type) ? frame : { type: '' }, undefined, undefined, true);
              setAnchor(null);
            }}>JPG</Button>
          <Button
            id="buttonSVG"
            variant="outlined"
            sx={{ ml: '5px', width: '100%' }}
            onClick={() => {
              downloadAsSVGOrVerify(qrImageData, undefined, undefined);
              setAnchor(null);
            }}>SVG</Button>
        </Box>
      </Box>
      {open !== null && (
        <RenderConfirmDlg
          disableESC
          handleCancel={() => proceedWithPng(open)}
          handleOk={() => proceedWithPng(open.replace(lookforA, '').replace(lookforB, ''))}
          noMsg="white background"
          yesMsg="transparent background"
          title="Downloading png" message="This QR code can be downloaded as a png file with transparent background or white background."
          confirmationMsg="What version would you like?" />
      )}
    </Popover>
  );
};

export default RenderDownload;
