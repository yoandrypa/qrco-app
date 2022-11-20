import {useEffect, useRef, useState} from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

interface IframeProps {
  src: string;
  width: number;
  height: number;
}

export default function RenderIframe({src, width, height}: IframeProps) {
  const [whatToRender, setWhatToRender] = useState<string | null>(null);
  const iRef = useRef<HTMLIFrameElement | null>(null);

  const handleLoad = () => {
    if (iRef.current?.contentWindow) {
      iRef.current.contentWindow.postMessage({name: 'hello'}, '*');
    }
  }

  useEffect(() => {
    const handler = (event: any) => {
      if (event.origin === process.env.REACT_MICROSITES_ROUTE) {
        try {
          const data = JSON.parse(event.data)
          if (data.error) {
            setWhatToRender(data.message);
          }
        } catch (e) {
          console.error(e)
        }
      }
    }

    window.addEventListener("message", handler);

    return () => window.removeEventListener("message", handler)
  }, []);

  if (whatToRender !== null) {
    return (
      <Box sx={{height: '520px', width: '100%', position: 'absolute', background: '#fff'}}>
        <Box sx={{m: 0, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
          <Typography sx={{ fontWeight: 'bold' }}>
            {'The requested example failed to load'}
          </Typography>
          <Divider sx={{ mt: '10px' }} />
          <Typography sx={{fontSize: 'small'}}>
            {whatToRender === 'IO Error' ? 'Containing file was not found or is offline' : 'Unknown cause'}
          </Typography>
          <Divider />
          <Typography
            sx={{ color: theme => theme.palette.text.disabled, mx: 'auto', mt: '10px', fontSize: 'small' }}>
            {"Please, contact support by clicking "}
            <a target="_blank" href="mailto:info@ebanux.com"
               rel="noopener noreferrer"
               style={{ color: "royalblue" }}>{"here"}</a>
            {"."}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <iframe src={src} width={width} height={height} ref={iRef} onLoad={handleLoad} style={{border: 'none'}}/>
  );
}
