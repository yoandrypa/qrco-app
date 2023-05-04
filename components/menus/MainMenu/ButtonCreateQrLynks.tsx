import { useRouter } from "next/router";

import QrCodeIcon from "@mui/icons-material/QrCode";

import classes from "./classes.sx";
import Button from "@mui/material/Button";

import { startWaiting, releaseWaiting } from "../../Waiting";

interface NavButtonProps {
  light?: boolean;
}

export default function ButtonCreateQrLynks({ light }: NavButtonProps) {
  const router = useRouter();
  const { navButton } = classes;

  const onClick = () => {
    startWaiting();
    router.push('/qr/type').finally(releaseWaiting);
  }

  return (
    <Button variant="outlined"
            startIcon={<QrCodeIcon />}
            sx={navButton}
            color={light ? 'info' : 'primary'}
            onClick={onClick}
    >
      {'Create'}
    </Button>
  );
}
