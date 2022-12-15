import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";

interface RenderConfirmProps {
  handleCancel: () => void;
  handleOk: () => void;
  message: string;
  confirmationMsg?: string;
  title?: string;
  yesMsg?: string;
  noMsg?: string;
}

export default function RenderConfirmDlg({title, handleOk, handleCancel, message, yesMsg, noMsg, confirmationMsg}: RenderConfirmProps) {
  return (
    <Dialog open={true}>
      <DialogTitle>{title || 'Confirm'}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
        {confirmationMsg && <Typography>{confirmationMsg}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOk} variant="outlined">{yesMsg || 'Ok'}</Button>
        <Button autoFocus onClick={handleCancel} variant="outlined">{noMsg || 'Cancel'}</Button>
      </DialogActions>
    </Dialog>
  );
}
