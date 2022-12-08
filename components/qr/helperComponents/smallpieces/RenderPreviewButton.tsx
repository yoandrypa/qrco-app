import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Button from "@mui/material/Button";

interface RenderPreviewButtonProps {
  setOpenPreview: (open: boolean) => {};
  message: string;
}

export default function RenderPreviewButton({setOpenPreview, message}: RenderPreviewButtonProps) {
  return (
    <Button
      onClick={() => setOpenPreview(true)}
      variant="contained"
      sx={{
        position: 'fixed',
        bottom: '25px',
        right: '-5px',
        background: theme => theme.palette.primary.dark
      }}
      startIcon={<OpenInNewIcon />}>
      {message}
    </Button>
  );
}
