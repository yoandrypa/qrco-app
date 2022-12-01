import {useState} from "react";
import Box from "@mui/material/Box";
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import ImageIcon from '@mui/icons-material/Image';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import RenderImagePicker from "./helpers/RenderImagePicker";
import Tooltip from "@mui/material/Tooltip";
import RenderImgPreview from "./helpers/RenderImgPreview";
import RenderForeImgTypePicker from "./helpers/RenderForeImgTypePicker";
import CircularProgress from "@mui/material/CircularProgress";
import ImageCropper from "./helpers/ImageCropper";
import RenderColors from "./helpers/RenderColors";
import {DataType} from "../types/types";

interface QRCommonsProps {
  omitPrimaryImg?: boolean;
  data?: DataType;
  loading?: boolean;
  backgndImg?: File | string;
  foregndImg?: File | string;
  backError?: boolean;
  foreError?: boolean;
  handleValue: Function;
}

function RenderQRCommons({loading, data, omitPrimaryImg, foregndImg, backgndImg, backError, foreError, handleValue}: QRCommonsProps) { // @ts-ignore
  const [selectFile, setSelectFile] = useState<string | null>(null);
  const [cropper, setCropper] = useState<{file: File, kind: string} | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSelectFile = (kind: string) => () => {
    setSelectFile(kind);
  };

  const handleAccept = (file: File, kind: string) => {
    setCropper({file, kind});
    setSelectFile(null);
  };

  const handleSave = (newFile: File, kind: string) => {
    handleValue(kind)(newFile);
    setCropper(null);
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

  return (
    <>
      <Box sx={{p: 1, mt: 1}}>
        <RenderColors handleValue={handleValue} data={data} />
        {loading && (
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', mt: '10px', mb: '-10px' }}>
            <CircularProgress size={20} sx={{ mr: '5px' }} />
            <Typography sx={{ fontSize: 'small', color: theme => theme.palette.text.disabled}}>
              {'Loading data. Please wait...'}
            </Typography>
          </Box>
        )}
        <Box sx={{
          width: '100%',
          display: 'flex',
          textAlign: 'center',
          flexDirection: {md: "row", xs: "column"},
          mt: 2
        }}>
          <ButtonGroup sx={{mr: !omitPrimaryImg ? {md: 1, xs: 0} : 0, width: '100%'}}>
            <Tooltip title="Click for selecting the background image">
              <Button
                sx={{width: '100%'}}
                disabled={loading}
                startIcon={<WallpaperIcon sx={{ color: theme => backError ? theme.palette.error.dark : undefined }}/>}
                variant="outlined"
                color="primary"
                onClick={handleSelectFile('backgndImg')}
              >
                {`${backgndImg && !loading ? 'Image loaded /' : 'Select'} background image`}
              </Button>
            </Tooltip>
            {backgndImg && !loading && renderOptions('backgndImg')}
          </ButtonGroup>
          {!omitPrimaryImg && (
            <ButtonGroup sx={{mt: {xs: 1, md: 0}, width: '100%'}}>
              <Tooltip title="Click for selecting the main image">
                <Button
                  sx={{width: '100%'}}
                  startIcon={<ImageIcon sx={{ color: theme => foreError ? theme.palette.error.dark : undefined }}/>}
                  variant="outlined"
                  disabled={loading}
                  onClick={handleSelectFile('foregndImg')}
                  color="primary"
                >
                  {`${foregndImg && !loading ? 'Image loaded /' : 'Select'} main image`}
                </Button>
              </Tooltip>
              {foregndImg && !loading && renderOptions('foregndImg')}
            </ButtonGroup>
          )}
        </Box>
      </Box>
      <Divider sx={{my: '10px'}}/>
      {selectFile !== null && (
        <RenderImagePicker
          handleClose={() => setSelectFile(null)}
          title={selectFile === 'foregndImg' ? 'main' : 'background'}
          kind={selectFile}
          handleAcept={handleAccept}
          wasError={(selectFile === 'foregndImg' && foreError) || (selectFile === 'backgndImg' && backError)}
        />
      )}
      {preview !== null && ( // @ts-ignore
        <RenderImgPreview handleClose={() => setPreview(null)} file={preview === 'backgndImg' ? backgndImg : foregndImg} />
      )}
      {cropper !== null && (
        <ImageCropper handleClose={() => setCropper(null)} file={cropper.file} kind={cropper.kind} handleAccept={handleSave} />
      )}
    </>
  );
}

export default RenderQRCommons;
