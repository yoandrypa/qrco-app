import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {useEffect, useState} from "react";
import {download} from "../../../../handlers/storage";

interface RenderImgPrevProps {
  handleClose: () => void;
  file: File | string | {Key: string, name: string};
  kind?: string;
}

const RenderImgPreview = ({handleClose, file, kind}: RenderImgPrevProps) => {
  const [data, setData] = useState<string | undefined>(undefined);

  useEffect(() => { // @ts-ignore
    if (file[0] && file[0].Key) { // @ts-ignore
      download(file[0].Key).then(resp => setData(resp.content));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
          {file instanceof File || typeof file === 'string' || data ? (
            data !== undefined ? <Box component="img" alt="EBANUX" src={data}/> : // @ts-ignore
              <Box component="img" alt="EBANUX" src={typeof file !== 'string' ? URL.createObjectURL(file) : file}/>
          ) : <Box sx={{width: '100%', textAlign: 'center'}}>{'Please wait...'}</Box>}
        </Box>
      </DialogContent>
      <DialogActions sx={{p: 2}}>
        <Button variant="outlined" onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
};

export default RenderImgPreview;
