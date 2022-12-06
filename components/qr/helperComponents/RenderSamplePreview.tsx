import {MouseEvent, useState} from "react";
import RenderIframe from "../../RenderIframe";
import RenderCellPhoneShape from "./RenderCellPhoneShape";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import WebIcon from '@mui/icons-material/Web';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCodeIcon from '@mui/icons-material/QrCode';
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Typography from "@mui/material/Typography";
import {grey} from "@mui/material/colors";

import {NO_MICROSITE, REDEFINE_URL} from "../constants";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import RenderPreview from "../renderers/RenderPreview";
import Notifications from "../../notifications/Notifications";
import {cleanSelectionForMicrositeURL, getProperSampleUrl} from "../../../helpers/qr/helpers";
import {DataType} from "../types/types";

interface SamplePrevProps {
  style?: object;
  save?: Function;
  saveDisabled?: boolean;
  isDrawed?: boolean;
  data?: DataType;
  onlyQr?: boolean;
}

interface WithSelection extends SamplePrevProps {
  selected: string;
  code?: never;
}

interface WithSCode extends SamplePrevProps {
  selected?: never;
  code: string;
}

export default function RenderSamplePreview({onlyQr, data, selected, style, save, code, isDrawed, saveDisabled}: WithSelection | WithSCode) {
  const [prev, setPrev] = useState<string>(!onlyQr ? 'preview' : 'qr');
  const [copied, setCopied] = useState<boolean>(false);

  const handleToggle = (_: MouseEvent<HTMLElement>, newSel: string | null) => {
    if (newSel !== null) {
      setPrev(newSel);
    }
  }

  const URL = selected && REDEFINE_URL.includes(selected) ? getProperSampleUrl(selected) :
    `${process.env.REACT_MICROSITES_ROUTE}/${selected ? `sample/${cleanSelectionForMicrositeURL(selected)}` : code}`;

  return (
    <Box sx={style}>
      <Box sx={{background: grey[100], height: '48px', display: 'flex', justifyContent: 'space-between', ml: !isDrawed ? 0 : '5px', width: !isDrawed ? '100%' : 'calc(100% - 10px)'}}>
        <Typography sx={{mt: '14px', ml: '10px', whiteSpace: 'nowrap', maxWidth: '222px', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '13px'}}>{URL}</Typography>
        <Box sx={{display: 'flex'}}>
          <IconButton size="small" target="_blank" component="a" href={URL} sx={{height: '28px', width: '28px', mt: '9px'}}>
            <OpenInNewIcon fontSize="small"/>
          </IconButton>
          <IconButton size="small" sx={{height: '28px', width: '28px', mt: '9px'}} onClick={() => {
            try {
              navigator.clipboard.writeText(URL);
              setCopied(true);
            } catch {
              console.log('Copy failed');
            }
          }}>
            <ContentCopyIcon fontSize="small"/>
          </IconButton>
        </Box>
      </Box>
      <Box sx={{display: 'flex', justifyContent: 'space-between', my: '10px', ml: !isDrawed ? 0 : '10px', width: !isDrawed ? '100%' : 'calc(100% - 20px)'}}>
        <ToggleButtonGroup value={prev} exclusive onChange={handleToggle} sx={{width: '100%'}}>
          <ToggleButton value="preview" sx={{height: '23px', width: '60%'}} disabled={onlyQr}>
            <WebIcon fontSize="small" sx={{mr: '5px'}}/>
            <Typography>{'Preview'}</Typography>
          </ToggleButton>
          <ToggleButton value="qr" sx={{height: '23px', width: '40%'}}>
            <QrCodeIcon fontSize="small" sx={{mr: '5px'}}/>
            <Typography>{'QR'}</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
        {save && <Button variant="contained" sx={{height: '23px', ml: '5px'}} disabled={saveDisabled}>SAVE</Button>}
      </Box>
      <Box sx={{width: '280px', p: 1, pt: 0, ml: isDrawed ? '5px' : 0}}>
        {prev === 'preview' ? (
          <RenderCellPhoneShape width={270} height={550} offlineText="The selected card has no available sample">
            {selected && !NO_MICROSITE.includes(selected) ?
              <RenderIframe width="256px" height="536px" src={URL} data={data}/> : null}
          </RenderCellPhoneShape>) : <RenderPreview width={270} override={URL}/>}
      </Box>
      {copied && (
        <Notifications
          autoHideDuration={2500}
          message="Copied!"
          vertical="bottom"
          horizontal="center"
          severity="success"
          onClose={() => setCopied(false)}/>
      )}
    </Box>
  );
}
