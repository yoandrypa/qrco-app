import {useState} from "react";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import TumbUpIcon from "@mui/icons-material/ThumbUp";
import Box from "@mui/material/Box";

import {useRouter} from "next/router";

import RenderDownload from "../RenderDownload";
import {FramesType} from "../../types/types";
import PDFGenDlg from "../PDFGenDlg";

interface DownloadPrintProps {
  code: string;
  qrImageData: string;
  frame?: FramesType;
}

export default function RenderDownloadPrint({frame, code, qrImageData}: DownloadPrintProps) {
  const [anchor, setAnchor] = useState<object | null>(null);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);

  const router = useRouter();

  // @ts-ignore
  const handleDownload = ({currentTarget}) => {
    setAnchor(currentTarget);
  };

  return (
    <Box sx={{display: 'flex', flexDirection: {sm: 'row', xs: 'column'}}}>
      <Button sx={{mt: '10px'}} variant="outlined" onClick={handleDownload} startIcon={<DownloadIcon/>}>
        {'Download'}
      </Button>
      <Button
        sx={{mt: '10px', ml: {sm: '5px', xs: 0}}}
        variant="outlined"
        onClick={() => setGeneratePdf(true)}
        startIcon={<PrintIcon/>}>
        {'Print'}
      </Button>
      <Button
        sx={{mt: '10px', ml: {sm: '5px', xs: 0}}}
        variant="outlined"
        onClick={() => router.push({pathname: '/qr/type', query: {address: code}}, undefined)}
        startIcon={<TumbUpIcon/>}>
        {'Continue Claiming'}
      </Button>
      {generatePdf && (
        <PDFGenDlg
          data={qrImageData}
          handleClose={() => setGeneratePdf(false)}
          isFramed={frame?.type && frame.type !== '/frame/frame0.svg' || false}/>
      )}
      {Boolean(anchor) && (
        <RenderDownload
          frame={frame || null}
          qrImageData={qrImageData}
          anchor={anchor}
          setAnchor={setAnchor}/>
      )}
    </Box>
  );
}
