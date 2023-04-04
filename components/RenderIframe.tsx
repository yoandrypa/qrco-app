import { useEffect, useRef, useState } from "react";
import messaging from "@ebanux/ebanux-utils/messaging";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";

import { DataType } from "./qr/types/types";
import { convertBase64, getImageData } from "../helpers/qr/helpers";

interface IframeProps {
  src: string;
  width: string;
  height: string;
  data: DataType;
  notifyReady: (isReady: boolean) => void;
  shareLink?: string;
  selected?: string;
  backgroundImg?: File | string;
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

const mSubscriptions: any[] = [];

const RenderIframe = ({src, width, height, data: initData, selected, backImg, mainImg, backgroundImg, shareLink, notifyReady}: IframeProps) => {
  const [newData, setNewData] = useState<DataType>(initData);
  const [whatToRender, setWhatToRender] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const iRef = useRef<HTMLIFrameElement | null>(null);

  function updatePreview(data: DataType){
    if (isReady) {
      const previewData = structuredClone(data) as any;
      const isInEdition = previewData.mode === 'edit' || previewData.mode === 'clone';

      setTimeout(async () => {
        if (shareLink && previewData.shortlinkurl === undefined) {
          previewData.shortlinkurl = shareLink;
        }
        if (previewData.backgndImg || backImg) {
          previewData.backgndImg = !isInEdition || proceed(backImg, previewData.backgndImg) ?
            await getImageData(previewData.backgndImg) : await getImageData(backImg);
        }
        if (previewData.foregndImg || mainImg) {
          previewData.foregndImg = !isInEdition || proceed(mainImg, previewData.foregndImg) ?
            await getImageData(previewData.foregndImg) : await getImageData(mainImg);
        }
        if (previewData.micrositeBackImage || backgroundImg) {
          previewData.micrositeBackImage = !isInEdition || proceed(backgroundImg, previewData.micrositeBackImage) ?
            await getImageData(previewData.micrositeBackImage) : await getImageData(backgroundImg);
        }

        if (previewData.custom) {
          for (let idx = 0, ll = previewData.custom.length; idx < ll; idx += 1) {
            const section = previewData.custom[idx];
            if (['pdf', 'gallery', 'audio', 'video'].includes(section.component) && section.data?.files) {
              let files: string[] = [];
              if (!previewData.isSample) {
                for (let i = 0, l = section.data.files.length; i < l; i += 1) {
                  const x = section.data.files[i] as File | string; // @ts-ignore
                  if (typeof x === 'string' || x.Key !== undefined) { // @ts-ignore
                    files.push(x);
                  } else { // @ts-ignore
                    files.push(await convertBase64(x));
                  }
                }
              } else { // @ts-ignore
                files = section.data.files;
              }
              previewData.custom[idx].data.files = files;
            }
          }
        }

        if (iRef.current?.contentWindow) { // @ts-ignore
          iRef.current.contentWindow.postMessage(JSON.stringify({previewData}), process.env.MICRO_SITES_BASE_URL);
        }
      }, 75);
    }
  }

  useEffect(() => {
    updatePreview(initData);
  }, [initData, isReady, backImg, mainImg, backgroundImg]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    updatePreview(newData);
  }, [newData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = (event: any) => {
      if (!isReady && event.origin.replace('https://www.', 'https://') === process.env.MICRO_SITES_BASE_URL) {
        try {
          const dataFromOutside = JSON.parse(event.data);
          if (dataFromOutside.ready && iRef.current?.contentWindow) {
            setIsReady(true);
            notifyReady(true);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    window.addEventListener("message", handler);

    return () => {
      notifyReady(false);
      window.removeEventListener("message", handler);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Anything in here is fired on component mount.
    mSubscriptions.push(messaging.setListener('onChangePreviewQrData', setNewData));

    return () => {
      // Anything in here is fired on component unmount.
      messaging.delListener(mSubscriptions);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (whatToRender !== null) setWhatToRender(null);
    if (error) setError(false);
  }, [src]); // eslint-disable-line react-hooks/exhaustive-deps

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
        <Typography sx={{ fontWeight: 'bold' }}>
          {'The requested example failed to load'}
        </Typography>
        <Divider sx={{ mt: '10px' }} />
        <Typography sx={{ fontSize: 'small' }}>
          {whatToRender === 'IO Error' ? 'Containing file was not found or is offline' : (
            whatToRender === 'offline' ? 'Current example is offline' : 'Unknown cause'
          )}
        </Typography>
        <Divider />
        <Typography
          sx={{ color: theme => theme.palette.text.disabled, mx: 'auto', mt: '10px', fontSize: 'small' }}>
          {"Please, contact support by clicking "}
          <a target="_blank" href="mailto:info@ebanux.com" rel="noopener noreferrer"
             style={{ color: "royalblue" }}>{"here"}</a>
          {"."}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {isLoading && (<Box sx={style}>
        <Typography sx={{ p: 2 }}>{'Loading...'}</Typography>
        <CircularProgress color="primary" size={25} />
      </Box>)}
      <iframe
        src={src}
        width={width}
        height={height}
        ref={iRef}
        onLoad={handleLoad}
        onError={handleError}
        style={{ border: 'none', borderRadius: 'inherit' }} />
    </>
  );
}

export default RenderIframe;
