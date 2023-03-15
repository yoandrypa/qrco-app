import {createTheme, StyledEngineProvider, ThemeProvider} from "@mui/material/styles";

import type {AppProps} from "next/app";
import {useState} from "react";
import Head from "next/head";

import AppContextProvider from "../components/context/AppContextProvider";
import MainHandler from "../components/MainHandler";
import {MAIN_CONFIG} from "../consts";
import {themeConfig} from "../utils/theme";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  const [mainConfig] = useState(MAIN_CONFIG);

  const { theme } = mainConfig;
  // @ts-ignore
  const mainTheme = createTheme(themeConfig(theme));

  return (
    <>
      <Head>
        <title>QRLynk | Smart QR code + Landing Page</title>
        <link rel="icon" href="/qlIcon.png" />
      </Head>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={mainTheme}>
          <AppContextProvider>
            <MainHandler Component={Component} pageProps={pageProps} router={router} />
          </AppContextProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  );
};

export default MyApp;
