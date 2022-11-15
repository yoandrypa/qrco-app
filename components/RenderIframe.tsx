import Box from "@mui/material/Box";

interface IframeProps {
  src: string;
  width: number;
  height: number;
}

export default function RenderIframe({src, width, height}: IframeProps) {
  return (
    <Box>
      <iframe src={src} width={width} height={height} />
    </Box>
  );
}
