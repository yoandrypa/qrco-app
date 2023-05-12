import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import sxClasses from "./styles.sx";

export default function LoadingQrs() {
    const { sxCenterBox, sxMsgBox, sxMsgText } = sxClasses;
    return (
      <Box sx={sxCenterBox}>
        <Box sx={sxMsgBox}>
          <Typography sx={sxMsgText}>
            {'Loading your QR-Lynks...'}
          </Typography>
        </Box>
      </Box>
    );
};
