import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface RenderImgPrevProps {
  handleClose: () => void;
  file: File;
}

const RenderImgPreview = ({handleClose, file}: RenderImgPrevProps) => (
  <Dialog onClose={handleClose} open={true}>
    <DialogContent>
      <Box component="img" sx={{display: 'flex', width: '370px'}} alt="EBANUX" src={URL.createObjectURL(file)}/>
    </DialogContent>
    <DialogActions sx={{p: 2}}>
      <Button variant="outlined" onClick={handleClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

export default RenderImgPreview;
