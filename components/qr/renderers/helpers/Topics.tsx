import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface TopicProps {
  message: string;
  notBold?: boolean;
  top?: string;
  secMessage?: string;
}

const Topics = ({message, notBold, top, secMessage}: TopicProps) => (
  <Box sx={{ display: 'flex', mt: top || 0, mb: '3px' }}>
    <Typography sx={{fontWeight: !notBold ? 'bold' : 'normal'}}>
      {message}
    </Typography>
    {secMessage !== undefined && (
      <Typography sx={{ ml: '5px', color: theme => theme.palette.text.disabled }}>{secMessage}</Typography>
    )}
  </Box>
);

export default Topics;
