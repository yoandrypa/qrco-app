import {useEffect, useRef, useState} from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import {DataType} from "./qr/types/types";
import {convertBase64, getImageAsString} from "../helpers/qr/helpers";
import CircularProgress from "@mui/material/CircularProgress";
import { MEDIA } from "../consts";

interface IframeProps {
  src: string;
  width: string;
  height: string;
  data?: DataType;
  shareLink?: string;
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

const proceed = (plain?: any, imgData?: any) => {
  if (plain !== undefined) {
    return false;
  }
  return imgData !== undefined && (imgData instanceof File || imgData instanceof Blob);
}

const RenderIframe = ({src, width, height, data, selected, backImg, mainImg, shareLink}: IframeProps) => {
  const [whatToRender, setWhatToRender] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const iRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (data && isReady) {
      const isInEdition = data.mode === 'edit' || data.mode === 'clone';

      setTimeout(async () => {
        const previewData = {...data}; // @ts-ignore
        if (shareLink && data.shortlinkurl === undefined) { // @ts-ignore
          previewData.shortlinkurl = shareLink;
        }
        if (data.backgndImg || backImg) { // @ts-ignore
          previewData.backgndImg = !isInEdition || proceed(backImg, data.backgndImg) ?
            await getImageAsString(data.backgndImg) : await getImageAsString(backImg);
        }
        if (data.foregndImg || mainImg) { // @ts-ignore
          previewData.foregndImg = !isInEdition || proceed(mainImg, data.foregndImg) ?
            await getImageAsString(data.foregndImg) : await getImageAsString(mainImg);
        }

        // @ts-ignore
        if (data.files) {
          let files: string[] = []; // @ts-ignore
          if (!data.isSample) {
            for (let i = 0, l = data.files.length; i < l; i += 1) {
              const x = data.files[i] as File | string; // @ts-ignore
              if (typeof x === 'string' || x.Key !== undefined) { // @ts-ignore
                files.push(x);
              } else { // @ts-ignore
                files.push(await convertBase64(x));
              }
            }
          } else { // @ts-ignore
            files = data.files;
          } // @ts-ignore
          previewData.files = files;
        }

        if(data.fields) { // convert images on media fields to base64
          let fields: any[] = []; // @ts-ignore
          if (!data.isSample) {
            for (let i = 0, l = data.fields.length; i < l; i += 1) {
              if(!MEDIA.includes(data.fields[i].type) ){
                fields.push(data.fields[i]);
                continue;
              }
              const media = {type:data.fields[i].type, files:[]}// @ts-ignore
              for( let j = 0, k = data.fields[i].files.length; j < k; j += 1) {// @ts-ignore
                const file = data.fields[i].files[j] as File | string; // @ts-ignore
                if (typeof file === 'string' || file.Key !== undefined) { // @ts-ignore
                  media.files.push(file);
                } else { // @ts-ignore
                  media.files.push(await convertBase64(file));
                }
              }
              fields.push(media);
            }
          }  else { // @ts-ignore
            fields = data.fields;
          } // @ts-ignore
          previewData.fields = fields;
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
