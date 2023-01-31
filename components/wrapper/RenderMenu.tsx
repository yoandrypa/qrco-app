import {MouseEvent, useCallback, useState} from "react";
import IconButton from "@mui/material/IconButton";
import LoginIcon from "@mui/icons-material/Login";
import Typography from "@mui/material/Typography";
import QrCodeIcon from "@mui/icons-material/QrCode";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LogoutIcon from "@mui/icons-material/Logout";

import {useRouter} from "next/router";

import dynamic from "next/dynamic";

const MenuIcon = dynamic(() => import("@mui/icons-material/Menu"));
const Menu = dynamic(() => import("@mui/material/Menu"));
const MenuItem = dynamic(() => import("@mui/material/MenuItem"));
const Divider = dynamic(() => import("@mui/material/Divider"));

interface MenuProps {
  userInfo?: any;
  handleLogin: () => void;
  handleNavigation: () => void;
  handleLogout: () => void;
}

export default function RenderMenu({userInfo, handleLogin, handleNavigation, handleLogout}: MenuProps) {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const router = useRouter();

  const handleOpenNavMenu = useCallback((event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  }, []);

  return (
    <>
      <IconButton
        size="large"
        aria-label="responsive-user-menu"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        open={anchorElNav !== null}
        onClose={() => setAnchorElNav(null)}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        {!userInfo && (
          <MenuItem key="loginMenuItem" onClick={handleLogin}>
            <LoginIcon color="primary" />
            <Typography textAlign="center">{"Login"}</Typography>
          </MenuItem>
        )}
        {userInfo && (
          <MenuItem key="navigateMenuItem" onClick={handleNavigation}>
            {router.pathname === "/" ? <QrCodeIcon color="primary" /> : <FirstPageIcon color="primary" />}
            <Typography textAlign="center">{router.pathname === "/" ? "Create QR Link" : "My QR Links"}</Typography>
          </MenuItem>
        )}
        {userInfo && <Divider />}
        {userInfo && (
          <MenuItem key="logoutMenuItem" onClick={handleLogout}>
            <LogoutIcon color="primary" />
            <Typography textAlign="center">{"Logout"}</Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
