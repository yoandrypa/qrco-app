interface LogoBackProps {
  sizeWH: number;
  posX: number;
  posY: number;
}

function RenderLogoBack({sizeWH, posX, posY}: LogoBackProps) {
  const size = Math.floor(sizeWH * 60 / 280); // 280 normal size

  return (
    <rect
      width={size}
      height={size}
      x={posX + (sizeWH / 2) - (size / 2)}
      y={posY + (sizeWH / 2) - (size / 2)}
      fill="#ffffff"
    />
  );
}

export default RenderLogoBack;
