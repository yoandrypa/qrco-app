import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import {ReactNode} from "react";

interface RenderPreviewDrawerProps {
  setOpenPreview: (open: boolean) => {};
  children: ReactNode;
  height: number;
  autoHeight?: boolean;
  minWidth?: string;
  title?: string;
  border?: number;
}

export default function RenderPreviewDrawer({autoHeight, setOpenPreview, children, height, minWidth, title, border}: RenderPreviewDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open
      onClose={() => setOpenPreview(false)}
      sx={{'& .MuiPaper-root': {
        height: !autoHeight ? `${height}px` : 'auto',
        pb: !autoHeight ? 0 : '10px',
        borderRadius: `5px 0 0 ${border || 5}px`,
        top: `calc(50% - ${Math.ceil(height / 2)}px)`
      }
    }}>
      <Box sx={{minWidth: minWidth || '300px'}}>
        <Box sx={{width: '100%', height: '40px', background: theme => theme.palette.primary.main, mb: '10px', display: 'flex', justifyContent: 'space-between'}}>
          <Typography sx={{fontWeight: 'bold', color: '#fff', pt: '3px', pl: 2}} variant="h6">{title || 'Sample'}</Typography>
          <CloseIcon sx={{
            color: '#fff', mt: '8px', mr: '5px', cursor: 'pointer', background: '#ffffff21', borderRadius: '50%'
          }} onClick={() => setOpenPreview(false)} />
        </Box>
        {children}
      </Box>
    </Drawer>
  );
}
