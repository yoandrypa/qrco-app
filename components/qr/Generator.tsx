import {SetStateAction, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DownloadIcon from "@mui/icons-material/Download";
import BrushIcon from "@mui/icons-material/Brush";
import CropFreeIcon from "@mui/icons-material/CropFree";
import PrintIcon from "@mui/icons-material/Print";
import useMediaQuery from "@mui/material/useMediaQuery";

import dynamic from "next/dynamic";

import {Accordion, AccordionDetails, AccordionSummary} from "../renderers/Renderers";
import {checkForAlpha, convertBase64, downloadAsSVGOrVerify, handleDesignerString} from "../../helpers/qr/helpers";
import {BackgroundType, FramesType, OptionsType} from "./types/types";
import QrGenerator from "./QrGenerator";
import {initialBackground, initialFrame} from "../../helpers/qr/data";
import Context from "../context/Context";
import NotifyDynamic from "./helperComponents/smallpieces/NotifyDynamic";
import {FRAMES_LENGTH} from "./constants";
import {GeneratorProps, GenProps} from "./auxFunctions";

const RenderMode = dynamic(() => import("./helperComponents/looseComps/RenderMode"));
const PDFGenDlg = dynamic(() => import("./helperComponents/PDFGenDlg"));
const RenderDownload = dynamic(() => import("./helperComponents/RenderDownload"));
const Notifications = dynamic(() => import("../../components/notifications/Notifications"));
const RenderPreviewButton = dynamic(() => import("./helperComponents/smallpieces/RenderPreviewButton"));
const RenderPreviewDrawer = dynamic(() => import("./helperComponents/smallpieces/RenderPreviewDrawer"));
const RenderNoUserWarning = dynamic(() => import("./helperComponents/smallpieces/RenderNoUserWarning"));
const Code = dynamic(() => import("./sections/Code"));
const Frames = dynamic(() => import("./sections/Frames"));
const Logos = dynamic(() => import("./sections/Logos"));
const RenderClaimingInfo = dynamic(() => import("./helperComponents/smallpieces/RenderClaimingInfo"));

const Generator = ({forceOverride}: GenProps) => { // @ts-ignore
  const { options, setOptions, background, setBackground, frame, setFrame, data, selected, userInfo, cornersData,
    dotsData, setIsWrong }: GeneratorProps = useContext(Context);
  const [expanded, setExpanded] = useState<string>('style');
  const [error, setError] = useState<object | string | null>(null);
  const [anchor, setAnchor] = useState<object | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const [generatePdf, setGeneratePdf] = useState<boolean>(false);
  const [isReadable, setIsReadable] = useState<{ readable: boolean; } | boolean | null>(null);
  const [openPreview, setOpenPreview] = useState<boolean>(false);

  const isWideForPreview = useMediaQuery("(min-width:800px)", { noSsr: true });

  const qrImageData = useRef<any>(null);
  const doneFirst = useRef<boolean>(false);
  const fileInput = useRef<any>();
  const mustReload = useRef<boolean>(false);

  const handleExpand = (panel: SetStateAction<string>) => (_: any, newExpanded: SetStateAction<string>) => {
    setExpanded(newExpanded ? panel : '');
  };

  // @ts-ignore
  const handleDownload = ({currentTarget}) => {
    setAnchor(currentTarget);
  };

  // @ts-ignore
  const onLoadFile = ({target}) => {
    const f = target.files[0];
    const img = new Image();
    img.src = URL.createObjectURL(f);
    img.onload = async () => {
      if (f.size <= 51200) {
        const base = await convertBase64(structuredClone(f));
        const check = await checkForAlpha(f);
        const back = {...background, file: base};
        if (check?.hasAlpha) {
          if (!Boolean(back.backColor)) {
            back.backColor = '#ffffff';
          }
        } else if (Boolean(back.backColor)) {
          delete back.backColor;
        }
        setBackground(back);
      } else {
        setError('The selected file is larger than 50 kB.')
      }
    }
    fileInput.current.value = '';
  };

  const command = (): void => {
    if (mustReload.current) {
      mustReload.current = false;
      // setUpdating(true);                         <-------- this line makes the component to repaint if logos
    }
  };

  const contrastColors = useMemo(() => {
    if ((!options?.backgroundOptions?.color || !options?.dotsOptions?.color) && options?.backgroundOptions?.color === '#ffffff00') {
      return undefined;
    }
    return {color1: options.backgroundOptions?.color || '#000000', color2: options.dotsOptions?.color || '#ffffff'};
  }, [options?.backgroundOptions?.color, options?.dotsOptions?.color]);

  const checkForReadability = () => {
    downloadAsSVGOrVerify(qrImageData.current, setIsReadable, contrastColors);
  };

  const handleBackground = (item: string) => (event: { target: { value: string; checked: any; }; color: any; }) => {
    if (event.target) {
      setBackground((prev: BackgroundType) => {
        let back = {...prev, [item]: item !== 'invert' ? event.target.value : event.target.checked};
        if (event.target.value === 'solid') {
          back = structuredClone(initialBackground);
        }
        return back;
      });
    } else if (event.color) {
      setBackground((prev: BackgroundType) => ({...prev, backColor: event.color}));
    }
  };

  const handleUpload = () => {
    fileInput.current.click();
  };

  const handleReset = useCallback(() => {
    setBackground(structuredClone(initialBackground));
  }, [background]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMainFrame = (elem: string, payload: any) => {
    if (payload !== null) {
      if (elem === 'image') {
        setFrame((prev: FramesType) => {
          const selectedFrame = {...prev, type: payload};
          if (payload === '/frame/frame1.svg' && frame.textColor === '#000000') {
            selectedFrame.textColor = '#ffffff';
          } else if (['/frame/frame2.svg', '/frame/frame3.svg', '/frame/frame4.svg'].includes(payload) && frame.textColor === '#ffffff') {
            selectedFrame.textColor = '#000000';
          }
          return selectedFrame;
        });
      } else {
        setFrame((prev: FramesType) => ({...prev, [elem]: payload}));
      }
    } else {
      setFrame((prev: FramesType) => ({...prev, ...initialFrame}));
    }
  };

  const handleFrame = (item: string) => (payload: any) => {
    let value;
    if (item !== 'text' && payload?.target?.checked !== undefined) {
      value = payload.target.checked;
    } else {
      const val = payload?.target?.value;
      value = val !== undefined ? val.slice(0, FRAMES_LENGTH) : payload?.color || payload?.textColor || payload;
    }
    handleMainFrame(item, value);
  };

  const handleMainData = (item: string, payload: any, icon = null) => {
    if (!payload?.fileContents) {
      setOptions((prev: OptionsType) => ({...prev, [item]: payload}));
    } else {
      if (icon) {
        setOptions((prev: OptionsType) => ({...prev, image: icon}));
      } else {
        setOptions((prev: OptionsType) => ({...prev, image: payload.fileContents}));
      }
    }
  };

  const handleData = (item: string) => (payload: any) => {
    setOptions((prev: OptionsType) => {
      const opts = {...prev};
      if (item.includes('.')) {
        const x = item.split('.'); // @ts-ignore
        if (!opts[x[0]]) { // @ts-ignore
          opts[x[0]] = '';
        }
        if (typeof payload === 'string') { // @ts-ignore
          opts[x[0]][x[1]] = payload;
        } else if (payload.color) { // @ts-ignore
          opts[x[0]][x[1]] = payload.color;
        } else { // @ts-ignore
          opts[x[0]][x[1]] = payload.target.value !== '-1' ? payload.target.value : null;
        }
      } else if (!payload || typeof payload === 'string') { // @ts-ignore
        opts[item] = payload;
      } else if (item === 'data') {
        opts[item] = payload.target.value.length ? payload.target.value : 'ebanux';
      }
      return opts;
    });
  };

  const dataToOverride = useMemo(() => (
    forceOverride !== undefined ? forceOverride : (!Boolean(data.isDynamic) && Object.keys(data).length ? handleDesignerString(selected, data) : null)
  ), [data, selected, forceOverride]);

  useEffect(() => {
    if (isReadable) {
      setTimeout(() => {
        setIsReadable(null);
      }, 3700);
    }
  }, [isReadable]);

  useEffect(() => {
    if (doneFirst.current && Object.keys(background).length) {
      // const opts = {...options};
      if (background.type === 'solid') {
        handleReset();
      } else {
        handleUpload();
      }
      // setOptions(opts);
    }
  }, [background.type]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (background.type === 'image') {
      setBackground((prev: BackgroundType) => ({...prev, opacity: background.invert ? 100 : 50}));
    }
  }, [background.invert]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let wrong = false;
    if (background.type === 'image' && !background.file) {
      wrong = true;
    }
    setIsWrong(wrong);
  }, [background.file, background.type]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (doneFirst.current && Boolean(options?.backgroundOptions)) {
      setOptions((prev: OptionsType) => {
        const opts = {...prev};
        opts.backgroundOptions.color = background.file ? '#ffffff00' : '#ffffff';
        return opts;
      });
    }
  }, [background.file]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mustReload.current = Boolean(options.image);
    if (isReadable) {
      setIsReadable(null);
    }
  }, [options, background]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (updating) {
      setTimeout(() => {
        setUpdating(false);
      }, 350);
    }
    if (!doneFirst.current) {
      doneFirst.current = true;
    }
  }, [updating]);

  useEffect(() => {
    if (isWideForPreview && openPreview) { setOpenPreview(false); }
  }, [isWideForPreview]); // eslint-disable-line react-hooks/exhaustive-deps

  const renderQrGenerator = () => (
    <>
      <Box sx={{mt: {sm: 0, xs: 1}}}>
        <QrGenerator
          ref={qrImageData}
          options={options}
          frame={frame}
          hidden={updating}
          command={command}
          cornersData={cornersData}
          dotsData={dotsData} // @ts-ignore
          overrideValue={dataToOverride}
          background={!background.file ? null : background}/>
        <Box sx={{width: '100%', height: '35px', mt: '-2px', textAlign: 'center'}}>
          {isReadable ? ( // @ts-ignore
            <Typography sx={{color: theme => isReadable.readable ? theme.palette.success.dark : theme.palette.error.dark, height: '25px'}}> {/* @ts-ignore */}
              {`${isReadable.readable ? 'High' : 'Low'} chance to be readable.`}
            </Typography>
          ) : (
            <Button variant="contained" onClick={checkForReadability} startIcon={<CropFreeIcon/>} sx={{width: '100%', height: '25px'}}>
              {'Check for readability'}
            </Button>
          )}
        </Box>
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Button sx={{mt: '10px', width: '100%'}} variant="outlined" onClick={handleDownload} startIcon={<DownloadIcon/>}>
          {'Download'}
        </Button>
        <Button sx={{mt: '10px', width: '120px', ml: '5px'}} variant="outlined" onClick={() => setGeneratePdf(true)} startIcon={<PrintIcon/>}>
          {'Print'}
        </Button>
      </Box>
   </>
  );

  return (
    <> {/* @ts-ignore */}
      {error && <Notifications open message={error} onClose={() => setError(null)}/>}
      {background.type === 'image' && <input ref={fileInput} type="file" accept="image/*" style={{display: 'none'}} onChange={onLoadFile}/>}
      <Box sx={{border: '1px solid rgba(0, 0, 0, .125)', borderRadius: '5px', p: 1, width: '100%'}}>
        {!Boolean(userInfo) && forceOverride === undefined && data.mode !== 'secret' && <RenderNoUserWarning/>}
        <Box sx={{display: 'flex', width: '100%', position: 'relative'}}>
          <BrushIcon sx={{fontSize: '53px', mt: '2px', color: theme => theme.palette.primary.dark}}/>
          <Box sx={{textAlign: 'left', display: 'block'}}>
            <Typography variant="h6">QR Designer</Typography>
            <Typography>QR Code appearance settings</Typography>
          </Box>
          <NotifyDynamic styling={{position: 'absolute', right: 0}} isDynamic={Boolean(data.isDynamic)}/>
          {data.claim !== undefined && (<Box sx={{position: 'absolute', right: 0, top: '20px', textAlign: 'center'}}>
            <RenderClaimingInfo claim={data.claim} />
          </Box>)}
          {data.mode && <RenderMode isWide={isWideForPreview} sx={{top: '24px'}} mode={data.mode} />}
        </Box>
        <Box sx={{display: 'flex', m: {sm: 2, xs: 0}}}>
          <Box sx={{ width: '100%', mr: isWideForPreview ? 2 : 0, overflow: 'auto', textAlign: 'left' }}> {/* @ts-ignore */}
            <Accordion expanded={expanded === 'style'} onChange={handleExpand('style')}>
              <AccordionSummary aria-controls="style-content" id="style-header">
                <Typography>Body</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Code
                  background={background}
                  handleBackground={handleBackground}
                  handleData={handleData}
                  options={options}
                  handleUpload={handleUpload}
                  handleReset={handleReset}
                />
              </AccordionDetails>
            </Accordion> {/* @ts-ignore */}
            <Accordion expanded={expanded === 'frame'} onChange={handleExpand('frame')}>
              <AccordionSummary aria-controls="frame-content" id="frame-header">
                <Typography>Frame</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Frames frame={frame} handleMainFrame={handleMainFrame} handleFrame={handleFrame}/>
              </AccordionDetails>
            </Accordion> {/* @ts-ignore */}
            <Accordion expanded={expanded === 'logo'} onChange={handleExpand('logo')}>
              <AccordionSummary aria-controls="logo-content" id="logo-header">
                <Typography>Logo</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Logos handleMainData={handleMainData} image={options.image}/>
              </AccordionDetails>
            </Accordion>
          </Box>
          <Box sx={{display: isWideForPreview ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'space-between', width: {sm: '430px', xs: '100%'}}}>
            {updating ? <Typography sx={{ position: 'absolute', ml: 1, mt: 1, color: theme => theme.palette.text.disabled}}>{'Generating QR...'}</Typography> : null}
            {renderQrGenerator()}
          </Box>
        </Box>
      </Box>
      {!isWideForPreview && !openPreview && ( // @ts-ignore
        <RenderPreviewButton setOpenPreview={setOpenPreview} message="Preview" />
      )}
      {openPreview && ( // @ts-ignore
        <RenderPreviewDrawer title="Preview" setOpenPreview={setOpenPreview} height={450} border={10} autoHeight>
          <Box sx={{mx: '10px'}}>{renderQrGenerator()}</Box>
        </RenderPreviewDrawer>
      )}
      {Boolean(anchor) && (
        <RenderDownload frame={frame} qrImageData={qrImageData.current} anchor={anchor} setAnchor={setAnchor}/>
      )}
      {generatePdf && (
        <PDFGenDlg data={qrImageData.current} handleClose={() => setGeneratePdf(false)}
          isFramed={frame?.type && frame.type !== '/frame/frame0.svg' || false}/>
      )}
    </>
  );
};

export default Generator;
