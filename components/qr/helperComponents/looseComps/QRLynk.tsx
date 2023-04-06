import {styled} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {MAIN_ORANGE} from "../../constants";

type StylesProps = {
  orange?: boolean;
  bold?: boolean;
  size?: string;
}

const Typo = styled(Typography)(({ bold, size, orange }: StylesProps) => ({
  display: 'inline',
  fontWeight: bold ? 'bold' : 'unset',
  fontSize: size || '1rem',
  color: orange ? MAIN_ORANGE : '#000'
}));

interface QRLynkProps {
  size?: string;
  plural?: boolean;
}

export default function QRLynk({size, plural}: QRLynkProps) {
  return (
    <>
      <Typo bold size={size}>QR</Typo>
      <Typo orange bold size={size}>{`Lynk${plural ? 's' : ''}`}</Typo>
    </>
  );
}
