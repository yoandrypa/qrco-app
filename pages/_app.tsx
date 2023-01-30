import { createTheme, StyledEngineProvider, ThemeProvider } from "@mui/material/styles";

import type { AppProps } from "next/app";
import {useEffect, useState} from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

import AppContextProvider from "../components/context/AppContextProvider";
import MainHandler from "../components/MainHandler";
import PleaseWait from "../components/PleaseWait";
import { MAIN_CONFIG } from "../consts";
import { themeConfig } from "../utils/theme";
import "../styles/globals.css";

const Claimer = dynamic(() => import("../components/claimer/Claimer"));

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  const [mainConfig] = useState(MAIN_CONFIG);
  const [isEmbedded, setIsEmbedded] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

  const { theme } = mainConfig;
  // @ts-ignore
  const mainTheme = createTheme(themeConfig(theme));

  useEffect(() => {
    if (window.top !== window) {
      setIsEmbedded(true);
    } else {
      setDone(true);
    }
  }, []);

  if (isEmbedded) {
    return <Claimer code="" embedded />;
  }

  if (!done) {
    return <PleaseWait />;
  }

  return (
    <>
      <Head>
        <title>QRLynk | Pro QR codes</title>
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
