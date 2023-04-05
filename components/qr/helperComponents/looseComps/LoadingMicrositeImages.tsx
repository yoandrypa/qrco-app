import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadingMicrositeImages() {
  return (
    <Box sx={{width: '100%', position: 'absolute', mt: {xs: '32px', sm: undefined}}}>
      <Box sx={{display: 'flex', justifyContent: 'right'}}>
        <CircularProgress size={20} sx={{mr: '5px', color: theme => theme.palette.text.disabled}} />
        <Box sx={{
          display: 'flex',
          flexDirection: {xs: 'column', sm: 'row'},
          color: theme => theme.palette.text.disabled
        }}>
          <Typography sx={{fontSize: 'small', fontWeight: 'bold'}}>Loading images data.</Typography>
          <Typography sx={{fontSize: 'small', ml: {xs: 0, sm: '5px'}}}>{'Please wait...'}</Typography>
        </Box>
      </Box>
    </Box>
  )
}
