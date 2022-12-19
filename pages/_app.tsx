import type { AppProps } from "next/app";
import { useState } from "react";
import { StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import Head from "next/head";

import { IntlProvider } from "react-intl";
import { themeConfig } from "../utils/theme";

import "@aws-amplify/ui-react/styles.css";
import "../styles/globals.css";
import { useRouter } from "next/router";

import AppContextProvider from "../components/context/AppContextProvider";
import { MAIN_CONFIG } from "../consts";
import { PRIVATE_ROUTES } from "../components/qr/constants";

// @ts-ignore
import { Authenticator } from "@ebanux/ebanux-utils/auth";
import "@ebanux/ebanux-utils/styles/spinner.css";
import { setCookie } from "cookies-next";

const isAPrivateRoute = (path: string) => {
  return PRIVATE_ROUTES.some((route) => {
    return path.match(route);
  });
};

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const [mainConfig, setMainConfig] = useState(MAIN_CONFIG);
  const [messages, setMessages] = useState(undefined);
  const { locale, theme } = mainConfig;
  // @ts-ignore
  const mainTheme = createTheme(themeConfig(theme));

  if (router.pathname !== "/auth_callback") {
    setCookie("final_callback_path",
      { pathname: router.pathname, query: router.query });
  }
  return (
    <>
      <Head>
        <title>The QR Link | Dynamic QR code</title>
        <link rel="icon" href="/ebanuxQr.svg"/>
      </Head>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={mainTheme}>
          <AppContextProvider>
            <IntlProvider locale={locale} messages={messages}>
              {isAPrivateRoute(router.pathname)
                ? <Authenticator>
                  {({ user }: any) => (
                    <Component {...pageProps} user={user}/>
                  )}
                </Authenticator>
                : <Component {...pageProps} />
              }
            </IntlProvider>
          </AppContextProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  );
};

export default MyApp;