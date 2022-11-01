import {memo, useContext, useState} from "react";
import Box from "@mui/material/Box";
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Context from "../../context/Context";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import ImageIcon from '@mui/icons-material/Image';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import {alpha} from "@mui/material/styles";

import Expander from "./helpers/Expander";
import ColorSelector from "../helperComponents/ColorSelector";
import {ColorTypes} from "../types/types";
import {DEFAULT_COLORS} from "../constants";
import RenderImagePicker from "./helpers/RenderImagePicker";
import Tooltip from "@mui/material/Tooltip";
import RenderImgPreview from "./helpers/RenderImgPreview";
import RenderForeImgTypePicker from "./helpers/RenderForeImgTypePicker";

interface QRCommonsProps {
  omitDesign?: boolean;
  omitPrimaryImg?: boolean;
  qrName?: string;
  primary?: string;
  secondary?: string;
  backgndImg?: File;
  foregndImg?: File;
  foregndImgType?: string;
  handleValue: Function;
}

const colors = [DEFAULT_COLORS, {p: '#187510', s: '#9ece99'}, {p: '#aa8412', s: '#d7c89a'},
  {p: '#b30909', s: '#dba8a8'}, {p: '#8c0f4a', s: '#dd9ebc'}, {p: '#40310f', s: '#a8a6a1'}] as ColorTypes[];

function RenderQRCommons({omitDesign, omitPrimaryImg, qrName, primary, foregndImg, foregndImgType, backgndImg, secondary, handleValue}: QRCommonsProps) {
  // @ts-ignore
  const {userInfo} = useContext(Context);
  const [expander, setExpander] = useState<string | null>('design');
  const [selectFile, setSelectFile] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const renderColors = () => (
    <>
      <Grid container spacing={1}>
        {colors.map(x => {
          const selected = (!primary && !secondary && x.p === DEFAULT_COLORS.p && x.s === DEFAULT_COLORS.s) ||
            (x.p === primary && x.s === secondary);
          return (
            <Grid item lg={2} md={2} sm={4} xs={4} style={{paddingTop: 0}} key={`${x.p}${x.s}`}>
              <Box
                onClick={() => handleValue('both')(x)}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  p: 1,
                  mt: 1,
                  border: theme => `solid ${selected ? 2 : 1}px ${!selected ? theme.palette.text.disabled : theme.palette.warning.light}`,
                  borderRadius: '5px',
                  '&:hover': { backgroundColor: theme => alpha(theme.palette.info.light, 0.1) }
                }}>
                <Box sx={{background: x.p, width: '100%', height: '30px', borderRadius: '5px 0 0 5px'}}/>
                <Box sx={{background: x.s, width: '100%', height: '30px', borderRadius: '0 5px 5px 0'}}/>
              </Box>
            </Grid>
          )
        })}
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <ColorSelector label="Primary color" color={primary || DEFAULT_COLORS.p} handleData={handleValue} property="primary"/>
        </Grid>
        <Grid item xs={6}>
          <ColorSelector label="Secondary color" color={secondary || DEFAULT_COLORS.s} handleData={handleValue} property="secondary"/>
        </Grid>
      </Grid>
    </>
  );

  if (!userInfo) {
    return null;
  }

  const handleSelectFile = (kind: string) => () => {
    setSelectFile(kind);
  };

  const handleAccept = (file: File, kind: string) => {
    handleValue(kind)(file);
    setSelectFile(null);
  };

  const renderOptions = (kind: string) => (
    <>
      <Tooltip title="Preview">
        <Button sx={{width: '40px'}} variant="contained" color="primary" onClick={() => setPreview(kind)}>
          <SearchIcon/>
        </Button>
      </Tooltip>
      {kind === 'foregndImg' && <RenderForeImgTypePicker handleValue={handleValue} foregndImgType={foregndImgType} />}
      <Tooltip title="Remove">
        <Button sx={{width: '40px'}} variant="contained" color="error" onClick={() => handleValue(kind)(undefined)}>
          <ClearIcon/>
        </Button>
      </Tooltip>
    </>
  )

  return (
    <>
      <TextField
        label="QR name"
        required
        size="small"
        fullWidth
        margin="dense"
        value={qrName || ''}
        onChange={handleValue('qrName')}
        InputProps={{
          endAdornment: (
            !Boolean(qrName?.trim().length) ? (<InputAdornment position="end">
              <Typography color="error">{'REQUIRED'}</Typography>
            </InputAdornment>) : null
          )
        }}
      />
      {!omitDesign && (
        <Paper elevation={2} sx={{p: 1, mt: 1}}>
          <Expander expand={expander} setExpand={setExpander} item="design" title="Design" bold/>
          {expander === "design" && (
            <>
              {renderColors()}
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
                      startIcon={<WallpaperIcon/>}
                      variant="outlined"
                      color="primary"
                      onClick={handleSelectFile('backgndImg')}
                    >
                      {`${backgndImg ? 'Image loaded /' : 'Select'} background image`}
                    </Button>
                  </Tooltip>
                  {backgndImg && renderOptions('backgndImg')}
                </ButtonGroup>
                {!omitPrimaryImg && (
                  <ButtonGroup sx={{mt: {xs: 1, md: 0}, width: '100%'}}>
                    <Tooltip title="Click for selecting the main image">
                      <Button
                        sx={{width: '100%'}}
                        startIcon={<ImageIcon/>}
                        variant="outlined"
                        onClick={handleSelectFile('foregndImg')}
                        color="primary"
                      >
                        {`${foregndImg ? 'Image loaded /' : 'Select'} main image`}
                      </Button>
                    </Tooltip>
                    {foregndImg && renderOptions('foregndImg')}
                  </ButtonGroup>
                )}
              </Box>
            </>
          )}
        </Paper>
      )}
      <Divider sx={{my: '10px'}}/>
      {selectFile !== null && (
        <RenderImagePicker
          handleClose={() => setSelectFile(null)}
          title={selectFile === 'foregndImg' ? 'main' : 'background'}
          kind={selectFile}
          handleAcept={handleAccept}/>
      )}
      {preview !== null && (
        // @ts-ignore
        <RenderImgPreview handleClose={() => setPreview(null)} file={preview === 'backgndImg' ? backgndImg : foregndImg} />
      )}
    </>
  );
}

// @ts-ignore
function notIf(curr, next) {
  return curr.qrName === next.qrName && curr.primary === next.primary && curr.secondary === next.secondary &&
    curr.backgndImg === next.backgndImg && curr.foregndImg === next.foregndImg &&
    curr.foregndImgType === next.foregndImgType;
}

export default memo(RenderQRCommons, notIf);
