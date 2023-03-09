import React from "react";
import session from "@ebanux/ebanux-utils/sessionStorage";

import { useRouter } from "next/router";

import Box from "@mui/material/Box";

import MainMenu from "../menus/MainMenu";
import ButtonLogin from "../menus/MainMenu/ButtonLogin";
import ButtonMyQrLinks from "../menus/MainMenu/ButtonMyQrLinks";
import ButtonCreateQrLinks from "../menus/MainMenu/ButtonCreateQrLinks";

function OutMenuButton() {
  const router = useRouter();

  if (!session.isAuthenticated) return <ButtonLogin />;

  return (router.pathname === '/') ? <ButtonCreateQrLinks /> : <ButtonMyQrLinks />;
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
