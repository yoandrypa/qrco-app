import {useContext} from "react";
import session from "@ebanux/ebanux-utils/sessionStorage";

import {useRouter} from "next/router";

import Box from "@mui/material/Box";

import MainMenu from "../menus/MainMenu";
import AdminMenu from "../menus/AdminMenu";
import ButtonLogin from "../menus/MainMenu/ButtonLogin";
import ButtonMyQrLynks from "../menus/MainMenu/ButtonMyQrLynks";
import ButtonCreateQrLynks from "../menus/MainMenu/ButtonCreateQrLynks";
import Context from "../context/Context";

interface ShowingProps {
  showingDetails?: any;
  setShowingDetails?: (item: any) => void;
}

function OutMenuButton({showingDetails, setShowingDetails}: ShowingProps) {
  const router = useRouter();

  if (!session.isAuthenticated) return <ButtonLogin />;

  return (router.pathname === '/' && showingDetails === undefined) ? <ButtonCreateQrLynks /> :
    <ButtonMyQrLynks setShowingDetails={setShowingDetails} />;
}

export default function WideScreenMenu() {
  // @ts-ignore
  const {showingDetails, setShowingDetails} = useContext(Context);

  if (session.isAuthenticating) return null;

  return (
    <Box sx={{ display: "flex" }}>
      <OutMenuButton showingDetails={showingDetails} setShowingDetails={showingDetails === undefined ? undefined : setShowingDetails} />
      <MainMenu />
      <AdminMenu />
    </Box>
  );
}
