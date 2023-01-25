import {ChangeEvent, KeyboardEvent, MouseEvent, useRef, useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {styled} from "@mui/material/styles";

import Link from "next/link";

import {IS_DEV_ENV, MAIN_ORANGE} from "../qr/constants";
import RenderPreview from "../qr/renderers/RenderPreview";
import RenderDownloadPrint from "../qr/helperComponents/looseComps/RenderDownloadPrint";
import {useRouter} from "next/router";

const Typo = styled(Typography)(({bold}: {bold?: boolean}) => ({
  display: 'inline',
  fontWeight: bold ? 'bold' : 'unset',
  fontSize: '20px'
}));

const URL = 'https://a-qr.link/';

export default function Claimer({code}: {code: string}) {
  const [custom, setCustom] = useState<string>(code || '');
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);

  const lynk = useRef<string>(`${URL}${custom}`);

  const router = useRouter();

  if (!IS_DEV_ENV) {
    router.push('/', '/');
  }

  const handleCustom = (event: ChangeEvent<HTMLInputElement>) => {
    const {value}: {value: string} = event.target;
    lynk.current = `${URL}${value}`;
    setCustom(value);
  }

  const handleClaim = (event: MouseEvent<HTMLButtonElement>) => {
    setOpen(event.currentTarget);
  }

  const renderOptions = () => {
    const element = document.getElementById('qrCodeReferenceId');

    return (
      <Box sx={{p: 2}}> {/* @ts-ignore */}
        <RenderDownloadPrint qrImageData={`${element.outerHTML}`} code={custom} />
      </Box>
    );
  }

  const isError = !custom.trim().length;

  return (
    <Box sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    }}>
      <Paper sx={{
        p: 2,
        mx: 'auto',
        width: {sm: '400px', xs: '100%'}
      }} elevation={3}>
        <Box sx={{mb: 2, width: '100%', textAlign: 'center'}}>
          <Typo sx={{mr: '5px'}}>CLAIM YOUR REUSABLE</Typo>
          <Typo bold>QR</Typo>
          <Typo sx={{color: MAIN_ORANGE}} bold>Lynk</Typo>
        </Box>
        <Paper elevation={2}>
          <RenderPreview override={lynk.current} width="100%" onlyPreview />
        </Paper>

        <Box sx={{mt: '10px'}}>
          <Box sx={{width: '100%', textAlign: 'center'}}>
            <Link href={lynk.current} passHref>
              <Typography color="primary">{lynk.current}</Typography>
            </Link>
          </Box>
          <Box sx={{display: 'flex', mt: '-5px', height: '85px'}}>
            <TextField
              placeholder="Claim your custom name"
              onKeyDown={(evt: KeyboardEvent<HTMLInputElement>) => !/^[a-zA-Z0-9_]+$/.test(evt.key) && evt.preventDefault()}
              label=""
              autoFocus
              size="small"
              fullWidth
              margin="dense"
              value={custom}
              error={isError}
              helperText={isError ? 'Make sure you entered a code' : ''}
              sx={{'& fieldset': {borderRadius: '5px 0 0 5px'}}}
              onChange={handleCustom} />
            <Button
              onClick={handleClaim}
              variant="outlined" sx={{height: '40px', mt: '8px', borderRadius: '0 5px 5px 0'}}
              disabled={isError}>
              <Typography sx={{mx: '5px'}}>{'Claim'}</Typography>
            </Button>
          </Box>
        </Box>
      </Paper>

      {open && (
        <Popover
          open
          anchorEl={open}
          onClose={() => setOpen(null)}
          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
          transformOrigin={{vertical: 'top', horizontal: 'center'}}
        >
          {renderOptions()}
        </Popover>
      )}
    </Box>
  );
}
