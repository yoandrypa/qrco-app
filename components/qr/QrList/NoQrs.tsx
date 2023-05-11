import dynamic from "next/dynamic";
import InfoIcon from '@mui/icons-material/Info';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import sxClasses from "./styles.sx";

const ButtonCreateQrLynks = dynamic(() => import("../../menus/MainMenu/ButtonCreateQrLynks"));

export default function NoQrs() {
  const { sxCenterBox, sxMsgBox, sxMsgText } = sxClasses;
  return (
    <Box sx={sxCenterBox}>
      <Box sx={sxMsgBox}>
        <InfoIcon color="info" />
        <Typography sx={{ ...sxMsgText, mb: 2 }}>
          {'There are no QRLynks.'}
        </Typography>
        <ButtonCreateQrLynks light />
      </Box>
    </Box>
  );
};
