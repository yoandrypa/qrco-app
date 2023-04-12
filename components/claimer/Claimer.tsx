import {MouseEvent, useRef, useState} from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

import RenderPreview from "../qr/renderers/RenderPreview";
import RenderDownloadPrint from "../qr/helperComponents/looseComps/RenderDownloadPrint";
import QRLynk from "../qr/helperComponents/looseComps/QRLynk";
import Claiming from "../qr/helperComponents/looseComps/Claiming";

const URL = 'https://a-qr.link/';

interface ClaimerProps {
  code: string;
}

export default function Claimer({ code }: ClaimerProps) {
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);
  const [current, setCurrent] = useState<string>(code);

  const handleClaim = (event: MouseEvent<HTMLButtonElement>) => {
    if (window && window.top && window.top !== window.top) {
      window.top.location.href = `${window.location.origin}/qr/type?address=${current}`;
    } else {
      setOpen(event.currentTarget);
    }
  }

  return (
    <Box sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    }}>
      <Paper sx={{ p: 2, mx: 'auto', width: { sm: '400px', xs: '100%' }}} elevation={3}>
        <Box sx={{ mb: 2, width: '100%', textAlign: 'center' }}>
          <QRLynk size="35px" />
          <Typography sx={{ position: 'relative', top: '-43px', right: '-67px', fontSize: '9px', fontWeight: 'bold'}}>TM</Typography>
        </Box>
        {current?.length > 0 && (<Paper elevation={2}>
          <RenderPreview override={current} width="100%" onlyPreview/>
        </Paper>)}
        <Claiming code={code} URL={URL} handleOk={handleClaim} buttonMessage="Claim" handleCurrent={setCurrent} />
      </Paper>
      {open && (
        <Popover
          open
          anchorEl={open}
          onClose={() => setOpen(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Box sx={{ p: 2 }}> {/* @ts-ignore */}
            <RenderDownloadPrint qrImageData={`${document.getElementById('qrCodeReferenceId').outerHTML}`}
                                 code={current} />
          </Box>
        </Popover>
      )}
    </Box>
  );
}
