import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

import {ProcessHanldlerType} from "../types/types";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

interface ProcessHandlerProps {
  process: ProcessHanldlerType[];
  handleCommand: Function;
}

const ProcessHandler = ({process, handleCommand}: ProcessHandlerProps) => {
  const isDone = process.some((x: ProcessHanldlerType) => x.value === 'done');
  const isError = process.some((x: ProcessHanldlerType) => x.status === false);

  if (isDone && !isError) {
    handleCommand();
  }

  return (
    <Dialog open={true} disableEscapeKeyDown>
      <DialogContent sx={{ width: '450px' }}>
        {!isDone ? <Typography>Please, wait...</Typography> :
          <Typography>{`Completed${isError ? ' with errors' : ''}`}</Typography>}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {process.filter((x: ProcessHanldlerType) => x.value !== 'done').map((x: ProcessHanldlerType, index: number) => {
            return (
              <>
                <Grid item xs={10} key={`key${index}`}>
                  <Typography>{`${x.value}${x.status !== undefined ? '' : '...'}`}</Typography>
                </Grid>
                <Grid item xs={2} sx={{textAlign: 'right'}} key={`sts${index}`}>
                  {x.status === undefined ? <CircularProgress color="primary" size={25}/> : (
                    x.status ?
                      <Typography
                        sx={{fontWeight: 'bold', color: theme => theme.palette.success.dark}}>{'Success'}</Typography> :
                      <Typography
                        sx={{fontWeight: 'bold', color: theme => theme.palette.error.dark}}>{'Failed'}</Typography>
                  )}
                </Grid>
              </>
            )
          })}
        </Grid>
      </DialogContent>
      {isDone && isError && (
        <DialogActions sx={{p: 2}}>
          <Button variant="outlined" onClick={() => handleCommand(isError)}>Close</Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default ProcessHandler;
