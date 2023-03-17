import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

interface ErrorsDlgProps {
  errors: string[];
  handleClose: () => void;
}

export default function ErrorsDialog({errors, handleClose}: ErrorsDlgProps) {
  const {length} = errors;

  return (
    <Dialog onClose={handleClose} open={true}>
      <DialogTitle>
        {`Before moving on, solve th${length === 1 ? 'is' : `ese ${length} `} error${length === 1 ? '' : 's'}`}
      </DialogTitle>
      <DialogContent dividers sx={{maxHeight: '350px', p: '0 24px 0 0'}}>
        <ul>
          {errors.map(x => <li key={x}><Typography>{x}</Typography></li>)}
        </ul>
        {errors.some(x => x.includes('not empty')) && (
          <div style={{marginBottom: '10px', width: '100%', textAlign: 'center'}}>
            <Typography sx={{fontSize: 'small', color: theme => theme.palette.text.disabled}}>
              {'Consider removing empty sections if you don\'t need them.'}
            </Typography>
          </div>
        )}
      </DialogContent>
      <DialogActions sx={{p: 2}}>
        <Button variant="outlined" onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
