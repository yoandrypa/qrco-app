import { MouseEvent, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import Divider from "@mui/material/Divider";
import { debounce } from "@mui/material";

import { NO_MICROSITE, ONLY_QR } from "../../constants";
import RenderPreview from "../../renderers/RenderPreview";
import RenderCellPhoneShape from "../RenderCellPhoneShape";
import { cleanSelectionForMicrositeURL, qrNameDisplayer } from "../../../../helpers/qr/helpers";
import { DataType } from "../../types/types";

import dynamic from "next/dynamic";

const PleaseWait = dynamic(() => import("../../../PleaseWait"));
const Popover = dynamic(() => import("@mui/material/Popover"));
const RenderIframe = dynamic(() => import('../../../RenderIframe'), { suspense: true });
const Notifications = dynamic(() => import("../../../notifications/Notifications"));
const RenderIcon = dynamic(() => import("./RenderIcon"));

interface SamplePrevProps {
  style?: object;
  save?: () => void;
  saveDisabled?: boolean;
  isDrawed?: boolean;
  data?: DataType;
  onlyQr?: boolean;
  qrOptions?: any;
  isDynamic: boolean;
  shareLink?: string;
  backImg?: File | string;
  mainImg?: File | string;
  step: number;
  showSampleMessage?: boolean;
}

interface WithSelection extends SamplePrevProps {
  selected: string;
  code?: never;
}

interface WithSCode extends SamplePrevProps {
  selected?: never;
  code: string;
}

const clearUrl = (url: string): string => url.slice(url.indexOf('//') + 2);

const RenderSamplePreview = (
  {
    step, isDynamic, onlyQr, data, selected, style, save, code, isDrawed, saveDisabled,
    qrOptions, backImg, mainImg, shareLink, showSampleMessage
  }: WithSelection | WithSCode
) => {
  const [prev, setPrev] = useState<string>(!onlyQr ? 'preview' : 'qr');
  const [copied, setCopied] = useState<boolean>(false);
  const [open, setOpen] = useState<HTMLButtonElement | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const forceHide = useRef<boolean>(false);
  const microSitesBaseUrl = process.env.MICRO_SITES_BASE_URL;

  const handleToggle = (_: MouseEvent<HTMLElement>, newSel: string | null) => {
    if (newSel !== null) {
      setPrev(newSel);
    }
  }

  const URL = useMemo(() => {
      if (!isDynamic) return qrNameDisplayer(selected || '', false);
      if (selected) return cleanSelectionForMicrositeURL(selected, isDynamic);
      return `${microSitesBaseUrl}/${code}`;
    }, [isDynamic, selected, code] // eslint-disable-line react-hooks/exhaustive-deps
  );

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
    <Box sx={{
      ...style,
      border: !isDrawed ? 'solid 1px rgba(0,0,0,0.1)' : 'unset',
      borderRadius: !isDrawed ? '5px' : 0,
      height: 'fit-content',
      pb: '5px',
      pr: '15px'
    }}>
      <Box sx={{
        width: '100%',
        ml: '10px',
        mt: !isDrawed ? '-5px' : 0,
        mb: !isDrawed ? '13px' : 0
      }}>
        <Box sx={{
          height: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          ml: !isDrawed ? 0 : '5px',
          width: !isDrawed ? '100%' : 'calc(100% - 10px)'
        }}>
          <Box sx={{ display: 'flex' }}>
            {!onlyQr ? <LinkIcon sx={{ color: theme => theme.palette.primary.dark, mt: '12px', mr: '-7px' }} /> : (
              <Box sx={{ mt: '12px', mr: '5px' }}>
                <RenderIcon icon={selected || ''} enabled />
              </Box>
            )}
            <Typography sx={{
              mt: '14px',
              ml: !onlyQr ? '10px' : 0,
              whiteSpace: 'nowrap',
              width: !onlyQr ? '177px' : '210px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '13px'
            }}>{!onlyQr ? clearUrl(URL || '') : URL || qrOptions?.data}</Typography>
            {!onlyQr ? (
              <>
                <IconButton size="small" target="_blank" component="a" href={URL} sx={{ height: '28px', width: '28px', mt: '9px' }}>
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" sx={{ height: '28px', width: '28px', mt: '9px' }} onClick={() => {
                  try {
                    navigator.clipboard.writeText(URL || '');
                    setCopied(true);
                  } catch {
                    console.log('Copy failed');
                  }
                }}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </>
            ) : (
              <IconButton size="small" sx={{ height: '28px', width: '28px', mt: '9px' }} onClick={
                (e: MouseEvent<HTMLButtonElement>) => setOpen(e.currentTarget)}>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
        <Divider sx={{ my: 2, mr: '13px' }} />
        <Box sx={{
          display: 'flex', justifyContent: 'space-between', my: '8px', ml: !isDrawed ? 0 : '10px',
          width: !isDrawed ? '100%' : 'calc(100% - 20px)'
        }}>
          <ToggleButtonGroup value={prev} exclusive onChange={handleToggle} sx={{ width: '100%' }}>
            <ToggleButton value="preview" sx={{ height: '23px', width: '40px' }} disabled={onlyQr}>
              <WebIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="qr" sx={{ height: '23px', width: '40px' }}>
              <QrCodeIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
          {!onlyQr && save && (
            <Button variant="outlined" onClick={save} sx={{ height: '24px', ml: '5px' }} disabled={saveDisabled}>
              <SaveIcon fontSize="small" sx={{ mb: '1px' }} />
              <Typography>{'Save'}</Typography>
            </Button>
          )}
          {showSampleMessage && (
            <Typography sx={{ mr: '10px', color: theme => theme.palette.text.disabled, fontSize: 'small' }}>SAMPLE</Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ width: '270px', p: 1, pt: 0, ml: isDrawed ? '5px' : 0 }}>
        {prev === 'preview' ? (
          <RenderCellPhoneShape width={270} height={550} offlineText="The selected card has no available sample">
            {code || (selected && !NO_MICROSITE.includes(selected)) ? (
              <Suspense fallback={<PleaseWait />}>
                <RenderIframe
                  src={!code ? cleanSelectionForMicrositeURL(selected || '', isDynamic, true) : `${microSitesBaseUrl}/sample/empty`}
                  selected={selected} width="256px" height="536px" data={data} backImg={backImg} mainImg={mainImg}
                  shareLink={shareLink} />
              </Suspense>
            ) : null}
          </RenderCellPhoneShape>
        ) : (!updating && !forceHide.current ? (
          <RenderPreview
            override={!qrOptions ? cleanSelectionForMicrositeURL(selected || '', isDynamic, true) : undefined}
            onlyPreview={step === 0 && !isDynamic} width={270} qrDesign={qrOptions} />
        ) : (
          <Box sx={{ width: '100%', textAlign: 'center', pd: 3 }}>
            <Typography>{'Preparing QR preview'}</Typography>
            <Typography sx={{ color: theme => theme.palette.text.disabled }}>{'Please wait...'}</Typography>
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
          onClose={() => setCopied(false)} />
      )}
      {open && (
        <Popover
          open
          anchorEl={open}
          onClose={() => setOpen(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Typography whiteSpace="pre" sx={{ p: 1 }}>
            {qrOptions?.data || URL}
          </Typography>
        </Popover>
      )}
    </Box>
  );
}

export default RenderSamplePreview;
