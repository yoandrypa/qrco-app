import {ChangeEvent, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import {TextField} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

interface CustomNewSectProps {
  emptyValue: string;
  setEmptyValue: Function;
  handleCloseDlg: () => {};
  handleAdd: (item?: string) => {};
}

export default function CustomNewSection({emptyValue, setEmptyValue, handleAdd, handleCloseDlg}: CustomNewSectProps) {
  return (
    <Dialog onClose={handleCloseDlg} open={true}>
      <DialogContent>
        <Typography sx={{mb: 2}}>{'Enter the section description:'}</Typography>
        <TextField
          autoFocus
          fullWidth
          value={emptyValue}
          size="small"
          label="Section description"
          onChange={(event: ChangeEvent<HTMLInputElement>) => setEmptyValue(event.target.value)}/>
      </DialogContent>
      <DialogActions sx={{width: 'calc(100% - 16px)', mb: 1}}>
        <Button variant="outlined" disabled={!emptyValue.trim().length} onClick={() => handleAdd()}>Ok</Button>
        <Button variant="outlined" onClick={handleCloseDlg}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
