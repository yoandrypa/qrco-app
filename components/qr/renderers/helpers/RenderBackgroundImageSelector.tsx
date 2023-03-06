import {useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

import dynamic from "next/dynamic";
import useMediaQuery from "@mui/material/useMediaQuery";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

const RenderImgPreview = dynamic(() => import("./RenderImgPreview"));
const RenderImagePicker = dynamic(() => import("./RenderImagePicker"));
const ImageCropper = dynamic(() => import("./ImageCropper"));
const Notifications = dynamic(() => import("../../../notifications/Notifications"));

interface BackImgProps {
  micrositesImg?: File | string;
  opacity: number;
  handleValue: Function;
}

interface ErrorProps {
  msg: string;
  title: string;
  warning?: boolean;
}

export default function RenderBackgroundImageSelector({handleValue, micrositesImg, opacity}: BackImgProps) {
  const [error, setError] = useState<ErrorProps | null>(null);
  const [selectFile, setSelectFile] = useState<boolean>(false);
  const [cropper, setCropper] = useState<{file: File, kind: string} | null>(null);
  const [preview, setPreview] = useState<boolean>(false);

  const isWide = useMediaQuery("(min-width:570px)", { noSsr: true });

  const handleAccept = (file: File) => {
    setCropper({file, kind: 'micrositeBackImage'});
    setSelectFile(false);
  }

  const handleSelectFile = () => {
    setSelectFile(true);
  };

  const handlePreview = () => {
    setPreview(true);
  };

  const handleRemove = () => {
    handleValue('micrositeBackImage')(undefined);
  };

  const handleOpacity = (_: Event, newValue: number | number[]) => {
    const value = newValue as number;
    handleValue('micrositeBackImageOpacity')(Math.round(value)/100);
  };

  const handleSave = (newFile: File, kind: string) => {
    handleValue(kind)(newFile);
    setCropper(null);
  };

  return (
    <>
      <Box sx={{p: isWide ? 'unset' : 1, mt: '10px'}}>
        <Button
          sx={{width: isWide ? 'unset' : '100%'}}
          startIcon={<WallpaperIcon/>}
          variant="outlined"
          color="primary"
          onClick={handleSelectFile}>
          {'Select Background image'}
        </Button>
        {micrositesImg !== undefined && (
          <>
            <Button
              sx={{ml: isWide ? 1 : 0, mt: isWide ? 0 : 1, width: isWide ? 'unset' : '100%'}}
              startIcon={<SearchIcon/>}
              variant="outlined"
              color="primary"
              onClick={handlePreview}>
              {'Preview'}
            </Button>
            <Button
              sx={{ml: isWide ? 1 : 0, mt: isWide ? 0 : 1, width: isWide ? 'unset' : '100%'}}
              startIcon={<ClearIcon color="error"/>}
              variant="outlined"
              color="primary"
              onClick={handleRemove}>
              {'Remove'}
            </Button>
          </>
        )}
      </Box>
      {micrositesImg !== undefined && (
        <Box sx={{ width: isWide ? '500px' : '100%', mt: 1}}>
          <Typography sx={{display: 'flex'}}>
            {'Opacity'}
            <Typography sx={{color: theme => theme.palette.text.disabled, ml: 1}}>{`(${Math.ceil(opacity * 100)} %)`}</Typography>
          </Typography>
          <Slider value={opacity * 100} onChange={handleOpacity} size="small" min={0} max={100} />
        </Box>
      )}
      {selectFile && (
        <RenderImagePicker
          handleClose={() => setSelectFile(false)}
          title="background"
          kind="micrositeBackImage"
          handleAcept={handleAccept}/>
      )}
      {cropper !== null && (
        <ImageCropper
          handleClose={() => setCropper(null)}
          file={cropper.file}
          kind={cropper.kind}
          handleAccept={handleSave}
          message="background"/>
      )}
      {preview && ( // @ts-ignore
        <RenderImgPreview handleClose={() => setPreview(false)} file={micrositesImg} kind="background" />
      )}
      {error && (
        <Notifications
          onClose={() => setError(null)}
          title={error.title}
          autoHideDuration={7500}
          severity={!error.warning ? 'error' : 'warning'}
          vertical="bottom"
          showProgress
          message={error.msg}/>
      )}
    </>
  );
}
