import {useRef} from 'react';

interface IframeProps {
  src: string;
  width: number;
  height: number;
}

export default function RenderIframe({src, width, height}: IframeProps) {
  const iRef = useRef<HTMLIFrameElement | null>(null);

  const handleLoad = () => {
    if (iRef.current?.contentWindow) {
      iRef.current.contentWindow.postMessage({name: 'hello'}, '*');
    }
  }

  return (
    <iframe src={src} width={width} height={height} ref={iRef} onLoad={handleLoad} style={{ pointerEvents: 'none' }} />
  );
}
