import Popover from "@mui/material/Popover";
import MenuList from "@mui/material/MenuList";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import {useState} from "react";
import RenderImagePicker from "../RenderImagePicker";
import ImageCropper from "../ImageCropper";
import Divider from "@mui/material/Divider";
import RenderImgPreview from "../RenderImgPreview";

interface TextFieldIconProps {
  anchor: Element;
  setAnchor: (anchor: undefined) => void;
  handleValues: Function;
  icon?: File | string;
}

export default function TextFieldIcon({anchor, setAnchor, icon, handleValues}: TextFieldIconProps) {
  const [open, setOpen] = useState<boolean>(false);
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
        anchorOrigin={{vertical: 'top', horizontal: 'left'}}
        transformOrigin={{vertical: 'top', horizontal: 'left'}}
      >
        <MenuList>
          <MenuItem key={'selectIcon'} onClick={() => setOpen(true)}>
            <Typography>{'Pick an icon'}</Typography>
          </MenuItem>
          <MenuItem key={'showIcon'} disabled={icon === undefined} onClick={() => setPreview(true)}>
            <Typography>{'Show icon'}</Typography>
          </MenuItem>
          <Divider />
          <MenuItem key={'clearIcon'} disabled={icon === undefined} onClick={() => {
            handleValues({type: 'clearIcon'});
            setAnchor(undefined);
          }}>
            <Typography>{'Clear icon'}</Typography>
          </MenuItem>
        </MenuList>
      </Popover>
      {open && (
        <RenderImagePicker
          handleClose={() => {
            setOpen(false);
            setAnchor(undefined);
          }}
          title="button icon"
          kind="btnImg"
          size={35840} // 35 kb
          handleAcept={handleAcceptFile}/>
      )} {/* @ts-ignore */}
      {preview && <RenderImgPreview file={icon} kind="btnIcon"
                                    handleClose={() => { setPreview(false); setAnchor(undefined); }} />}
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
