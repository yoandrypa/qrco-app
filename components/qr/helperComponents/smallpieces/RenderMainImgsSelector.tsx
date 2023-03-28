import {useEffect, useState} from "react";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import ImageIcon from "@mui/icons-material/Image";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import useMediaQuery from "@mui/material/useMediaQuery";

import {CustomCommon} from "../../types/types";
import RenderUpperSectionHeightAndSharer from "./RenderUpperSectionHeightAndSharer";

import dynamic from "next/dynamic";

const RenderImagePicker = dynamic(() => import("../../renderers/helpers/RenderImagePicker"));
const ImageCropper = dynamic(() => import("../../renderers/helpers/ImageCropper"));
const RenderForeImgTypePicker = dynamic(() => import("../../renderers/helpers/RenderForeImgTypePicker"));
const RenderImgPreview = dynamic(() => import("../../renderers/helpers/RenderImgPreview"));
const RenderProfileImgSettings = dynamic(() => import("../looseComps/RenderProfileImgSettings"));
const Typography = dynamic(() => import("@mui/material/Typography"));

interface MainImgSelectorProps extends CustomCommon {
  omitPrimaryImg?: boolean;
  isWideForPreview?: boolean;
  backgndImg?: File | string;
  foregndImg?: File | string;
  loading?: boolean;
  backError?: boolean;
  foreError?: boolean;
  forcePick?: string;
  releasePick: () => void;
}

const RenderMainImgsSelector = (
  {
    data, omitPrimaryImg, isWideForPreview, backgndImg, foregndImg, loading, backError, foreError, handleValue, forcePick, releasePick
  }: MainImgSelectorProps) => {
  const [selectFile, setSelectFile] = useState<string | null>(null);
  const [cropper, setCropper] = useState<{file: File, kind: string} | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const isWideEnough = useMediaQuery("(min-width:1083px)", { noSsr: true });

  const shrink = isWideForPreview && !isWideEnough && (backgndImg || foregndImg);

  const handleSelectFile = (kind: 'backgndImg' | 'foregndImg') => () => {
    setSelectFile(kind);
  };

  const renderOptions = (kind: string) => (
    <>
      <Tooltip title="Preview">
        <Button sx={{width: '40px'}} variant="contained" color="primary" onClick={() => setPreview(kind)}>
          <SearchIcon/>
        </Button>
      </Tooltip> {/* @ts-ignore */}
      {kind === 'foregndImg' && <RenderForeImgTypePicker handleValue={handleValue} foregndImgType={data?.foregndImgType} />}
      <Tooltip title="Remove">
        <Button sx={{width: '40px'}} variant="contained" color="error" onClick={() => handleValue(kind)(undefined)}>
          <ClearIcon/>
        </Button>
      </Tooltip>
    </>
  );

  const handleAccept = (file: File, kind: string) => {
    setCropper({file, kind});
    setSelectFile(null);
  };

  const handleSave = (newFile: File, kind: string) => {
    handleValue(kind)(newFile);
    setCropper(null);
  };

  useEffect(() => {
    if (forcePick) {
      setSelectFile(forcePick === 'banner' ? 'backgndImg' : 'foregndImg');
      setTimeout(() => releasePick(), 200);
    }
  }, [forcePick]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {data?.layout !== 'empty' ? (
        <Box sx={{
          width: '100%',
          display: 'flex',
          textAlign: 'center',
          flexDirection: shrink ? "column" : {md: "row", xs: "column"},
          mt: 2
        }}>
          {!data?.layout?.includes('banner') && <ButtonGroup sx={{mr: !omitPrimaryImg ? {md: 1, xs: 0} : 0, width: '100%'}}>
            <Tooltip title="Click for selecting the banner image">
              <Button
                sx={{width: '100%'}}
                disabled={loading}
                startIcon={<WallpaperIcon sx={{ color: theme => backError ? theme.palette.error.dark : undefined }}/>}
                variant="outlined"
                color="primary"
                onClick={handleSelectFile('backgndImg')}>
                {`Banner image${backgndImg && !loading ? ' / Loaded' : ''}`}
              </Button>
            </Tooltip>
            {backgndImg && !loading && renderOptions('backgndImg')}
          </ButtonGroup>}
          {!omitPrimaryImg && (
            <ButtonGroup sx={{mt: shrink ? 1 : {xs: 1, md: 0}, width: '100%'}}>
              <Tooltip title="Click for selecting the profile image">
                <Button
                  sx={{width: '100%'}}
                  startIcon={<ImageIcon sx={{ color: theme => foreError ? theme.palette.error.dark : undefined }}/>}
                  variant="outlined"
                  disabled={loading}
                  onClick={handleSelectFile('foregndImg')}
                  color="primary">
                  {`Profile image${backgndImg && !loading ? ' | Loaded' : ''}`}
                </Button>
              </Tooltip>
              {foregndImg && !loading && renderOptions('foregndImg')}
            </ButtonGroup>
          )}
          {selectFile !== null && (
            <RenderImagePicker
              handleClose={() => setSelectFile(null)}
              title={selectFile === 'foregndImg' ? 'profile' : 'banner'}
              kind={selectFile}
              handleAcept={handleAccept}
              wasError={(selectFile === 'foregndImg' && foreError) || (selectFile === 'backgndImg' && backError)}/>
          )}
          {preview !== null && ( // @ts-ignore
            <RenderImgPreview handleClose={() => setPreview(null)} file={preview === 'backgndImg' ? backgndImg : foregndImg} kind={preview} />
          )}
          {cropper !== null && (
            <ImageCropper
              handleClose={() => setCropper(null)}
              handleAccept={handleSave}
              file={cropper.file}
              kind={cropper.kind}
              message={cropper.kind === 'backgndImg' ? 'banner' : 'profile'} />
          )}
        </Box>
      ) : (
        <Typography sx={{color: theme => theme.palette.text.disabled, fontSize: 'smaller'}}>
          {'To set a banner image and/or profile image select another layout'}
        </Typography>
      )}
      {data?.layout?.includes('banner') && (
        <Typography sx={{color: theme => theme.palette.text.disabled, fontSize: 'smaller'}}>
          {'To set a banner image select another layout that doesn\' override it'}
        </Typography>
      )}
    {foregndImg !== undefined && (
      <RenderProfileImgSettings profileImageVertical={data?.profileImageVertical} profileImageSize={data?.profileImageSize} handleValue={handleValue} />
    )}
    <RenderUpperSectionHeightAndSharer handleValue={handleValue} data={data} />
  </>);
};

export default RenderMainImgsSelector;
