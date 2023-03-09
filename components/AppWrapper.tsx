import React, { cloneElement, ReactElement, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Link from "next/link";

import session from "@ebanux/ebanux-utils/sessionStorage";
import { startAuthorizationFlow } from "@ebanux/ebanux-utils/auth";
import { PARAM_QR_TEXT, QR_TYPE_ROUTE } from "./qr/constants";
import { loadSubscription } from "../libs/utils/request";

import RenderSupport from "./wrapper/RenderSupport";
import Context from "./context/Context";
import ConfirmDialog from "./ConfirmDialog";
import Notification from "./Notification";
import Waiting from "./Waiting";
import messaging from "@ebanux/ebanux-utils/messaging";

const CountDown = dynamic(() => import("./countdown/CountDown"));
const RenderButton = dynamic(() => import("./wrapper/RenderButton"));
const RenderMenu = dynamic(() => import("./wrapper/RenderMenu"));

const mSubscriptions: any[] = [];

interface Props {
  window?: () => Window;
  children: ReactElement;
}

const height = "95px";

function ElevationScroll({ children, window }: Props) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });
  return cloneElement(children, { elevation: trigger ? 5 : 0 });
}

interface AppWrapperProps {
  mode?: string;
  children: ReactNode;
  userInfo?: any;
  handleLogout?: () => void;
  clearData?: (keepType?: boolean, doNot?: boolean) => void;
  setRedirecting?: (redirecting: boolean) => void;
  setIsFreeMode?: (isFreeMode: boolean) => void;
  isTrialMode?: boolean;
}

export default function AppWrapper(props: AppWrapperProps) {
  const {
    children, userInfo, handleLogout, clearData, setIsFreeMode: setIsFreeMode, mode, isTrialMode: isFreeMode, setRedirecting
  } = props;

  const [startTrialDate, setStartTrialDate] = useState<number | string | Date | null>(null);
  const [freeLimitReached, setFreeLimitReached] = useState<boolean>(false)

  // @ts-ignore
  const { subscription, setSubscription, setLoading } = useContext(Context);

  const beforeLogout = () => {
    if (handleLogout) {
      setIsFreeMode?.call(null, false);
      setStartTrialDate(null);
      handleLoading(true);
      handleLogout();
    }
  }

  const isWide = useMediaQuery("(min-width:600px)", { noSsr: true });
  const router = useRouter();

  const handleLoading = useCallback((loading?: boolean) => {
    if (setLoading !== undefined) {
      setLoading(loading !== undefined ? loading : true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = useCallback(() => {
    startAuthorizationFlow();
  }, []);

  const handleNavigation = useCallback(() => {
    const isInListView = router.pathname === "/";
    const isEdit = !isInListView && mode === "edit";

    console.log(router.pathname, mode, isEdit, isInListView);

    if (setRedirecting && !isInListView) setRedirecting(true);
    if (clearData !== undefined) {
      clearData(false, isEdit || !isInListView);
    }
    handleLoading();
    const navigationOptions = { pathname: !isEdit && isInListView ? QR_TYPE_ROUTE : "/", query: {} };
    if (isEdit) { //@ts-ignore
      navigationOptions.query = { mode };
    }

    router.push(navigationOptions, isInListView ? QR_TYPE_ROUTE : "/").then(() => {
      handleLoading(false);
      if (setRedirecting) setRedirecting(false);
    });
  }, [router.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const { currentUser, isAuthenticated } = session;

    if (isAuthenticated) {
      //@ts-ignore
      if (subscription?.status !== "active") {
        setIsFreeMode?.call(null, true);
        setStartTrialDate(currentUser.localRecord.createdAt);

        // TODO: Review setFreeLimitReached
        // @ts-ignore
        // list({ userId: userInfo.cognito_user_id }).then(qrs => {
        //   // @ts-ignore
        //   if ((qrs.items as Array<any>).some((el: any) => el.isDynamic)) {
        //     setFreeLimitReached(true);
        //   }
        // });
      } else {
        setIsFreeMode?.call(null, false);
        setStartTrialDate(null);
      }
    }
  }, [subscription]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (session.isAuthenticated && !subscription) loadSubscription().then((subscription: any) => {
      setSubscription(subscription);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <CssBaseline />
      {handleLogout !== undefined && !router.query.login && (<ElevationScroll>
        <AppBar component="nav" sx={{ background: "#fff", height }}>
          <Container sx={{ my: "auto" }}>
            <Toolbar sx={{
              "&.MuiToolbar-root": { px: 0 },
              display: "flex",
              justifyContent: "space-between",
              color: theme => theme.palette.text.primary
            }}>
              <Link href={{ pathname: !userInfo ? QR_TYPE_ROUTE : "/" }}>
                <Box component="img" alt="EBANUX" src="/logo.svg" sx={{ width: "160px", cursor: "pointer" }} />
              </Link>
              <Box sx={{ display: "flex" }}>
                {router.query[PARAM_QR_TEXT] === undefined && (<>
                  {isWide ? <RenderButton /> : <RenderMenu />}
                </>)}
                {isFreeMode && <CountDown />}
              </Box>
            </Toolbar>
            {/*{isTrialMode && startTrialDate && <CountDown startDate={startTrialDate} />}*/}
          </Container>
        </AppBar>
      </ElevationScroll>)}
      <Container sx={{ width: "100%" }}>
        <Box sx={{ height }} /> {/* Aims to fill the header's gap */}
        <Box sx={{ mx: "auto", minHeight: `calc(100vh - ${router.pathname === '/' ? 140 : 135}px)` }}>
          <ConfirmDialog />
          <Notification />
          <Waiting />
          {children}
        </Box>
        {handleLogout !== undefined && !router.query.login && (
          <Box sx={{
            height: "40px",
            display: "flex",
            justifyContent: "space-betweem",
          }}>
            <Box sx={{ display: "flex", width: "100%" }}>
              <Typography sx={{ my: "auto", display: { sm: "block", xs: "none" } }}>
                {"Powered by"}
              </Typography>
              <Box component="img" alt="EBANUX" src="/ebanux.svg" sx={{ width: "95px", mt: "-2px", ml: "7px" }} />
            </Box>
            {userInfo && (
              <Typography sx={{
                my: "auto",
                color: theme => theme.palette.text.disabled,
                fontSize: "small",
                display: "inline-flex",
              }}>
                {userInfo.email.replace(/@.*$/, "")}
                <AccountBoxIcon sx={{ mt: "-1px" }} />
              </Typography>
            )}
            <RenderSupport />
          </Box>)}
      </Container>
    </>
  );
}
