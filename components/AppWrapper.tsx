import {
  ReactElement,
  ReactNode,
  cloneElement,
  useCallback,
  useState,
  MouseEvent,
  useEffect
} from "react";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import QrCodeIcon from "@mui/icons-material/QrCode";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import useMediaQuery from "@mui/material/useMediaQuery";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

import { useRouter } from "next/router";
import Link from "next/link";

import { PARAM_QR_TEXT, QR_TYPE_ROUTE } from "./qr/constants";
import RenderNewQrButton from "./renderers/RenderNewQrButton";
import CountDown from "./countdown/CountDown";
import { get as getUser } from "../handlers/users"; // @ts-ignore
import session from "@ebanux/ebanux-utils/sessionStorage"; // @ts-ignore
import { startAuthorizationFlow } from "@ebanux/ebanux-utils/auth";

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
  setLoading?: (loading: boolean) => void;
  setRedirecting?: (redirecting: boolean) => void;
  setIsTrialMode?: (isTrialMode: boolean) => void;
  isTrialMode?: boolean;
}

export default function AppWrapper(props: AppWrapperProps) {
  const {
    children, userInfo, handleLogout, clearData, setLoading, setIsTrialMode, mode, isTrialMode, setRedirecting
  } = props;

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [startTrialDate, setStartTrialDate] = useState<number | string | Date | null>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = useCallback(() => {
    setAnchorElNav(null);
  }, []);

  const beforeLogout = () => {
    if (handleLogout) {
      if (setIsTrialMode) {
        setIsTrialMode(false);
      }
      setStartTrialDate(null);
      handleLogout();
    }
  };

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

    setAnchorElNav(null);

    if (setRedirecting && !isInListView) { setRedirecting(true); }
    if (clearData !== undefined) { clearData(false, isEdit || !isInListView); }
    handleLoading();
    const navigationOptions = { pathname: !isEdit && isInListView ? QR_TYPE_ROUTE : "/", query: {} };
    if (isEdit) { //@ts-ignore
      navigationOptions.query = { mode };
    }

    router.push(navigationOptions, isInListView ? QR_TYPE_ROUTE : "/",
      { shallow: true }).then(() => {
        handleLoading(false);
        if (setRedirecting) { setRedirecting(false); }
      });
  }, [router.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (userInfo) {
      const fetchUser = async () => {
        return await getUser(userInfo.cognito_user_id);
      };

      fetchUser().then(profile => {//@ts-ignore
        if (profile?.createdAt !== null && !profile?.customerId) {//(!profile?.customerId || profile?.subscriptionData?.status !== "active")) {
          // @ts-ignore
          setIsTrialMode(true); //@ts-ignore
          setStartTrialDate(profile.createdAt);
        } else { // @ts-ignore
          setIsTrialMode(false); //@ts-ignore
          setStartTrialDate(null);
        }
      }).catch(console.error);
    }
  }, [userInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <CssBaseline />
      {handleLogout !== undefined && !router.query.login && (<ElevationScroll>
        <AppBar component="nav" sx={{ background: "#fff", height }}>
          <Container sx={{ my: "auto" }}>
            <Toolbar sx={{ "&.MuiToolbar-root": { px: 0 }, display: "flex", justifyContent: "space-between", color: theme => theme.palette.text.primary }}>
              <Link href={{ pathname: !userInfo ? QR_TYPE_ROUTE : "/" }}>
                <Box component="img" alt="EBANUX" src="/logo.svg" sx={{ width: "160px", cursor: "pointer" }} />
              </Link>
              <Box sx={{ display: "flex" }}>
                {router.query[PARAM_QR_TEXT] === undefined && (<>
                  {isWide ? (<>
                    {!userInfo ? (
                      <Button
                        startIcon={<LoginIcon />}
                        onClick={handleLogin}
                        variant="contained"
                        sx={{ height: "28px", mr: "5px", my: "auto" }}>
                        {"Login"}
                      </Button>
                    ) : (
                      <Box sx={{ display: "flex" }}>
                        <RenderNewQrButton pathname={router.pathname} handleNavigation={handleNavigation} />
                        <Button
                          startIcon={<LogoutIcon />}
                          onClick={beforeLogout}
                          variant="contained"
                          sx={{ height: "28px", ml: "10px", my: "auto" }}>
                          {"Logout"}
                        </Button>
                      </Box>
                    )}
                  </>) : (<>
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
                      onClose={handleCloseNavMenu}
                      sx={{ display: { xs: "block", md: "none" } }}
                    >
                      {!userInfo && (
                        <MenuItem key="loginMenuItem" onClick={handleLogin}>
                          <LoginIcon />
                          <Typography textAlign="center">{"Login"}</Typography>
                        </MenuItem>
                      )}
                      {userInfo && (
                        <MenuItem key="navigateMenuItem" onClick={handleNavigation}>
                          {router.pathname === "/" ? <QrCodeIcon /> : <FirstPageIcon />}
                          <Typography textAlign="center">{router.pathname === "/" ? "Create QR Link" : "My QR Links"}</Typography>
                        </MenuItem>
                      )}
                      {userInfo && <Divider />}
                      {userInfo && (
                        <MenuItem key="logoutMenuItem" onClick={beforeLogout}>
                          <LogoutIcon />
                          <Typography textAlign="center">{"Logout"}</Typography>
                        </MenuItem>
                      )}
                    </Menu>
                  </>)}
                </>)}
                {isTrialMode && startTrialDate && <CountDown startDate={startTrialDate} />}
              </Box>
            </Toolbar>
            {/*{isTrialMode && startTrialDate && <CountDown startDate={startTrialDate} />}*/}
          </Container>
        </AppBar>
      </ElevationScroll>)}
      <Container sx={{ width: "100%" }}>
        <Box sx={{ height }} /> {/* Aims to fill the header's gap */}
        <Box sx={{ mx: "auto", minHeight: `calc(100vh - ${router.pathname === '/' ? 140 : 135}px)` }}>
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
          </Box>)}
      </Container>
    </>
  );
}
