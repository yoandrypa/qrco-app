import {memo, useEffect, useState} from "react";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import KeyIcon from '@mui/icons-material/Key';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import ReplayIcon from "@mui/icons-material/Replay";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";

import {customAlphabet} from "nanoid";
import {handleCopy} from "../../../helpers/generalFunctions";

import dynamic from "next/dynamic";

const RenderCopiedNotification = dynamic(() => import ("../looseComps/RenderCopiedNotification"));
const WarningAmberIcon = dynamic(() => import ("@mui/icons-material/WarningAmber"));

interface NameSecretProps {
  handleValue: (prop: string) => (payload: any) => void;
  qrName?: string;
  secret?: string;
  hideSecret: boolean;
}

const genSecretId = () => {
  const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_", 10);
  return nanoid();
}

function RenderNameAndSecret({handleValue, qrName, secret, hideSecret}: NameSecretProps) {
  const [handleSecret, setHandleSecret] = useState<boolean>(secret !== undefined);
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [copy, setCopy] = useState<boolean>(false);

  const generateSecretId = () => {
    handleValue('secret')(genSecretId());
  }

  const toggleSecret = () => {
    if (!handleSecret) {
      generateSecretId();
    }
    setHandleSecret((prev: boolean) => !prev);
  }

  const clearSecret = () => {
    handleValue('secret')(undefined);
    setHandleSecret(false);
  }

  const handleCopier = () => {
    handleCopy(`${url}${secret}`, setCopy);
  }

  useEffect(() => {
    setUrl(`${window.location.origin}/s/`);
  }, []);

  return (
    <>
      <Box sx={{display: 'flex', flexDirection: {sm: 'row', xs: 'column'}}}>
        <TextField
          label="QRLynk name"
          required
          size="small"
          fullWidth
          margin="dense"
          value={qrName || ''}
          onChange={handleValue('qrName')}
          InputProps={{
            endAdornment: (
              !Boolean(qrName?.trim().length) ? (<InputAdornment position="end">
                <Typography color="error">{'REQUIRED'}</Typography>
              </InputAdornment>) : null
            )
          }}
        />
        {!hideSecret && (<>
          {!handleSecret ? (
              <Button sx={{height: '40px', mt: {xs: '4px', sm: 1}, ml: {xs: 0, sm: 1}}} variant="outlined"
                      onClick={toggleSecret} startIcon={<KeyIcon/>}>{'Secret'}</Button>
          ) : (
            <Box sx={{ml: {xs: 0, sm: 1}, width: '100%'}}>
              <TextField
                label="Secret"
                size="small"
                fullWidth
                sx={{mb: '-5px'}}
                margin="dense"
                value={secret || ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{mr: 0}}><Typography>{url || '...'}</Typography></InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end" sx={{mr: '-10px'}}>
                      <Tooltip title="Copy secret">
                        <IconButton disabled={url === undefined} sx={{mr: '-3px'}}
                          size="small" onClick={handleCopier}><ContentCopyIcon color="primary"/></IconButton>
                      </Tooltip>
                      <Tooltip title="Generate another secret">
                        <IconButton disabled={url === undefined} sx={{mr: '-3px'}}
                          size="small" onClick={generateSecretId}><ReplayIcon color="primary"/></IconButton>
                      </Tooltip>
                      <Tooltip title="Clear secret">
                        <IconButton size="small" onClick={clearSecret}><ClearIcon color="error"/></IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
              />
              <Box sx={{color: 'text.disabled', display: 'flex', mt: '3px'}}>
                <WarningAmberIcon sx={{fontSize: '14px', mt: '2px'}}/>
                <Typography variant="caption">Secret allows you to share the edition of this QRLynk</Typography>
              </Box>
            </Box>
          )}
        </>)}
      </Box>
      {copy && <RenderCopiedNotification setCopied={() => setCopy(false)} />}
    </>
  );
}

const notIf = (current: NameSecretProps, next: NameSecretProps) =>
  current.qrName === next.qrName && current.secret === next.secret;

export default memo(RenderNameAndSecret, notIf);
