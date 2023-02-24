import {ChangeEvent, useCallback, useContext, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import ImageIcon from '@mui/icons-material/Image';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import useMediaQuery from "@mui/material/useMediaQuery";

import dynamic from "next/dynamic";
import {DataType} from "../types/types";
import {DEFAULT_COLORS} from "../constants";
import RenderGradientSelector from "./helpers/RenderGradientSelector";
import Expander from "./helpers/Expander";
import Context from "../../context/Context";
import RenderMainColors from "./helpers/RenderMainColors";

const RenderSingleBackColor = dynamic(() => import("./helpers/RenderSingleBackColor"));
const RenderButtonsHandler = dynamic(() => import('../helperComponents/looseComps/RenderButtonHandler'));
const RenderImagePicker = dynamic(() => import('./helpers/RenderImagePicker'));
const RenderImgPreview = dynamic(() => import('./helpers/RenderImgPreview'));
const RenderForeImgTypePicker = dynamic(() => import ('./helpers/RenderForeImgTypePicker'));
const ImageCropper = dynamic(() => import('./helpers/ImageCropper'));
const RenderFontsHandler = dynamic(() => import('../helperComponents/smallpieces/RenderFontsHandler'));
const RenderLayoutHandler = dynamic(() => import("../helperComponents/smallpieces/RenderLayoutHandler"));

interface QRCommonsProps {
  omitPrimaryImg?: boolean;
  data?: DataType;
  loading?: boolean;
  isWideForPreview?: boolean;
  backgndImg?: File | string;
  foregndImg?: File | string;
  backError?: boolean;
  foreError?: boolean;
  handleValue: Function;
  forcePick?: string;
}

function RenderQRCommons({loading, data, omitPrimaryImg, foregndImg, backgndImg, backError, foreError, handleValue, isWideForPreview, forcePick}: QRCommonsProps) { // @ts-ignore
  const [selectFile, setSelectFile] = useState<string | null>(null);
  const [cropper, setCropper] = useState<{file: File, kind: string} | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [expander, setExpander] = useState<string | null>(null);

  // @ts-ignore
  const {selected}: {selected: string} = useContext(Context);

  const isWideEnough = useMediaQuery("(min-width:1083px)", { noSsr: true });

  const handleExpander = useCallback((item: string): void => {
    setExpander(item === expander ? null : item);
  }, [expander]);

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

  const handleSelectBackground = (event: ChangeEvent<HTMLInputElement>) => {
    handleValue('backgroundType')(event);
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

  useEffect(() => {
    if (forcePick) {
      setSelectFile(forcePick === 'banner' ? 'backgndImg' : 'foregndImg');
    }
  }, [forcePick]);

  const shrink = isWideForPreview && !isWideEnough && (backgndImg || foregndImg);

  return (
    <>
      {loading && (
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', mt: '10px', mb: '-10px' }}>
          <CircularProgress size={20} sx={{ mr: '5px' }} />
          <Typography sx={{ fontSize: 'small', color: theme => theme.palette.text.disabled}}>
            {'Loading data. Please wait...'}
          </Typography>
        </Box>
      )}
      <Box sx={{p: 1, mt: 1}}>
        <RenderMainColors data={data} handleValue={handleValue} />
        <Paper sx={{p: 1, mb: '10px'}} elevation={2}>
          <Typography sx={{fontWeight: 'bold'}}>{'Images'}</Typography>
          <Box sx={{
            width: '100%',
            display: 'flex',
            textAlign: 'center',
            flexDirection: shrink ? "column" : {md: "row", xs: "column"},
            mt: 2
          }}>
            <ButtonGroup sx={{mr: !omitPrimaryImg ? {md: 1, xs: 0} : 0, width: '100%'}}>
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
            </ButtonGroup>
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
          </Box>
        </Paper>
        <Paper sx={{p: 1, mb: '10px'}} elevation={2}>
          <Typography sx={{fontWeight: 'bold'}}>{'Background'}</Typography>
          <RadioGroup
            aria-labelledby="backgroundType" name="backgroundType" value={data?.backgroundType || 'single'}
            onChange={handleSelectBackground} row sx={{mb: '-12px'}}>
            <FormControlLabel value="single" control={<Radio/>} label="Color solid"/>
            <FormControlLabel value="gradient" control={<Radio/>} label="Gradient"/>
          </RadioGroup>
          {(data?.backgroundType === undefined || data.backgroundType === 'single') && (
            <RenderSingleBackColor data={data} handleValue={handleValue} />
          )}
          {data?.backgroundType === 'gradient' && (
            <RenderGradientSelector
              colorLeft={data?.backgroundColor || DEFAULT_COLORS.s}
              colorRight={data?.backgroundColorRight || DEFAULT_COLORS.p}
              direction={data?.backgroundDirection}
              handleData={handleValue}/>
          )}
        </Paper>
        <Paper sx={{p: 1, mb: '10px'}} elevation={2}> {/* @ts-ignore */}
          <Expander expand={expander} setExpand={handleExpander} item="fonts" title="Fonts" bold/>
          {expander === 'fonts' && <RenderFontsHandler data={data} handleValue={handleValue} selected={selected} />}
        </Paper>
        {!['social', 'petId', 'gallery'].includes(selected) && (<Paper sx={{p: 1, mb: '10px'}} elevation={2}> {/* @ts-ignore */}
          <Expander expand={expander} setExpand={handleExpander} item="buttons" title="Buttons" bold/>
          {expander === 'buttons' && <RenderButtonsHandler handleValue={handleValue} data={data}/>}
        </Paper>)}
        <Paper sx={{p: 1, mb: '10px'}} elevation={2}> {/* @ts-ignore */}
          <Expander expand={expander} setExpand={handleExpander} item="layout" title="Layout" bold/>
          {expander === 'layout' && <RenderLayoutHandler handleValue={handleValue} data={data} omitPrimary={omitPrimaryImg}/>}
        </Paper>
      </Box>
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
        <ImageCropper handleClose={() => setCropper(null)} file={cropper.file} kind={cropper.kind} handleAccept={handleSave} />
      )}
    </>
  );
}

export default RenderQRCommons;
