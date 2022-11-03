import {useState} from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import FileUpload from "react-material-file-upload";
import {ALLOWED_FILE_EXTENSIONS} from "../../../../consts";
import Notifications from "../../../notifications/Notifications";

interface RenderImageProps {
  handleClose: () => void;
  handleAcept: (file: File, kind: string) => void;
  title: string;
  kind: string;
  wasError?: boolean;
}

export default function RenderImagePicker({title, kind, handleClose, handleAcept, wasError}: RenderImageProps) {
  const [error, setError] = useState<boolean>(false);

  const handleLoadedImage = (f: File[]) => {
    if (f.length) {
      if (f[0].size <= 1000000) {
        handleAcept(f[0], kind);
      } else {
        setError(true);
      }
    }
  }

  return (
    <Dialog onClose={handleClose} open={true}>
      <DialogContent>
        {wasError && (
          <Box sx={{ width: '100%', textAlign: 'center'}}>
            <Typography sx={{ color: theme => theme.palette.error.dark, mb: 2, fontWeight: 'bold' }}>
              {`The ${title} image failed. Be advised.`}
            </Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Box sx={{ mb: 2, display: 'flex' }}>
            <Typography>{'Please, select the'}</Typography>
            <Typography sx={{fontWeight: 'bold', mx: '5px'}}>{`${title}`}</Typography>
            <Typography>{'image.'}</Typography>
          </Box>
        </Box>
        <Paper sx={{ width: 370, height: 'auto', p: 1 }}>
          <FileUpload
            value={[]}
            // @ts-ignore
            onChange={handleLoadedImage}
            multiple={false}
            maxFiles={1}
            accept={ALLOWED_FILE_EXTENSIONS.gallery}
            title="Select the image or drag and drop it here"
          />
        </Paper>
      </DialogContent>
      <DialogActions sx={{p: 2}}>
        <Button variant="outlined" onClick={handleClose}>Close</Button>
      </DialogActions>
      {error && (
        <Notifications
          onClose={() => setError(false)}
          title="Too heavy"
          vertical="bottom"
          message="The selected file is larger than 1 megabyte." />
      )}
  </Dialog>
  );
};
