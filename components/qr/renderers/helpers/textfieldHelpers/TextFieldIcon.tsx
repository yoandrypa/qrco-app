import {useState} from "react";

import Popover from "@mui/material/Popover";
import MenuList from "@mui/material/MenuList";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";

import dynamic from "next/dynamic";

const RenderImagePicker = dynamic(() => import ("../RenderImagePicker"));
const ImageCropper = dynamic(() => import ("../ImageCropper"));
const Divider = dynamic(() => import ("@mui/material/Divider"));
const RenderImgPreview = dynamic(() => import ("../RenderImgPreview"));
const PreIconPicker = dynamic(() => import ("./PreIconPicker"));

interface TextFieldIconProps {
  anchor: Element;
  setAnchor: (anchor: undefined) => void;
  handleValues: Function;
  icon?: File | string;
}

export default function TextFieldIcon({anchor, setAnchor, icon, handleValues}: TextFieldIconProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [openIcon, setOpenIcon] = useState<boolean>(false);
  const [cropper, setCropper] = useState<{file: File, kind: string} | null>(null);
  const [preview, setPreview] = useState<boolean>(false);

  const handleAcceptFile = (file: File) => {
    setCropper({file, kind: 'btnImg'});
  }

  const handleAcept = (newFile: File) => {
    handleValues(newFile);
    setCropper(null);
    setAnchor(undefined);
  }

  return (
    <>
      <Popover
        open
        anchorEl={anchor}
        onClose={() => setAnchor(undefined)}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        transformOrigin={{vertical: 'top', horizontal: 'center'}}
      >
        <MenuList>
          <MenuItem key="selectImage" onClick={() => setOpen(true)}>
            <Typography>{'Pick an image'}</Typography>
          </MenuItem>
          <MenuItem key="selectIcon" onClick={() => setOpenIcon(true)}>
            <Typography>{'Pick an icon'}</Typography>
          </MenuItem>
          <MenuItem key="showIcon" disabled={icon === undefined} onClick={() => setPreview(true)}>
            <Typography>{'Preview'}</Typography>
          </MenuItem>
          <Divider />
          <MenuItem key="clearIcon" disabled={icon === undefined} onClick={() => {
            handleValues({type: 'clearIcon'});
            setAnchor(undefined);
          }}>
            <Typography>{'Clear'}</Typography>
          </MenuItem>
        </MenuList>
      </Popover>
      {openIcon && (
        <PreIconPicker
          setOpenIcon={setOpenIcon}
          setAnchor={setAnchor}
          handleAccept={(icon: string) => {
            handleValues({icon});
            setOpenIcon(false);
            setAnchor(undefined);
          }}
        />
      )}
      {open && (
        <RenderImagePicker
          handleClose={() => {
            setOpen(false);
            setAnchor(undefined);
          }}
          title="button icon"
          kind="btnImg"
          size={716800} // 700 kb
          handleAcept={handleAcceptFile}/>
      )}
      {preview && ( // @ts-ignore
        <RenderImgPreview file={icon} kind="btnIcon"
                          handleClose={() => { setPreview(false); setAnchor(undefined); }} />
      )}
      {cropper !== null && (
        <ImageCropper
          handleClose={() => setCropper(null)}
          file={cropper.file}
          kind={cropper.kind}
          shortMessage
          handleAccept={handleAcept}
          message="button icon"/>
      )}
    </>
  );
}
