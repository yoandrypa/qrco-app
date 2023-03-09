import React from "react";
import session from "@ebanux/ebanux-utils/sessionStorage";

import { useRouter } from "next/router";

import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import Box from "@mui/material/Box";

import MainMenu from "../menus/MainMenu";
import ButtonMyQrLinks from "../menus/MainMenu/ButtonMyQrLinks";
import ButtonCreateQrLinks from "../menus/MainMenu/ButtonCreateQrLinks";

import { onLogin } from "../menus/MainMenu/MenuItemLogin";

export default function RenderButton() {
  const router = useRouter();

  if (session.isAuthenticating) return null;

  if (!session.isAuthenticated) {
    return (
      <Button
        startIcon={<LoginIcon />}
        onClick={onLogin}
        variant="contained"
        sx={{ height: "28px", mr: "5px", my: "auto" }}>
        {"Login"}
      </Button>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      {router.pathname === '/' ? <ButtonCreateQrLinks /> : <ButtonMyQrLinks />}
      <MainMenu />
    </Box>
  );
}
