import React from "react";
import { useRouter } from "next/router";

import session from "@ebanux/ebanux-utils/sessionStorage";

import Divider from "@mui/material/Divider";
import MainMenu from "../menus/MainMenu";
import MenuItemLogin from "../menus/MainMenu/MenuItemLogin";
import MenuItemCreateQrLinks from "../menus/MainMenu/MenuItemCreateQrLinks";
import MenuItemMyQrLinks from "../menus/MainMenu/MenuItemMyQrLinks";

export default function RenderMenu() {
  const router = useRouter();

  const renderMenuItems = () => {
    if (session.isAuthenticated) return router.pathname === "/" ? <MenuItemCreateQrLinks /> : <MenuItemMyQrLinks />;

    return [
      <MenuItemLogin key="EX-MI-01"/>,
      <Divider key="EX-MI-02" />,
    ];
  }

  return <MainMenu>{renderMenuItems()}</MainMenu>;
}
