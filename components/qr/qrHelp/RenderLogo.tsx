import {SCAN, SCAN1, SCAN2} from "./scans64";

interface LogoProps {
  sizeWH: number;
  posX: number;
  posY: number;
  logo: string;
}

function RenderLogo({sizeWH, posX, posY, logo}: LogoProps) {
  const size = Math.floor(sizeWH * 50 / 280); // 280 normal size
  let mylogo = logo;
  if (logo.startsWith('/scan/scan')) {
    const index = logo.indexOf('.');
    const before = logo.charAt(index - 1);
    if (before === '1') {
      mylogo = SCAN1;
    } else if (before === '2') {
      mylogo = SCAN2;
    } else {
      mylogo = SCAN;
    }
  }

  return (
    <image
      xlinkHref={mylogo}
      width={size}
      height={size}
      x={posX + (sizeWH / 2) - (size / 2)}
      y={posY + (sizeWH / 2) - (size / 2)}
    />
  );
}

export default RenderLogo;
