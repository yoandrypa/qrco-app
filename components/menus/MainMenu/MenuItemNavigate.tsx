import React from "react";
import { useRouter } from "next/router";

import messaging from "@ebanux/ebanux-utils/messaging";

import MenuItemMyQrLinks from "./MenuItemMyQrLinks";
import MenuItemCreateQrLinks from "./MenuItemCreateQrLinks";

export const onNavigate = () => {
  // TODO: Move handleNavigation to this method.
  messaging.emit('onNavigate');
}

export default function MenuItemNavigate() {
  const router = useRouter();

  return router.pathname === "/" ? <MenuItemCreateQrLinks /> : <MenuItemMyQrLinks />;
}