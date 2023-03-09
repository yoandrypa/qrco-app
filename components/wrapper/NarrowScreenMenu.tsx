import React from "react";
import { useRouter } from "next/router";

import session from "@ebanux/ebanux-utils/sessionStorage";

import Box from "@mui/material/Box";
import MainMenu from "../menus/MainMenu";
import MenuItemCreateQrLynks from "../menus/MainMenu/MenuItemCreateQrLynks";
import MenuItemMyQrLynks from "../menus/MainMenu/MenuItemMyQrLynks";
import ButtonLogin from "../menus/MainMenu/ButtonLogin";

function OutMenuButton() {
  return (!session.isAuthenticated) ? <ButtonLogin /> : null;
}

export default function NarrowScreenMenu() {
  const router = useRouter();

  const renderMenuItems = () => {
    if (!session.isAuthenticated) return null;

    return router.pathname === "/" ? <MenuItemCreateQrLynks /> : <MenuItemMyQrLynks />;
  }

  if (session.isAuthenticating) return null;

  return (
    <Box sx={{ display: "flex" }}>
      <OutMenuButton />
      <MainMenu>{renderMenuItems()}</MainMenu>
    </Box>
  );
}
