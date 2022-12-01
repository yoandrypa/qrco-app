import {useEffect, useRef, useState} from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

interface IframeProps {
  src: string;
  width: string;
  height: string;
}

interface RenderMessageProps {
  whatToRender?: string;
}

function RenderMessage({whatToRender}: RenderMessageProps) {
  return (
      <Box sx={{
        m: 0,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
      }}>
        {whatToRender !== undefined ? (
          <>
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
          </>
        ) : (
          <>
            <Typography>{'Loading...'}</Typography>
            <Typography sx={{ color: theme => theme.palette.text.disabled}}>{'Please wait...'}</Typography>
          </>
        )}
      </Box>
  );
}

export default function RenderIframe({src, width, height}: IframeProps) {
  const [whatToRender, setWhatToRender] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const iRef = useRef<HTMLIFrameElement | null>(null);

  const handleLoad = () => {
    setLoading(false);
  }

  const handleError = () => {
    setLoading(false);
    setError(true);
  }

  useEffect(() => {
    const handler = (event: any) => {
      if (event.origin.replace('https://www.', 'https://') === process.env.REACT_MICROSITES_ROUTE) {
        try {
          const data = JSON.parse(event.data)
          if (data.error) {
            setWhatToRender(data.message);
          } else if (data.ready) {
            if (iRef.current) {
              setTimeout(() => { // @ts-ignore
                iRef.current.contentWindow.postMessage(JSON.stringify({parentWidth: width, parentHeight: height}), '*');
              }, 150);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    window.addEventListener("message", handler);

    return () => window.removeEventListener("message", handler)
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (whatToRender !== null) { setWhatToRender(null); }
    if (error) { setError(false); }
  } ,[src]); // eslint-disable-line react-hooks/exhaustive-deps

  if (whatToRender !== null) {
    return <RenderMessage whatToRender={whatToRender} />;
  }

  if (error) {
    return <RenderMessage whatToRender="offline" />;
  }

  return (
    <>
      {loading && <RenderMessage />}
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
