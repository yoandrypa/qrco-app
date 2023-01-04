import {useEffect, useRef, useState} from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import {DataType} from "./qr/types/types";
import {convertBase64} from "../helpers/qr/helpers";
import CircularProgress from "@mui/material/CircularProgress";

interface IframeProps {
  src: string;
  width: string;
  height: string;
  data?: DataType;
  selected?: string;
  backImg?: File | string;
  mainImg?: File | string;
}

const style = {
  m: 0,
  background: '#fff',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center'
};

const RenderIframe = ({src, width, height, data, selected, backImg, mainImg}: IframeProps) => {
  const [whatToRender, setWhatToRender] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const iRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (data && isReady) {
      const isInEdition = data.mode === 'edit';
      setTimeout(async () => {
        const previewData = {...data};
        if ((!isInEdition && data.backgndImg) || backImg) { // @ts-ignore
          previewData.backgndImg = !isInEdition ? await convertBase64( data.backgndImg) : backImg;
        }
        if ((!isInEdition && data.foregndImg) || mainImg) { // @ts-ignore
          previewData.foregndImg = !isInEdition ? await convertBase64(data.foregndImg) : mainImg;
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
        if (iRef.current?.contentWindow) { // @ts-ignore
          iRef.current.contentWindow.postMessage(JSON.stringify({previewData}), process.env.REACT_MICROSITES_ROUTE);
        }
      }, 50);
    }
  }, [data, isReady, backImg, mainImg]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = (event: any) => {
      if (!isReady && event.origin.replace('https://www.', 'https://') === process.env.REACT_MICROSITES_ROUTE) {
        try {
          const dataFromOutside = JSON.parse(event.data);
          if (dataFromOutside.ready && iRef.current?.contentWindow) {
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
          <a target="_blank" href="mailto:info@ebanux.com" rel="noopener noreferrer" style={{color: "royalblue"}}>{"here"}</a>
          {"."}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {isLoading && (<Box sx={style}>
        <Typography sx={{ p: 2 }}>{'Loading...'}</Typography>
        <CircularProgress color="primary" size={25}/>
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
