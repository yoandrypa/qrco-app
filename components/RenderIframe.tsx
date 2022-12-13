import {useEffect, useRef, useState} from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import {DataType} from "./qr/types/types";
import {convertBase64} from "../helpers/qr/helpers";

interface IframeProps {
  src: string;
  width: string;
  height: string;
  data?: DataType;
  selected?: string;
}

const style = {
  m: 0,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center'
};

const RenderIframe = ({src, width, height, data, selected}: IframeProps) => {
  const [whatToRender, setWhatToRender] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const iRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (data && isReady) {
      setTimeout(async () => {
        const previewData = {...data};
        if (data.backgndImg) { // @ts-ignore
          previewData.backgndImg = await convertBase64(data.backgndImg);
        }
        if (data.foregndImg) { // @ts-ignore
          previewData.foregndImg = await convertBase64(data.foregndImg);
        } // @ts-ignore
        if (data.files) {
          let files: string[] = []; // @ts-ignore
          if (!data.isSample) {
          for (let i = 0, l = data.files.length; i < l; i += 1) {
            const x = data.files[i] as File | string; // @ts-ignore
              if (typeof x === 'string') { // @ts-ignore
                files.push(x);
              } else { // @ts-ignore
                files.push(await convertBase64(x));
              }
            }
          }  else { // @ts-ignore
            files = data.files;
          } // @ts-ignore
          previewData.files = files;
        }
        // @ts-ignore
        iRef.current.contentWindow.postMessage(JSON.stringify({previewData}), process.env.REACT_MICROSITES_ROUTE);
      }, 50);
    }
  }, [data, isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = (event: any) => {
      if (!isReady && event.origin.replace('https://www.', 'https://') === process.env.REACT_MICROSITES_ROUTE) {
        try {
          const dataFromOutside = JSON.parse(event.data);
          if (dataFromOutside.ready && iRef.current?.contentWindow) {
            iRef.current.contentWindow.postMessage(JSON.stringify({ parentWidth: width, parentHeight: height }), '*');
          } else if (dataFromOutside.readyForDuty) {
            setIsReady(true);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    window.addEventListener("message", handler);

    return () => window.removeEventListener("message", handler);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (whatToRender !== null) { setWhatToRender(null); }
    if (error) { setError(false); }
  },[src]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsLoading(true);
  }, [selected]);

  const handleLoad = () => {
    setIsLoading(false);
  }

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  }

  if (whatToRender !== null || error) {
    return (
      <Box sx={style}>
        <Typography sx={{fontWeight: 'bold'}}>
          {'The requested example failed to load'}
        </Typography>
        <Divider sx={{mt: '10px'}}/>
        <Typography sx={{fontSize: 'small'}}>
          {whatToRender === 'IO Error' ? 'Containing file was not found or is offline' : (
            whatToRender === 'offline' ? 'Current example is offline' : 'Unknown cause'
          )}
        </Typography>
        <Divider/>
        <Typography
          sx={{color: theme => theme.palette.text.disabled, mx: 'auto', mt: '10px', fontSize: 'small'}}>
          {"Please, contact support by clicking "}
          <a target="_blank" href="mailto:info@ebanux.com"
             rel="noopener noreferrer"
             style={{color: "royalblue"}}>{"here"}</a>
          {"."}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {isLoading && (<Box sx={style}>
        <Typography>{'Loading...'}</Typography>
        <Typography sx={{ color: theme => theme.palette.text.disabled}}>{'Please wait...'}</Typography>
      </Box>)}
      <iframe
        src={src}
        width={width}
        height={height}
        ref={iRef}
        onLoad={handleLoad}
        onError={handleError}
        style={{border: 'none', borderRadius: 'inherit'}}/>
    </>
  );
}

export default RenderIframe;
