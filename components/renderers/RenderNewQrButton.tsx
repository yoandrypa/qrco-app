import QrCodeIcon from "@mui/icons-material/QrCode";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import Button from "@mui/material/Button";
import { useContext } from "react";
import Context from "../context/Context";
import { QR_TYPE_ROUTE } from "../qr/constants";
import { useRouter } from "next/router";

interface NewQrButtonProps {
  pathname?: string | undefined;
  handleNavigation?: Function | undefined;
  light?: boolean;
}

interface ContextProps {
  setLoading: (loading: boolean) => void;
}

export default function RenderNewQrButton({ light, pathname, handleNavigation }: NewQrButtonProps) {
  const router = useRouter();
  // @ts-ignore
  const { setLoading }: ContextProps = useContext(Context);

  const navigation = () => {
    if (handleNavigation !== undefined) {
      handleNavigation();
    } else {
      setLoading(true);
      router.push(QR_TYPE_ROUTE, undefined, { shallow: true })
        .then(() => {
          setLoading(false);
        });
    }
  }

  return (
    <Button
      startIcon={pathname === undefined || pathname === '/' ? <QrCodeIcon /> : <FirstPageIcon />}
      sx={{ height: '28px', my: 'auto' }}
      variant="outlined"
      color={!light ? 'primary' : 'info'}
      onClick={navigation}>
      {pathname === undefined || pathname === '/' ? 'Create QR Link' : 'My QR Links'}
    </Button>
  );
}
