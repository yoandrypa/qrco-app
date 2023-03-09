import React from "react";
import session from "@ebanux/ebanux-utils/sessionStorage";

import { useRouter } from "next/router";

import Box from "@mui/material/Box";

import MainMenu from "../menus/MainMenu";
import ButtonLogin from "../menus/MainMenu/ButtonLogin";
import ButtonMyQrLynks from "../menus/MainMenu/ButtonMyQrLynks";
import ButtonCreateQrLynks from "../menus/MainMenu/ButtonCreateQrLynks";

function OutMenuButton() {
  const router = useRouter();

  if (!session.isAuthenticated) return <ButtonLogin />;

  return (router.pathname === '/') ? <ButtonCreateQrLynks /> : <ButtonMyQrLynks />;
}

export default function WideScreenMenu() {
  if (session.isAuthenticating) return null;

  return (
    <Box sx={{ display: "flex" }}>
      <OutMenuButton />
      <MainMenu />
    </Box>
  );
}
