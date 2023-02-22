import React, { useEffect } from "react";
import { useRouter } from "next/router";

import session from "@ebanux/ebanux-utils/sessionStorage";
import { Authenticator, authWithAuthCode } from "@ebanux/ebanux-utils/auth";

import Alert from "@mui/material/Alert";

import { startWaiting, releaseWaiting } from "../components/Waiting";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    startWaiting();
    if (session.isAuthenticated) {
      const callbackRoute = session.get('CALLBACK_ROUTE', '/', true);

      router.push(callbackRoute, callbackRoute.pathname || '/').finally(() => {
        releaseWaiting();
      });
    } else if (session.isAuthenticating) {
      console.log(111, router.query.code, session.oauthRedirectUri);
      const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
      const authCode: string | null = urlParams.get('code');
      authWithAuthCode(authCode as string).then(() => {
        console.log(222, session.oauthRedirectUri, session.isAuthenticated);
        // window.location.replace(session.oauthRedirectUri)
      }).catch((err: any) => {
        console.error(err.message);
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <Alert severity="success" variant="outlined">Welcome</Alert>
  // return (
  //   <Authenticator>
  //     {({ user }: any) => (
  //       <Alert severity="success" variant="outlined">
  //         Welcome: {user.name || user.email}.
  //       </Alert>
  //     )}
  //   </Authenticator>
  // );
};
