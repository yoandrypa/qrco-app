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

import {areEquals, handleCopy} from "../../../helpers/generalFunctions";

import dynamic from "next/dynamic";
import { generateSecret} from "../../../../handlers/qrs";

const RenderCopiedNotification = dynamic(() => import ("../looseComps/RenderCopiedNotification"));
const WarningAmberIcon = dynamic(() => import ("@mui/icons-material/WarningAmber"));

interface NameSecretProps {
  handleValue: (prop: string) => (payload: any) => void;
  qrName?: string;
  secret?: string;
  hideSecret: boolean;
  errors: string[];
  openValidationErrors: () => void;
}

function RenderNameAndSecret({handleValue, qrName, secret, hideSecret, errors, openValidationErrors}: NameSecretProps) {
  const [handleSecret, setHandleSecret] = useState<boolean>(secret !== undefined);
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [copy, setCopy] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const disabled = !qrName?.trim()?.length;

  const generateSecretId = async () => {
    setLoading(true);
    handleValue('secret')(await generateSecret());
    setLoading(false);
  }

  const toggleSecret = () => {
    if (errors.length === 0) {
      if (!handleSecret) { generateSecretId(); }
      setHandleSecret((prev: boolean) => !prev);
    } else {
      openValidationErrors();
    }
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
            <Button sx={{height: '40px', mt: {xs: '4px', sm: 1}, ml: {xs: 0, sm: 1}}} variant="outlined" onClick={toggleSecret} startIcon={
              <KeyIcon sx={{color: 'error.light'}}/>
            } disabled={disabled}>{'Secret'}</Button>
          ) : (
            <Box sx={{ml: {xs: 0, sm: 1}, width: '100%'}}>
              <TextField
                label="Secret"
                size="small"
                fullWidth
                disabled={disabled}
                sx={{mb: '-5px'}}
                margin="dense"
                value={secret || ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{mr: 0}}>
                      <Typography>{url ? `h...${url.slice(-12)}` : '...'}</Typography>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end" sx={{mr: '-10px'}}>
                      <Tooltip title="Copy secret">
                        <IconButton disabled={disabled || url === undefined} sx={{mr: '-3px'}} size="small"
                          onClick={handleCopier}><ContentCopyIcon sx={{color: !disabled ? 'primary.main' : 'text.disabled'}}/></IconButton>
                      </Tooltip>
                      <Tooltip title="Generate another secret">
                        <IconButton disabled={disabled || url === undefined || loading} sx={{mr: '-3px'}} size="small"
                          onClick={generateSecretId}><ReplayIcon sx={{color: !disabled ? 'primary.main' : 'text.disabled'}}/></IconButton>
                      </Tooltip>
                      <Tooltip title="Clear secret">
                        <IconButton size="small" onClick={clearSecret}><ClearIcon color="error"/></IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
              />
              <Box sx={{color: 'text.disabled', display: 'flex', mt: '3px', mb: '-14px'}}>
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
  current.qrName === next.qrName && current.secret === next.secret && areEquals(current.errors, next.errors);

export default memo(RenderNameAndSecret, notIf);
