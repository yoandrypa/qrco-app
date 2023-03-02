import React, {ChangeEvent, KeyboardEvent, MouseEvent, useEffect, useRef, useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import {styled} from "@mui/material/styles";

import {MAIN_ORANGE} from "../qr/constants";
import RenderPreview from "../qr/renderers/RenderPreview";
import RenderDownloadPrint from "../qr/helperComponents/looseComps/RenderDownloadPrint";
import {findByAddress} from "../../handlers/links";

const Typo = styled(Typography)(({ bold }: { bold?: boolean }) => ({
  display: 'inline',
  fontWeight: bold ? 'bold' : 'unset',
  fontSize: '20px'
}));

const URL = 'https://a-qr.link/';

interface ClaimerProps {
  code: string;
}

export default function Claimer({ code }: ClaimerProps) {
  const [custom, setCustom] = useState<string>(code || '');
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);
  const [available, setAvailable] = useState<boolean>(true);
  const [checking, setChecking] = useState<boolean>(true);

  const lynk = useRef<string>(`${URL}${custom}`);

  const handleCustom = (event: ChangeEvent<HTMLInputElement>) => {
    const { value }: { value: string } = event.target;
    lynk.current = `${URL}${value}`;
    setCustom(value);
  }

  const handleClaim = (event: MouseEvent<HTMLButtonElement>) => {
    if (window && window.top) {
      window.top.location.href = `${window.location.origin}/qr/type?address=${custom}`;
    }
  }

  const isError = !custom.trim().length;

  useEffect(() => {
    setChecking(true);
    const checkData = setTimeout(async () => { //this implements a debounce for checking the availability
      if (!isError) {
        setChecking(true);
        const links = await findByAddress({ address: { eq: custom } });
        setAvailable(links.length === 0);
        setChecking(false);
      }
    }, 1000);
    return () => clearTimeout(checkData);
  }, [custom]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    }}>
      <Paper sx={{ p: 2, mx: 'auto', width: { sm: '400px', xs: '100%' }}} elevation={3}>
        <Box sx={{ mb: 2, width: '100%', textAlign: 'center' }}>
          <Typo bold>QR</Typo>
          <Typo sx={{ color: MAIN_ORANGE }} bold>Lynk</Typo>
        </Box>
        <Paper elevation={2}>
          <RenderPreview override={lynk.current} width="100%" onlyPreview />
        </Paper>

        <Box sx={{ mt: '10px' }}>
          <Box sx={{ display: 'flex', mt: '-5px', height: '85px' }}>
            <TextField
              onKeyDown={(evt: KeyboardEvent<HTMLInputElement>) => !/^[a-zA-Z0-9_]+$/.test(evt.key) && evt.preventDefault()}
              label=""
              autoFocus
              size="small"
              fullWidth
              margin="dense"
              value={custom}
              error={isError || !available}
              helperText={isError ? 'Make sure you entered a code' : (available ? '' : 'The entered code is already taken')}
              sx={{ '& fieldset': { borderRadius: '5px 0 0 5px' } }}
              onChange={handleCustom}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ mr: 0 }}>
                    <Typography sx={{ mt: '2px' }}>{URL.slice(8)}</Typography>
                  </InputAdornment>
                )
              }} />
            <Button
              onClick={handleClaim}
              variant="outlined" sx={{ height: '40px', mt: '8px', borderRadius: '0 5px 5px 0' }}
              disabled={isError || !available || checking}>
              <Typography sx={{ mx: '5px' }}>{'Claim'}</Typography>
            </Button>
          </Box>
        </Box>
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
                                 code={custom} />
          </Box>
        </Popover>
      )}
    </Box>
  );
}
