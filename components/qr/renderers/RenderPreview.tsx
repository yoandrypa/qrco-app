/* eslint-disable @next/next/no-img-element */

import {useEffect, useRef, useState} from "react";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import DoneIcon from "@mui/icons-material/Done";

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
  getOptionsObject,
  handleInitialData
} from "../../../helpers/qr/helpers";
import {initialBackground} from "../../../helpers/qr/data";
import PrintIcon from "@mui/icons-material/Print";
import useMediaQuery from "@mui/material/useMediaQuery";

// noinspection JSDeprecatedSymbols
const QRRender = ({qrData, width, alt}: {qrData: string; width: number | string; alt: string;}) =>
  <img src={`data:image/svg+xml;base64,${btoa(qrData)}`} alt={alt} width={width}/>;

interface PreviewProps {
  handleDone?: () => void;
  externalFrame?: FramesType;
  externalDesign?: any;
  qrDesign?: any;
  qr?: any;
  avoidDuplicate?: boolean;
  onlyPreview?: boolean;
  width?: number | string;
  override?: string;
  externalClose?: () => void;
}

const RenderPreview = ({externalClose, onlyPreview, qrDesign, qr, externalFrame, externalDesign, handleDone, override, width, avoidDuplicate, ...qrProps}: PreviewProps) => {
  const [preview, setPreview] = useState<boolean>(false);
  const [qrData, setQrData] = useState<any>(null);
  const [current, setCurrent] = useState<string | null>(externalDesign || null);
  const [anchor, setAnchor] = useState<object | null>(null);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);

  const qrRef = useRef();
  const done = useRef(false);

  const isWide = useMediaQuery("(min-width:400px)", { noSsr: true });

  const handlePreView = (): void => {
    if (onlyPreview) {
      setPreview((previous: boolean) => !previous);
    }
  };

  // @ts-ignore
  const handleDownload = ({currentTarget}) => {
    setAnchor(currentTarget);
  };

  // frame definition is outside due to it is used in the donwload mechanism
  const frame: FramesType | null = externalFrame || getFrameObject(qrDesign);

  const generateQr = () => {
    const options: OptionsType = qrDesign ? getOptionsObject(qrDesign) : handleInitialData(override);
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
    /> // @ts-ignore
    setQrData(render);
  };

  const handleCloseEvent = () => {
    if (!externalClose) {
      handlePreView();
    } else {
      externalClose();
    }
  }

  useEffect(() => {
    if (qrData) { // @ts-ignore
      const t = qrRef.current?.outerHTML;
      setCurrent(t);
    }
  }, [qrData]);

  useEffect(() => {
    if (current && qrDesign?.image?.length && !done.current) {
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
      }, 450);
    }
  }, [updating]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (qrDesign || override) {
      generateQr();
    }
  }, [qrDesign, override]); // eslint-disable-line react-hooks/exhaustive-deps

  const name = qr?.name || 'unnamed';

  const getJson = (event: { key: string; }) => {
    if (event.key === 'J') {
      const newJson = {...qr};
      if (newJson.qrOptionsId) {
        delete newJson.qrOptionsId;
      }
      console.log(JSON.stringify(newJson));
    }
  }

  const renderButtons = () => (
    <Box sx={{display: 'flex', flexDirection: isWide ? 'row' : 'column', width: '100%'}}>
      <Button sx={{mt: '10px', width: handleDone || !isWide ? '100%' : '60%', mr: handleDone ? '5px' : '10px'}}
              variant="outlined" id="buttonDow" onClick={handleDownload} startIcon={<DownloadIcon/>}>
        {'Download'}
      </Button>
      <Button sx={{mt: '10px', width: isWide ? (handleDone ? '160px' : '40%') : '100%'}} variant="outlined"
              id="buttonPrint"   onClick={() => setGeneratePdf(true)} startIcon={<PrintIcon/>}>
        {'Print'}
      </Button>
      {handleDone !== undefined && (
        <Button sx={{ml: isWide ? '5px' : 0, mt: '10px', width: isWide ? '150px' : '100%'}} variant="outlined"
                id="buttonD" onClick={handleDone} startIcon={<DoneIcon/>}>
          {'Done'}
        </Button>
      )}
    </Box>
  );

  return (
    <>
      <Box sx={{display: 'none'}}>{qrData}</Box>
      {!avoidDuplicate && !externalClose && (<Box onClick={handlePreView} sx={{cursor: !override ? 'pointer' : 'normal'}}>
        {current && !updating ? (
          <>
            <QRRender qrData={current || ''} width={width || 70} alt={name} {...qrProps}/>
            {!onlyPreview && <Box sx={{ pl: '18px' }}>{renderButtons()}</Box>}
          </>
        ) : <CircularProgress color="primary" sx={{ml: '10px', my: 'auto'}}/>}
      </Box>)}
      {(externalClose || preview || externalDesign !== undefined) && (
        <Dialog onClose={handleCloseEvent} open={true} onKeyDown={getJson}>
          <DialogContent>
            <Box sx={{width: {xs: '100%', sm: '350px'}}}>
              <QRRender qrData={!externalDesign ? (current || '') : externalDesign.outerHTML} width="100%" alt={`${name}preview`} />
              {renderButtons()}
            </Box>
          </DialogContent>
        </Dialog>
      )}
      {Boolean(anchor) && (
        <RenderDownload
          frame={frame}
          qrImageData={externalDesign || current || qrRef.current}
          anchor={anchor}
          setAnchor={setAnchor}/>
      )}
      {generatePdf && (
        <PDFGenDlg data={externalDesign || current || qrRef.current} handleClose={() => setGeneratePdf(false)}
          isFramed={Boolean(frame?.type) && frame?.type !== '/frame/frame0.svg'}/>
      )}
    </>
  );
}

export default RenderPreview;
