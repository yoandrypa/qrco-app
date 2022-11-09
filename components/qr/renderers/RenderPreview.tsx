/* eslint-disable @next/next/no-img-element */

import {useRef, useState, useEffect} from "react";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";

import QrGenerator from "../QrGenerator";
import {BackgroundType, CornersAndDotsType, FramesType, OptionsType} from "../types/types";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadIcon from "@mui/icons-material/Download";
import Button from "@mui/material/Button";
import PDFGenDlg from "../helperComponents/PDFGenDlg";
import RenderDownload from "../helperComponents/RenderDownload";
import {
  getBackgroundObject,
  getCornersAndDotsObject,
  getFrameObject,
  getOptionsObject
} from "../../../helpers/qr/helpers";
import {initialBackground} from "../../../helpers/qr/data";

interface QRRenderProps {
  qrData: string;
  width: number;
  alt: string;
}

// noinspection JSDeprecatedSymbols
const QRRender = ({ qrData, width, alt }: QRRenderProps) => (<img src={`data:image/svg+xml;base64,${btoa(qrData)}`} alt={alt} width={width}/>);

interface PreviewProps {
  qrDesign: any;
  qr: any;
}

const RenderPreview = ({ qrDesign, qr }: PreviewProps) => {
  const [preview, setPreview] = useState<boolean>(false);
  const [qrData, setQrData] = useState<any>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<object | null>(null);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);

  const qrRef = useRef();
  const done = useRef(false);

  const handlePreView = (): void => {
    setPreview((previous: boolean) => !previous);
  };

  // @ts-ignore
  const handleDownload = ({ currentTarget }) => {
    setAnchor(currentTarget);
  };

  // frame definition is outside due to it is used in the donwload mechanism
  const frame: FramesType | null = getFrameObject(qrDesign);

  const generateQr = () => {
    const options: OptionsType = getOptionsObject(qrDesign);
    const background: BackgroundType = getBackgroundObject(qrDesign) || initialBackground;
    const cornersData: CornersAndDotsType = getCornersAndDotsObject(qrDesign, 'corners');
    const dotsData: CornersAndDotsType = getCornersAndDotsObject(qrDesign, 'cornersDot');

    const render = <QrGenerator
      ref={qrRef}
      options={options}
      frame={frame}
      background={background.file ? background : null}
      cornersData={cornersData}
      dotsData={dotsData}
      overrideValue={undefined}
    />

    // @ts-ignore
    setQrData(render);
  };

  useEffect(() => {
    if (qrData) {
      // @ts-ignore
      const t = qrRef.current?.outerHTML;
      setCurrent(t);
    }
  }, [qrData]);

  useEffect(() => {
    if (current && qrDesign.image?.length && !done.current) {
      done.current = true;
      setUpdating(true);
    }
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (updating) {
      // noinspection TypeScriptValidateTypes
      setTimeout(() => {
        setUpdating(false);
        generateQr();
        // @ts-ignore
      }, 250);
    }
  }, [updating]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    generateQr();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const name = qr.name;

  const getJson = (event: {key: string;}) => {
    if (event.key === 'J') {
      const newJson = {...qr};
      if (newJson.qrOptionsId) {
        delete newJson.qrOptionsId;
      }
      console.log(JSON.stringify(newJson));
    }
  }

  return (
    <>
      <Box sx={{ display: 'none' }}>{qrData}</Box>
      <Box onClick={handlePreView} sx={{ cursor: 'pointer' }}>
        {current && !updating ? (
          <QRRender qrData={current || ''} width={70} alt={name}/>
        ) : (
          <CircularProgress color="primary" sx={{ ml: '10px', my: 'auto' }}/>
        )}
      </Box>
      {preview && (
        <Dialog onClose={handlePreView} open={true} onKeyPress={getJson}>
          <DialogContent>
            <Box sx={{ width: '300px' }}>
              <QRRender qrData={current || ''} width={300} alt={`${name}preview`} />
              <Button sx={{ mt: '10px', width: '100%' }} variant="outlined" onClick={handleDownload} startIcon={<DownloadIcon />}>
                {'Download'}
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      )}
      {Boolean(anchor) && (
        <RenderDownload
          frame={frame}
          qrImageData={qrRef.current}
          anchor={anchor}
          setAnchor={setAnchor}
          setGeneratePdf={setGeneratePdf} />
      )}
      {generatePdf && (
        <PDFGenDlg
          data={qrRef.current}
          handleClose={() => setGeneratePdf(false)}
          isFramed={Boolean(frame?.type) && frame?.type !== '/frame/frame0.svg'} />
      )}
    </>
  );
}

export default RenderPreview;
