import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

const RenderNoUserWarning = () => (
  <Alert severity="warning" sx={{ px: 2, py: 0 }}>
    <Typography><strong>Be advised</strong>: You must <strong>log in</strong> to be able to save these changes</Typography>
  </Alert>
);

export default RenderNoUserWarning;
