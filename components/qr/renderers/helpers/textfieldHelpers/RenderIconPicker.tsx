import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";

import RenderIcon from "../../../helperComponents/smallpieces/RenderIcon";

interface IconPickerProps {
  handleClose: () => void;
  handleAccept: (icon: string) => void;
  icons: string[];
}

export default function RenderIconPicker({handleClose, handleAccept, icons}: IconPickerProps) {
  return (
    <Dialog onClose={handleClose} open={true}>
      <DialogContent dividers sx={{textAlign: 'center'}}>
        <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: 'fit-content', margin: '0 auto'}}>
          {icons.map(x => (
            <Box
              key={x}
              onClick={() => handleAccept(x)}
              sx={{
                width: '34px',
                height: '34px',
                mr: '5px',
                mb: '5px',
                pt: '3px',
                cursor: 'pointer !important',
                borderRadius: '3px',
                border: theme => `solid 1px ${theme.palette.text.disabled}`,
                '&:hover': {
                  boxShadow: '0 0 2px 2px #849abb'
                }
            }}>
            <RenderIcon icon={x} enabled />
          </Box>))}
        </Box>
      </DialogContent>
      <DialogActions sx={{p: 2}}>
        <Button variant="outlined" onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
