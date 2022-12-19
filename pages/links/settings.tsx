import { GetServerSideProps, NextPage } from "next";
import * as DomainHandler from "../../handlers/domains";
import * as UserHandler from "../../handlers/users";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { IntlProvider } from "react-intl";
import React, { useState } from "react";
import { MAIN_CONFIG } from "../../consts";
import { themeConfig } from "../../utils/theme";
import SettingsDomain from "../../components/link/SettingsDomain";
import AppBar from "../../components/AppBar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import requestIp from "request-ip";

// @ts-ignore
const SettingsPage: NextPage = ({ domains, realIp }) => {
  const [mainConfig, setMainConfig] = useState(MAIN_CONFIG);
  const [messages, setMessages] = useState(undefined);
  const { locale, theme } = mainConfig;
  // @ts-ignore
  const mainTheme = createTheme(themeConfig(theme));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container>
        <Grid container spacing={2}>
          {domains &&
            <Grid item xs={12}>
              <SettingsDomain realIp={realIp} domains={JSON.parse(domains)}
                              user={{}}/>
            </Grid>
          }
        </Grid>
      </Container>
    </Box>

  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = { id: "" };
  const domains: any[] = [];//await DomainHandler.list({ userId: user.id });
  return {
    props: {
      domains: JSON.stringify(domains),
      realIp: requestIp.getClientIp(req),
      revalidate: 10,
    },
  };
};

export default SettingsPage;
