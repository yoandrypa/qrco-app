import {MouseEvent, Suspense, useCallback, useEffect, useRef, useState} from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import WebIcon from "@mui/icons-material/Web";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QrCodeIcon from "@mui/icons-material/QrCode";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Typography from "@mui/material/Typography";
import LinkIcon from "@mui/icons-material/Link";
import SaveIcon from "@mui/icons-material/Save";

import {NO_MICROSITE, ONLY_QR} from "../../constants";

import RenderPreview from "../../renderers/RenderPreview";
import Notifications from "../../../notifications/Notifications";
import {cleanSelectionForMicrositeURL} from "../../../../helpers/qr/helpers";
import {DataType} from "../../types/types";
import RenderCellPhoneShape from "../RenderCellPhoneShape";

import dynamic from "next/dynamic";
import PleaseWait from "../../../PleaseWait";
import {debounce} from "@mui/material";

const RenderIframe = dynamic(() => import('../../../RenderIframe'), {suspense: true});

interface SamplePrevProps {
  style?: object;
  save?: () => void;
  saveDisabled?: boolean;
  isDrawed?: boolean;
  data?: DataType;
  onlyQr?: boolean;
  qrOptions?: any;
  isDynamic: boolean;
  step: number;
}
interface WithSelection extends SamplePrevProps { selected: string; code?: never; }
interface WithSCode extends SamplePrevProps { selected?: never; code: string; }

const clearUrl = (url: string): string => url.slice(url.indexOf('//') + 2);

const RenderSamplePreview = ({step, isDynamic, onlyQr, data, selected, style, save, code, isDrawed, saveDisabled, qrOptions}: WithSelection | WithSCode) => {
  const [prev, setPrev] = useState<string>(!onlyQr ? 'preview' : 'qr');
  const [copied, setCopied] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const forceHide = useRef<boolean>(false);

  const handleToggle = (_: MouseEvent<HTMLElement>, newSel: string | null) => {
    if (newSel !== null) {
      setPrev(newSel);
    }
  }

  const URL = isDynamic ? (selected ? cleanSelectionForMicrositeURL(selected, isDynamic) : (`${process.env.REACT_MICROSITES_ROUTE}/${code}`)) : selected;

  const repaint = useCallback(debounce(() => { // eslint-disable-line react-hooks/exhaustive-deps
    setUpdating(true);
  }, 500), []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!updating && step === 0) {
      setUpdating(true);
    } else if (step === 1 && !isDynamic) {
      forceHide.current = true;
      repaint();
    }
  }, [URL, qrOptions?.data]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (updating) {
      if (step === 0) {
        setTimeout(() => {
          setUpdating(false);
        }, 100);
      } else {
        forceHide.current = false;
        setUpdating(false);
      }
    }
  }, [updating]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selected) {
      setPrev((!isDynamic || ONLY_QR.includes(selected)) ? 'qr' : 'preview');
    }
  }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={style}>
      {!onlyQr ? (
        <Box sx={{
          height: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          ml: !isDrawed ? 0 : '5px',
          width: !isDrawed ? '100%' : 'calc(100% - 10px)'
        }}>
          <Box sx={{display: 'flex'}}>
            <LinkIcon sx={{color: theme => theme.palette.primary.dark, mt: '12px', mr: '-7px'}}/>
            <Typography sx={{
              mt: '14px',
              ml: '10px',
              whiteSpace: 'nowrap',
              maxWidth: '222px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '13px'
            }}>{clearUrl(URL || '')}</Typography>
          </Box>
          <Box sx={{display: 'flex'}}>
            <IconButton size="small" target="_blank" component="a" href={URL} sx={{height: '28px', width: '28px', mt: '9px'}}>
              <OpenInNewIcon fontSize="small"/>
            </IconButton>
            <IconButton size="small" sx={{height: '28px', width: '28px', mt: '9px'}} onClick={() => {
              try {
                navigator.clipboard.writeText(URL || '');
                setCopied(true);
              } catch {
                console.log('Copy failed');
              }
            }}>
              <ContentCopyIcon fontSize="small"/>
            </IconButton>
          </Box>
        </Box>
      ) : <Box sx={{mt: step === 0 ? '38px' : '20px'}}/>}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', my: '8px', ml: !isDrawed ? 0 : '10px',
        width: !isDrawed ? '100%' : 'calc(100% - 20px)'
      }}>
        <ToggleButtonGroup value={prev} exclusive onChange={handleToggle} sx={{width: '100%'}}>
          <ToggleButton value="preview" sx={{height: '23px', width: '50%'}} disabled={onlyQr}>
            <WebIcon fontSize="small" sx={{mr: '5px'}}/>
            <Typography>{'Page'}</Typography>
          </ToggleButton>
          <ToggleButton value="qr" sx={{height: '23px', width: '50%'}}>
            <QrCodeIcon fontSize="small" sx={{mr: '5px'}}/>
            <Typography>{'QR'}</Typography>
          </ToggleButton>
        </ToggleButtonGroup>
        {save && (
          <Button variant="contained" onClick={save} sx={{height: '24px', ml: '5px'}} disabled={saveDisabled}>
            <SaveIcon fontSize="small" sx={{mb: '1px'}} />
          </Button>
        )}
      </Box>
      <Box sx={{width: '270px', p: 1, pt: 0, ml: isDrawed ? '5px' : 0}}>
        {prev === 'preview' ? (
          <RenderCellPhoneShape width={270} height={550} offlineText="The selected card has no available sample">
            {code || (selected && !NO_MICROSITE.includes(selected)) ? (
              <Suspense fallback={<PleaseWait />}>
                <RenderIframe src={!code ? cleanSelectionForMicrositeURL(selected || '', isDynamic, true) : `${process.env.REACT_MICROSITES_ROUTE}/sample/empty`}
                              selected={selected} width="256px" height="536px"  data={data}/>
              </Suspense>
            ) : null}
          </RenderCellPhoneShape>
        ) : (!updating && !forceHide.current ? (
          <RenderPreview override={!qrOptions ? cleanSelectionForMicrositeURL(selected || '', isDynamic, true) : undefined}
                         onlyPreview={step === 0 && !isDynamic} width={270} qrDesign={qrOptions}  />
        ) : (
          <Box sx={{width: '100%', textAlign: 'center', pd: 3}}>
            <Typography>{'Preparing QR preview'}</Typography>
            <Typography sx={{color: theme => theme.palette.text.disabled}}>{'Please wait...'}</Typography>
          </Box>
        ))}
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

export default RenderSamplePreview;
