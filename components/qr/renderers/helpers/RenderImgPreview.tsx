import {useEffect, useState} from "react";

import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import {download} from "../../../../handlers/storage";

import dynamic from "next/dynamic";

const RenderIcon = dynamic(() => import("../../helperComponents/smallpieces/RenderIcon"));

interface RenderImgPrevProps {
  handleClose: () => void;
  file: File | string | {Key: string, name: string};
  kind?: string;
}

function isBase64(str: string): boolean {
  const regex = new RegExp("^data:[a-z]+\\\\/[a-z\\\\-]+(;[a-z]+\\\\=[a-zA-Z0-9]+)*;base64,");
  return regex.test(str);
}

const RenderImgPreview = ({handleClose, file, kind}: RenderImgPrevProps) => {
  const [data, setData] = useState<string | undefined>(undefined);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    try { // @ts-ignore
      if (file[0] && file[0].Key) { // @ts-ignore
        download(file[0].Key).then(resp => setData(resp.content));
      }
    } catch {
      setError(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const renderImage = () => {
    if (typeof file === 'string' && !isBase64(file)) {
      return (
        <Box sx={{width: '100%', textAlign: 'center'}}>
          <RenderIcon icon={file} enabled sx={{ width: '45px', height: '45px', color: 'primary.dark'}} />
        </Box>
      );
    }

    if (data !== undefined) {
      return <Box component="img" alt="EBANUX" src={data}/>
    }

    // @ts-ignore
    return <Box component="img" alt="EBANUX" src={typeof file !== 'string' ? URL.createObjectURL(file) : file}/>
  }

  return (
    <Dialog onClose={handleClose} open={true}>
      <DialogContent dividers>
        <Box sx={{
          width: kind === 'btnIcon' ? '200px' : (kind !== 'foregndImg' ? {
            xs: '100%', sm: kind === 'background' ? '350px' : '460px'
          } : '100%'),
          overflow: 'auto'
        }}
        >
          {file instanceof File || typeof file === 'string' || data ? renderImage() : (
            <Box sx={{
              width: '100%',
              textAlign: 'center',
              color: error ? 'error.main' : undefined,
              fontWeight: error ? 'bold' : undefined
            }}>
              {!error ? 'Please wait...' : 'Error loading preview!'}
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{p: 2}}>
        <Button variant="outlined" onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
};

export default RenderImgPreview;
