import type {AppProps} from "next/app";
import {useState} from "react";
import {createTheme, StyledEngineProvider, ThemeProvider} from "@mui/material/styles";
import Head from "next/head";

import {themeConfig} from "../utils/theme";

import AppContextProvider from "../components/context/AppContextProvider";
import {MAIN_CONFIG} from "../consts";

import "../styles/globals.css";

import MainHandler from "../components/MainHandler";

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  const [mainConfig] = useState(MAIN_CONFIG);

  const { theme } = mainConfig;
  // @ts-ignore
  const mainTheme = createTheme(themeConfig(theme));

  return (
    <>
      <Head>
        <title>The QR Link | Dynamic QR code</title>
        <link rel="icon" href="/ebanuxQr.svg"/>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
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
