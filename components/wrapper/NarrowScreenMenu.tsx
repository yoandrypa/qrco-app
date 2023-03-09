import React from "react";
import { useRouter } from "next/router";

import session from "@ebanux/ebanux-utils/sessionStorage";

import Box from "@mui/material/Box";
import MainMenu from "../menus/MainMenu";
import MenuItemCreateQrLinks from "../menus/MainMenu/MenuItemCreateQrLinks";
import MenuItemMyQrLinks from "../menus/MainMenu/MenuItemMyQrLinks";
import ButtonLogin from "../menus/MainMenu/ButtonLogin";

function OutMenuButton() {
  return (!session.isAuthenticated) ? <ButtonLogin /> : null;
}

export default function NarrowScreenMenu() {
  const router = useRouter();

  const renderMenuItems = () => {
    if (!session.isAuthenticated) return null;

    return router.pathname === "/" ? <MenuItemCreateQrLinks /> : <MenuItemMyQrLinks />;
  }

  if (session.isAuthenticating) return null;

  return (
    <Box sx={{ display: "flex" }}>
      <OutMenuButton />
      <MainMenu>{renderMenuItems()}</MainMenu>
    </Box>
  );
}
