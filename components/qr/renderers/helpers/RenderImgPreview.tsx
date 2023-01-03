import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface RenderImgPrevProps {
  handleClose: () => void;
  file: File | string;
}

const RenderImgPreview = ({handleClose, file}: RenderImgPrevProps) => (
  <Dialog onClose={handleClose} open={true}>
    <DialogContent dividers>
      <Box sx={{width: {xs: '100%', sm: '460px'}, overflow: 'auto'}}>
        <Box component="img" alt="EBANUX" src={typeof file !== 'string' ? URL.createObjectURL(file) : file} />
      </Box>
    </DialogContent>
    <DialogActions sx={{p: 2}}>
      <Button variant="outlined" onClick={handleClose}>Close</Button>
    </DialogActions>
  </Dialog>
);

export default RenderImgPreview;
