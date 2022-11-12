import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface PleaseWaitProps {
  redirecting?: boolean;
  hidePleaseWait?: boolean;
}

export default function PleaseWait({redirecting, hidePleaseWait}: PleaseWaitProps) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      }}
    >
      {!hidePleaseWait && <Typography>{'Please wait...'}</Typography>}
      {redirecting && <Typography>{'Redirecting...'}</Typography>}
    </Box>
  );
}
