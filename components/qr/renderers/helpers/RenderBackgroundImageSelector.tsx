import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import useMediaQuery from "@mui/material/useMediaQuery";

import dynamic from "next/dynamic";

const RenderHandleOpacity = dynamic(() => import("../../helperComponents/smallpieces/RenderHandleOpacity"));
const RenderImgPreview = dynamic(() => import("./RenderImgPreview"));
const RenderImagePicker = dynamic(() => import("./RenderImagePicker"));
const ImageCropper = dynamic(() => import("./ImageCropper"));
const Notifications = dynamic(() => import("../../../notifications/Notifications"));

interface BackImgProps {
  micrositesImg?: File | string;
  opacity: number;
  handleValue: Function;
  forcePick?: string;
  releasePick: () => void;
}

interface ErrorProps {
  msg: string;
  title: string;
  warning?: boolean;
}

export default function RenderBackgroundImageSelector({handleValue, micrositesImg, opacity, forcePick, releasePick}: BackImgProps) {
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

  const handleSave = (newFile: File, kind: string) => {
    handleValue(kind)(newFile);
    setCropper(null);
  };

  useEffect(() => {
    if (forcePick) {
      setSelectFile(true);
      setTimeout(() => releasePick(), 200);

    }
  }, [forcePick]); // eslint-disable-line react-hooks/exhaustive-deps

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
        <RenderHandleOpacity opacity={opacity} handleValue={handleValue} property="micrositeBackImageOpacity" />
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
