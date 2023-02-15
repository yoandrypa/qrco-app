import {useState} from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PhotoIcon from '@mui/icons-material/Photo';

import FileUpload from "react-material-file-upload";
import {ALLOWED_FILE_EXTENSIONS} from "../../../../consts";
import Notifications from "../../../notifications/Notifications";
import {checkForAlpha} from "../../../../helpers/qr/helpers";

interface RenderImageProps {
  handleClose: () => void;
  handleAcept: (file: File, kind: string) => void;
  title: string;
  kind: string;
  wasError?: boolean;
}

interface ErrorProps {
  msg: string;
  title: string;
  warning?: boolean;
}

export default function RenderImagePicker({title, kind, handleClose, handleAcept, wasError}: RenderImageProps) {
  const [error, setError] = useState<ErrorProps | null>(null);

  const handleLoadedImage = async (f: File[]) => {
    if (f.length) {
      if (f[0].size <= 1000000) {
        handleAcept(f[0], kind);

        const result = await checkForAlpha(f[0]);
        if (result?.hasAlpha) {
          setError({
            msg: 'The selected image file has alpha channels. This might cause it to not render correctly. Be advised.',
            title: 'Alpha channel detected', warning: true
          });
        }
      } else {
        setError({msg: 'The selected file is larger than 1 megabyte.', title: 'Too heavy'});
      }
    }
  }

  return (
    <Dialog onClose={handleClose} open={true}>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Box sx={{ mb: 2, display: 'flex' }}>
            <PhotoIcon sx={{ color: theme => theme.palette.primary.dark, pb: '2px' }} />
            <Typography>{'Pick the'}</Typography>
            <Typography sx={{fontWeight: 'bold', mx: '5px'}}>{`${title}`}</Typography>
            <Typography>{'image.'}</Typography>
          </Box>
        </Box>
        {wasError && (
          <Box sx={{ width: '100%', textAlign: 'center'}}>
            <Typography sx={{ color: theme => theme.palette.error.dark, mb: 2, fontWeight: 'bold' }}>
              {`The ${title} image failed. Be advised.`}
            </Typography>
          </Box>
        )}
        <Paper sx={{ width: '100%', height: 'auto' }}>
          <FileUpload
            value={[]} // @ts-ignore
            onChange={handleLoadedImage}
            multiple={false}
            maxFiles={1}
            accept={ALLOWED_FILE_EXTENSIONS.images}
            title="Select an image by hitting 'Upload' button or drag and drop it here"
          />
        </Paper>
      </DialogContent>
      <DialogActions sx={{p: 2}}>
        <Button variant="outlined" onClick={handleClose}>Close</Button>
      </DialogActions>
      {error && (
        <Notifications
          onClose={() => setError(null)}
          title={error.title}
          autoHideDuration={7500}
          severity={!error.warning ? 'error' : 'warning'}
          vertical="bottom"
          showProgress
          message={error.msg} />
      )}
  </Dialog>
  );
};
