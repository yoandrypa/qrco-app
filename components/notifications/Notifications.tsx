import { forwardRef } from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Portal from '@mui/material/Portal';
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { keyframes } from '@emotion/react';

const indeterminatedKeyframes = keyframes({
  '0%': { left: '-35%', right: '100%' },
  '100%': { left: '0%', right: '0%' }
});

const Progress = styled(LinearProgress)((props) => ({
  // @ts-ignore
  '& .MuiLinearProgress-bar1Indeterminate': { width: 'auto', animation: `${indeterminatedKeyframes} ${props.time}s linear forwards` },
  '& .MuiLinearProgress-bar2Indeterminate': { display: 'none' }
}));

const Alert = forwardRef(function Alert(props, ref) {
  // @ts-ignore
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface NotificationsProps {
  severity?: "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined;
  message: string;
  autoHideDuration?: number | undefined;
  onClose: () => void;
  vertical?: "bottom" | "top" | undefined;
  horizontal?: "left" | "right" | "center" | undefined;
  title?: string | undefined;
  showProgress?: boolean;
}

// @ts-ignore
const Notifications = ({severity, message, showProgress, autoHideDuration, onClose, vertical, horizontal, title}: NotificationsProps) => (
  <Portal>
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar
        open={true}
        anchorOrigin={{ vertical: vertical || 'top', horizontal: horizontal || 'center' }}
        autoHideDuration={autoHideDuration || 5000}
        onClose={onClose}
        disableWindowBlurListener={Boolean(autoHideDuration)}>
        {/* @ts-ignore */}
        <Alert onClose={onClose} severity={severity || 'error'} sx={{ width: '100%' }}>
          {title && <AlertTitle>{title}</AlertTitle>}
          {message}
          {showProgress && (
            <Progress
              color={severity || 'error'}
              // @ts-ignore
              time={((autoHideDuration || 5000) / 1000)}
              variant="indeterminate"
              sx={{ mr: '-40px', mt: 1, width: '100%' }}
            />
          )}
        </Alert>
      </Snackbar>
    </Stack>
  </Portal>
);

export default Notifications;
