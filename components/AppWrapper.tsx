import {ReactElement, ReactNode, cloneElement, useCallback, useState, MouseEvent} from 'react';

import useScrollTrigger from '@mui/material/useScrollTrigger';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import QrCodeIcon from '@mui/icons-material/QrCode';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import useMediaQuery from "@mui/material/useMediaQuery";
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import {useRouter} from 'next/router';
import Link from 'next/link'

import {PARAM_QR_TEXT, QR_TYPE_ROUTE} from "./qr/constants";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import RenderNewQrButton from "./renderers/RenderNewQrButton";

interface Props {
  window?: () => Window;
  children: ReactElement;
}

const height = '95px';

function ElevationScroll({ children, window }: Props) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined
  });

  return cloneElement(children, {
    elevation: trigger ? 5 : 0
  });
}

interface AppWrapperProps {
  children: ReactNode;
  userInfo?: any;
  handleLogout?: () => void;
  clearData?: (clear: true) => void;
  setLoading?: (loading: boolean) => void;
}

export default function AppWrapper(props: AppWrapperProps) {
  const { children, userInfo, handleLogout, clearData, setLoading } = props;

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = useCallback(() => {
    setAnchorElNav(null);
  }, []);

  const isWide = useMediaQuery('(min-width:600px)', { noSsr: true });
  const router = useRouter();

  const handleLoading = useCallback((loading?: boolean) => {
    if (setLoading !== undefined) {
      setLoading(loading !== undefined ? loading : true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = useCallback(() => {
    handleLoading();
    router.push({ pathname: '/', query: { login: true } }, '/')
      .then(() => {
        handleLoading(false);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNavigation = useCallback(() => {
    if (clearData !== undefined) {
      clearData(true);
    }
    handleLoading();
    router.push((router.pathname === '/' ? QR_TYPE_ROUTE : '/'), undefined, { shallow: true }).then(() => {
      handleLoading(false);
    });
  }, [router.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <CssBaseline />
      {handleLogout !== undefined && !router.query.login && (<ElevationScroll >
        <AppBar component="nav" sx={{ background: '#fff', height }}>
          <Container sx={{ my: 'auto' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', color: theme => theme.palette.text.primary }}>
              <Link href={{ pathname: !userInfo ? QR_TYPE_ROUTE : '/' }}>
                <Box sx={{ display: 'flex', cursor: 'pointer' }}>
                  <Box component="img" alt="EBANUX" src="/ebanuxQr.svg" sx={{ width: '40px' }} />
                  <Typography sx={{ my: 'auto', ml: '5px', fontSize: '28.8px', fontWeight: 'bold' }}>The QR Link</Typography>
                </Box>
              </Link>
              {router.query[PARAM_QR_TEXT] === undefined && (<>
                {isWide ? (<>
                  {!userInfo ? (
                    <Button
                      startIcon={<LoginIcon />}
                      onClick={handleLogin}
                      variant="contained"
                      sx={{ height: '28px', mr: '5px', my: 'auto' }}>
                      {'Login'}
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex' }}>
                      <RenderNewQrButton pathname={router.pathname} handleNavigation={handleNavigation} />
                      <Button
                        startIcon={<LogoutIcon />}
                        onClick={handleLogout}
                        variant="contained"
                        sx={{ height: '28px', ml: '10px', my: 'auto' }}>
                        {'Logout'}
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
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    open={anchorElNav !== null}
                    onClose={handleCloseNavMenu}
                    sx={{ display: { xs: 'block', md: 'none' } }}
                  >
                    {!userInfo && (
                      <MenuItem key="loginMenuItem" onClick={handleLogin}>
                        <LoginIcon />
                        <Typography textAlign="center">{'Login'}</Typography>
                      </MenuItem>
                    )}
                    {userInfo && (
                      <MenuItem key="navigateMenuItem" onClick={handleNavigation}>
                        {router.pathname === '/' ? <QrCodeIcon /> : <FirstPageIcon />}
                        <Typography textAlign="center">{router.pathname === '/' ? 'Create QR' : 'My QRs'}</Typography>
                      </MenuItem>
                    )}
                    {userInfo && <Divider/>}
                    {userInfo && (
                      <MenuItem key="logoutMenuItem" onClick={handleLogout}>
                        <LogoutIcon />
                        <Typography textAlign="center">{'Logout'}</Typography>
                      </MenuItem>
                    )}
                  </Menu>
                </>)}
              </>)}
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>)}
      <Container sx={{ width: '100%' }}>
        <Box sx={{ height }}/> {/* Aims to fill the header's gap */}
        <Box sx={{ mx: 'auto', minHeight: 'calc(100vh - 145px)' }}>
          {children}
        </Box>
        {handleLogout !== undefined && !router.query.login && (<Box sx={{ height: '40px', mt: '10px', display: 'flex', justifyContent: 'space-betweem' }}>
          <Box sx={{ display: 'flex', width: '100%' }}>
            <Typography sx={{ my: 'auto', display: { sm: 'block', xs: 'none' } }}>
              {'Powered by'}
            </Typography>
            <Box component="img" alt="EBANUX" src="/ebanux.svg" sx={{ width: '95px', mt: '-2px', ml: '7px' }} />
          </Box>
          {userInfo && (
            <Typography sx={{ my: 'auto', color: theme => theme.palette.text.disabled, fontSize: 'small', display: 'inline-flex' }}>
              {userInfo.username.replace(/@.*$/,"")}
              <AccountBoxIcon sx={{ mt: '-1px' }} />
            </Typography>
          )}
        </Box>)}
      </Container>
    </>
  );
}
