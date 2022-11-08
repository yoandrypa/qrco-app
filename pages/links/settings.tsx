import { GetServerSideProps, NextPage } from "next";
import * as DomainHandler from "../../handlers/domains";
import * as UserHandler from "../../handlers/users";
import components from "../../libs/aws/components";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { IntlProvider } from "react-intl";
import { UserContext } from "../../utils/contexts";
import { Authenticator } from "@aws-amplify/ui-react";
import React, { useState } from "react";
import { MAIN_CONFIG } from "../../consts";
import { themeConfig } from "../../utils/theme";
import SettingsDomain from "../../components/link/SettingsDomain";
import { Amplify } from "aws-amplify";
import awsExports from "../../libs/aws/aws-exports";
import AppBar from "../../components/AppBar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import LinksCreateForm from "../../components/link/LinksCreateForm";
import LinksTable from "../../components/link/LinksTable";
import Box from "@mui/material/Box";
import DomainsTable from "../../components/link/DomainsTable";
import requestIp from "request-ip";

Amplify.configure(awsExports);

// @ts-ignore
const SettingsPage: NextPage = ({ domains, realIp }) => {
  const [mainConfig, setMainConfig] = useState(MAIN_CONFIG);
  const [messages, setMessages] = useState(undefined);
  const { locale, theme } = mainConfig;
  // @ts-ignore
  const mainTheme = createTheme(themeConfig(theme));

  return (
    <Authenticator components={components}>
      {({ signOut, user }) => (
        <ThemeProvider theme={mainTheme}>
          {/*@ts-ignore*/}
          <IntlProvider locale={locale} messages={messages}>
            {/*@ts-ignore*/}
            <UserContext.Provider value={{ user, signOut }}>
              <Box sx={{ flexGrow: 1 }}>
                <UserContext.Consumer>
                  {({ signOut }) => <AppBar signOut={signOut} />}
                </UserContext.Consumer>
                <br />
                <Container>
                  <Grid container spacing={2}>
                    {domains &&
                      <Grid item xs={12}>
                        <SettingsDomain realIp={realIp} domains={JSON.parse(domains)} user={user} />
                      </Grid>
                    }
                  </Grid>
                </Container>
              </Box>
            </UserContext.Provider>
          </IntlProvider>
        </ThemeProvider>
      )}
    </Authenticator>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  let cookies = {};
  for (const [key, value] of Object.entries(req.cookies)) {
    // @ts-ignore
    cookies[key.split(".").pop()] = value;
  }
  // @ts-ignore
  if (!cookies.userData) {
    return {
      props: {
        domains: JSON.stringify([])
      }
    };
  }
  // @ts-ignore
  const userData = JSON.parse(cookies.userData as string);
  const userId = userData.UserAttributes[0].Value;
  let user = await UserHandler.get(userId);
  if (!user) {
    user = await UserHandler.create({ id: userId });
  }
  const domains = await DomainHandler.list({ userId: user.id });
  return {
    props: {
      domains: JSON.stringify(domains),
      realIp: requestIp.getClientIp(req),
      revalidate: 10
    }
  };
};

export default SettingsPage;
