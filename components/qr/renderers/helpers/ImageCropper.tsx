import {useEffect, useMemo, useRef, useState} from 'react';
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import Stack from '@mui/material/Stack';
import Slider from "@mui/material/Slider";
import CropIcon from '@mui/icons-material/Crop';
import PhotoSizeSelectLargeIcon from '@mui/icons-material/PhotoSizeSelectLarge';
import useMediaQuery from "@mui/material/useMediaQuery";

import Notifications from "../../../notifications/Notifications";

import {checkForAlpha, compressImage, getUuid} from "../../../../helpers/qr/helpers";

interface ImageCropperProps {
  handleClose: () => void;
  handleAccept: (newFile: File, kind: string) => void;
  file: File;
  message: string;
  kind: string;
  shortMessage?: boolean;
}

export default function ImageCropper({handleAccept, handleClose, file, kind, message, shortMessage}: ImageCropperProps) {
  const [drag, setDrag] = useState<boolean>(false);
  const [zoom, setZoom] = useState<{max: number, min: number, selected: number}>({max: 100, min: 50, selected: 100});
  const [alphaWarning, setAlphaWarning] = useState<boolean>(false);

  const isWide = useMediaQuery("(min-width:570px)", { noSsr: true });

  const mainDims = useRef<{width: number, height: number}>(
    kind === 'backgndImg' ? {width: 460, height: 200} :
      (kind === 'micrositeBackImage' ? {width: 350, height: 650} : {width: 200, height: 200})
  );
  const dimensions = useRef<{width: number, height: number}>({width: 0, height: 0});
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const image = useRef<HTMLImageElement>();
  const pos = useRef<{x: number, y: number}>({x: 0, y: 0});
  const initialTouch = useRef<{x: number, y: number}>({x: 0, y: 0});
  const initial = useRef<boolean>(true);

  const get = (axis: string, event?: any): number => {
    let result = 0;
    if (event && event.touches) {
      const touches = event.touches[0];
      if (axis === 'x') {
        const x = touches.clientX;
        if (initialTouch.current.x > x) {
          result = -1;
        } else if (initialTouch.current.x < x) {
          result = 1;
        }
        initialTouch.current.x = x;
      } else {
        const y = touches.clientY;
        if (initialTouch.current.y > y) {
          result = -1;
        } else if (initialTouch.current.y < y) {
          result = 1;
        }
        initialTouch.current.y = y;
      }
    }
    return result;
  }

  const updateCanvas = (event?: any) => {
    if (drag || event === undefined) {
      const canvas = canvasRef.current;

      const movX = event?.movementX || get('x', event);
      const movY = event?.movementY || get('y', event);

      const posX = pos.current.x + movX;
      const posY = pos.current.y + movY;

      const dimensionW = Math.ceil(dimensions.current.width * zoom.selected / 100);
      const dimensionH = Math.ceil(dimensions.current.height * zoom.selected / 100);

      if (posX <= 0 && posY <= 0 && posX >= (mainDims.current.width - dimensionW) && posY >= (mainDims.current.height - dimensionH)) {
        pos.current = {x: posX, y: posY};

        const context = canvas?.getContext('2d', { alpha: false, desynchronized: true });
        if (context) {
          context.imageSmoothingQuality = 'high';
          context.imageSmoothingEnabled = true; // @ts-ignore
          context.drawImage(image.current, posX, posY, dimensionW, dimensionH);
        }
      }
    }
  };

  const touchStart = (event: any) => {
    const posic = event.touches[0];
    initialTouch.current = {x: posic.clientX, y: posic.clientY};
    setDrag(true)
  };

  const beforeSend = () => {
    const { type, name } = file;

    let canvas;
    if (isWide || kind !== 'backgndImg') {
      canvas = canvasRef.current;
    } else {
      canvas = document.createElement('canvas');
      canvas.setAttribute('width', '460px');
      canvas.setAttribute('height', '200px');
      const context = canvas.getContext('2d', { alpha: false, desynchronized: true });
      if (context) {
        const dimWidth = Math.ceil(dimensions.current.width * zoom.selected / 100);
        context.imageSmoothingEnabled = true; // @ts-ignore
        context.drawImage(image.current, dimWidth === 460 ? 0 : pos.current.x, pos.current.y, dimWidth,
          Math.ceil(dimensions.current.height * zoom.selected / 100));
      }
    }
    if (canvas) {
      canvas.toBlob(blob => { // @ts-ignore
        const newFile = new File([blob], `${getUuid()}${name.slice(name.indexOf('.'))}`, {type});

        if (newFile.size <= 153600) {
          handleAccept(newFile, kind);
        } else {
          let quality = 0.4;
          let resizing = 0.35;
          if (newFile.size < 1048576) {
            quality = 0.7;
            resizing = 0.7;
          } else if (newFile.size < 5242880) {
            quality = 0.5;
            resizing = 0.5;
          }
          compressImage(newFile, (newFileItem: File) => handleAccept(newFileItem, kind), resizing, quality);
        }
      }, type, 0.7);
    }
  };

  const handleChange = (event: Event, newValue: number | number[]) => {
    setZoom({...zoom, selected: newValue as number});
  };

  const release = () => {
    if (drag) {
      initialTouch.current = {x: 0, y: 0};
      setDrag(false);
    }
  }

  const getWidth = useMemo(() => kind === 'backgndImg' ? (isWide ? 460 : 250) :
    (kind === 'micrositeBackImage' ? (isWide ? 350 : 280) : 200), [isWide]); // eslint-disable-line react-hooks/exhaustive-deps

  const getHeight = useMemo(() => kind === 'micrositeBackImage' ? (isWide ? 650 : 540) : mainDims.current.height, [isWide]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    mainDims.current.width = getWidth;
    mainDims.current.height = getHeight;
    if (!initial.current) {
      updateCanvas();
    }
  }, [isWide]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!initial.current) {
      pos.current = {x: 0, y: 0};
      updateCanvas();
    }
  }, [zoom.selected]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    const dims = kind === 'backgndImg' ? {width: 460, height: 200} :
      (kind === 'micrositeBackImage' ? {width: 350, height: 650} : {width: 200, height: 200});

    img.onload = async () => {
      let height = img.height;
      let width = img.width;
      let percent = 100;

      const result = await checkForAlpha(file);

      if (result?.hasAlpha) {
        setAlphaWarning(true);
      }

      const greaterWidth = () => {
        width = dims.width;
        height = width * (width / height);
        percent = 1;
      }

      const greaterHeight = () => {
        height = dims.height;
        width = height * (width / height);
        percent = 1;
      }

      const handleZoom = () => {
        setZoom({...zoom, max: 150, min: 100});
      };

      if (dims.width > width && dims.height > height) {
        if (width > height) {
          greaterWidth();
        } else {
          greaterHeight();
        }
        handleZoom();
      } else if (dims.width > width && dims.height <= height) {
        greaterWidth();
        handleZoom();
      } else if (dims.width <= width && dims.height > height) {
        greaterHeight();
        handleZoom();
      } else {
        let max:number;
        let h = height;
        let w = width;

        if (h > w) {
          w = dims.width;
          h = Math.ceil(h * w / width) + 1;

          if (h < dims.height) {
            const hh = dims.height;
            w = Math.ceil(hh * w / h) + 1;
            h = hh;
            max = Math.ceil(w * 100 / width) + 99;
          } else {
            max = Math.ceil(h * 100 / height) + 99;
          }
        } else {
          h = dims.height;
          w = Math.ceil(h * w / height) + 1;

          if (w < dims.width) {
            const ww = dims.width;
            h = Math.ceil(h * ww / w) + 1;
            w = ww;
            max = Math.ceil(h * 100 / height) + 99;
           } else {
            max = Math.ceil(w * 100 / width) + 99;
          }
        }

        height = h;
        width = w;

        setZoom({...zoom, min: 100, max });
      }

      dimensions.current = {height, width};
      image.current = img;
      updateCanvas();
    }

    initial.current = false;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog onClose={handleClose} open={true}>
      <DialogContent dividers>
        <Box sx={{ p: '1px' }}>
          <Box sx={{ display: 'flex', mb: '10px' }}>
            <PhotoSizeSelectLargeIcon sx={{ color: theme => theme.palette.info.dark, mr: '5px' }} />
            <Typography sx={{ fontWeight: 'bold' }}>{`Adjust the ${message} image${!shortMessage ? ' for the page' : ''}`}</Typography>
          </Box>
          <Box sx={{ width: '100%', textAlign: 'center' }}>
            <canvas
              width={getWidth}
              height={getHeight}
              onMouseDown={() => setDrag(true)}
              onTouchStart={touchStart}
              onMouseUp={release}
              onMouseOut={release}
              onTouchEnd={release}
              onTouchCancel={release}
              onMouseMove={updateCanvas}
              onTouchMove={updateCanvas}
              style={{ border: 'solid 1px rgba(0, 0, 0, 0.5)', cursor: drag ? 'grabbing' : 'grab' }}
              ref={canvasRef} />
          </Box>
        </Box>
        <Typography sx={{ mt: 1, fontSize: 'small' }}>{'Zoom'}</Typography>
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          <ZoomOutIcon fontSize="small" color="primary" />
          <Slider aria-label="Zoom" max={zoom.max} min={zoom.min} value={zoom.selected} onChange={handleChange} />
          <ZoomInIcon fontSize="large" color="primary" />
        </Stack>
        {!shortMessage && (<Box sx={{mt: 1, display: 'flex', color: theme => theme.palette.text.disabled, width: '100%', justifyContent: 'center'}}>
          <Typography sx={{fontSize: 'small', fontWeight: 'bold', mr: '5px'}}>{'Note:'}</Typography>
          <Typography sx={{fontSize: 'small'}}>{'Image might have a tiny difference on microsite.'}</Typography>
        </Box>)}
      </DialogContent>
      <DialogActions sx={{p: 2}}>
        <Button startIcon={<CropIcon />} variant="outlined" onClick={beforeSend}>{'Done'}</Button>
        <Button variant="outlined" onClick={handleClose}>{'Close'}</Button>
      </DialogActions>
      {alphaWarning && (
        <Notifications
          onClose={() => setAlphaWarning(false)}
          title="The selected image contains alpha channels."
          autoHideDuration={7500}
          severity={'warning'}
          vertical="bottom"
          showProgress
          message="This could cause the image to not render properly. Be advised."

        />
      )}
    </Dialog>
  );
}
