import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import Box from "@mui/material/Box";
import RenderNewQrButton from "../renderers/RenderNewQrButton";
import LogoutIcon from "@mui/icons-material/Logout";

import { useRouter } from "next/router";

interface ButtonProps {
  userInfo?: any;
  handleLogout: () => void;
  handleNavigation: () => void;
  handleLogin: () => void;
}

export default function RenderButton({ userInfo, handleLogout, handleNavigation, handleLogin }: ButtonProps) {
  const router = useRouter();

  if (!userInfo) {
    return (
      <Button
        startIcon={<LoginIcon />}
        onClick={handleLogin}
        variant="contained"
        sx={{ height: "28px", mr: "5px", my: "auto" }}>
        {"Login"}
      </Button>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <RenderNewQrButton pathname={router.pathname} handleNavigation={handleNavigation} />
      <Button
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        variant="contained"
        sx={{ height: "28px", ml: "10px", my: "auto" }}>
        {"Logout"}
      </Button>
    </Box>
  );
}
