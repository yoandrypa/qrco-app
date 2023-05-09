import {MouseEvent, useEffect, useRef, useState} from "react";

import ButtonGroup from "@mui/material/ButtonGroup";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import KeyIcon from "@mui/icons-material/Key";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MoreVertIcon from '@mui/icons-material/MoreVert';

import {iconColor, SecretHandlerProps, td} from "./helpers";
import {generateSecret} from "../../../../handlers/qrs";
import {handleCopy} from "../../../helpers/generalFunctions";

import dynamic from "next/dynamic";
import {MAIN_ORANGE} from "../../constants";

const ClearIcon = dynamic(() => import("@mui/icons-material/Clear"));
const ReplayIcon = dynamic(() => import("@mui/icons-material/Replay"));
const RenderCopiedNotification = dynamic(() => import("../looseComps/RenderCopiedNotification"));
const Popover = dynamic(() => import("@mui/material/Popover"));
const LockIconOpen = dynamic(() => import ("@mui/icons-material/LockOpenOutlined"));
const LockIcon = dynamic(() => import ("@mui/icons-material/LockOutlined"));
const EditIcon = dynamic(() => import ("@mui/icons-material/Edit"));
const EditOffIcon = dynamic(() => import ("@mui/icons-material/EditOffOutlined"));
const WarningAmberIcon = dynamic(() => import ("@mui/icons-material/WarningAmber"));
const ContentCopyIcon = dynamic(() => import ("@mui/icons-material/ContentCopy"));
const KeyOffIcon = dynamic(() => import ("@mui/icons-material/KeyOff"));
const Menu = dynamic(() => import("@mui/material/Menu"));
const MenuItem = dynamic(() => import("@mui/material/MenuItem"));
const Divider = dynamic(() => import("@mui/material/Divider"));

export default function RenderSecretHandler({secret, disabled, errors, openValidationErrors, handleValue, secretOps, handleSave}: SecretHandlerProps) {
  const [handleSecret, setHandleSecret] = useState<boolean>(secret !== undefined);
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [anchorHelp, setAnchorHelp] = useState<undefined | HTMLButtonElement>(undefined);
  const [anchorOpts, setAnchorOpts] = useState<undefined | HTMLElement>(undefined);

  const doneFirstLoad = useRef<boolean>(false);

  const generateSecretId = async () => {
    setLoading(true);
    handleValue('secret')(await generateSecret());
    setAnchorOpts(undefined);
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

  const handleEdit = () => {
    handleValue('secretOps')('edit');
    setAnchorOpts(undefined);
  }

  const handleLock = () => {
    handleValue('secretOps')('lock');
    setAnchorOpts(undefined);
  }

  const handleOpenHelp = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorHelp(event.currentTarget);
  };

  const handleOpenOpts = (event: MouseEvent<HTMLElement>) => {
    setAnchorOpts(event.currentTarget);
  };

  useEffect(() => {
    if (doneFirstLoad.current) { handleSave(); }
  }, [secretOps]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (doneFirstLoad.current) {
      handleSave();
    } else {
      doneFirstLoad.current = true;
    }
  }, [secret]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {!handleSecret ? (
        <ButtonGroup aria-label="outlined button group" sx={{mt: {xs: '4px', sm: 1}, ml: {xs: 0, sm: 1}}} variant="outlined">
          <Button sx={{height: '40px', width: '100%'}} onClick={toggleSecret}
                  startIcon={<KeyIcon sx={{color: 'error.light'}}/>} disabled={disabled}>{'Secret'}</Button>
          <Button sx={{height: '40px', width: '40px'}} onClick={handleOpenHelp}>
            <HelpOutlineIcon />
          </Button>
        </ButtonGroup>
      ) : (
        <Box sx={{ml: {xs: 0, sm: 1}, width: '100%'}}>
          <TextField
            label="Secret"
            size="small"
            fullWidth
            disabled={disabled}
            margin="dense"
            value={secret || ''}
            sx={{'& .MuiInputBase-root': { color: MAIN_ORANGE }}}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{mr: '-10px'}}>
                  <Tooltip title="Help">
                    <IconButton disabled={disabled || loading} sx={{mr: '-3px'}} size="small" onClick={handleOpenHelp}>
                      <HelpOutlineIcon sx={iconColor(disabled)}/>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Options">
                    <IconButton sx={{mr: '-3px'}} size="small" onClick={handleOpenOpts}>
                      <MoreVertIcon sx={iconColor(disabled)}/>
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              )
            }}
          />
        </Box>
      )}
      {anchorOpts && (
        <Menu
          id="menuButton"
          MenuListProps={{ 'aria-labelledby': 'menuButton' }}
          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
          transformOrigin={{vertical: 'top', horizontal: 'center'}}
          anchorEl={anchorOpts}
          open onClose={() => setAnchorOpts(undefined)}
        >
          <MenuItem key="editionEnabled" onClick={handleEdit}>
            {secretOps?.includes('e') ? <KeyOffIcon sx={iconColor(disabled)}/> : <KeyIcon sx={iconColor(disabled)}/>}
            <Typography sx={{ml: '5px'}}>{`Edit ${secretOps?.includes('e') ? 'dis' : 'en'}abled`}</Typography>
          </MenuItem>
          <MenuItem key="lockEnabler" onClick={handleLock}>
            {!secretOps?.includes('l') ? <LockIconOpen sx={iconColor(disabled)}/> : <LockIcon sx={iconColor(disabled)}/>}
            <Typography sx={{ml: '5px'}}>{`Page lock ${!secretOps?.includes('l') ? 'dis' : 'en'}abled`}</Typography>
          </MenuItem>
          <Divider />
          <MenuItem key="copyURL" onClick={() => {
            handleCopy(`${window.location.origin}/s/${secret}`, setCopied);
            setAnchorOpts(undefined);
          }}>
            <ContentCopyIcon color="primary"/>
            <Typography sx={{ml: '5px'}}>{'Copy secret edit URL'}</Typography>
          </MenuItem>
          <MenuItem key="copySecret" onClick={() => {
            handleCopy(secret, setCopied);
            setAnchorOpts(undefined);
          }}>
            <ContentCopyIcon color="primary"/>
            <Typography sx={{ml: '5px'}}>{'Copy secret code'}</Typography>
          </MenuItem>
          <Divider />
          <MenuItem key="generateOther" onClick={generateSecretId}>
            <ReplayIcon sx={iconColor(disabled)}/>
            <Typography sx={{ml: '5px'}}>{'Generate other secret'}</Typography>
          </MenuItem>
          <Divider />
          <MenuItem key="clearer" onClick={clearSecret}>
            <ClearIcon color="error"/>
            <Typography sx={{ml: '5px'}}>{'Remove secret'}</Typography>
          </MenuItem>
        </Menu>
      )}
      {anchorHelp && (
        <Popover
          open={true}
          anchorEl={anchorHelp}
          onClose={() => setAnchorHelp(undefined)}
          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
          transformOrigin={{vertical: 'top', horizontal: 'center'}}
        >
          <Box sx={{p: 2}}>
            {!handleSecret ? (
              <Box sx={{display: 'flex', mt: '-3px', mb: '-7px', width: '100%', justifyContent: 'end'}}>
                <WarningAmberIcon sx={{mr: '5px', mt: '-2px', color: 'warning.light'}}/>
                <Typography>Secret allows you to share the edition and/or the lock of this QRLynk page</Typography>
              </Box>
            ) : (
              <table cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr><td colSpan={2} style={{paddingBottom: '10px'}}>
                    <span style={{fontWeight: 'bold'}}>Secret allows you to share the edition and/or the lock of this QRLynk page</span>
                  </td></tr>
                  <tr>
                    <td style={td}>{secretOps?.includes('e') ? <EditOffIcon fontSize="small" color="primary"/> : <EditIcon fontSize="small" color="primary"/>}</td>
                    <td>Enables or disables the edition via secret URL. It means knowing<br/>the secret URL any user can use it to edit this QRLynk.</td>
                  </tr>
                  <tr>
                    <td style={td}>{!secretOps?.includes('l') ? <LockIconOpen fontSize="small" color="primary"/> : <LockIcon fontSize="small" color="primary"/>}</td>
                    <td>Enables or disables the lock for this QRLynk page. It means users<br/>need to enter the secret code to access to this QRLynk page.</td>
                  </tr>
                  <tr>
                    <td style={td}><ContentCopyIcon fontSize="small" color="primary" /></td>
                    <td>
                      Copy to the clipboard:
                      <ul style={{paddingLeft: '20px', marginTop: '3px', marginBottom: '1px'}}>
                        <li>The secret URL for editing this QRLynk page (if enabled).</li>
                        <li>The secret code for accessing this QRLynk page (if enabled).</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td style={td}><ReplayIcon fontSize="small" color="primary"/></td>
                    <td>Generates a new secret code (the previous one is no longer available).</td>
                  </tr>
                  <tr>
                    <td style={td}><ClearIcon fontSize="small" color="error"/></td>
                    <td>Removes the secret code (a different one can be generated in the future).</td>
                  </tr>
                </tbody>
              </table>
            ) }
          </Box>
        </Popover>
      )}
      {copied && <RenderCopiedNotification setCopied={() => setCopied(false)} />}
    </>
  );
}
