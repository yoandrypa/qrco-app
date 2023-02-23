import React, { useEffect } from "react";
import { useRouter } from "next/router";

import session from "@ebanux/ebanux-utils/sessionStorage";
import { Authenticator, authWithAuthCode } from "@ebanux/ebanux-utils/auth";

import Alert from "@mui/material/Alert";

import { startWaiting, releaseWaiting } from "../../components/Waiting";

export default function AuthCallback() {
  const router = useRouter();
  const { isAuthenticating, isAuthenticated, currentUser } = session;

  useEffect(() => {
    startWaiting();

    const callbackRoute = session.get('CALLBACK_ROUTE', '/');

    if (isAuthenticating) {
      const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
      const authCode: string | null = urlParams.get('code');

      authWithAuthCode(authCode as string).then(() => {
        router.push(callbackRoute, callbackRoute.pathname || '/').finally(() => releaseWaiting());
      }).catch((err: any) => {
        console.error(err.message);
      });
    } else if (isAuthenticated) {
      router.push(callbackRoute, callbackRoute.pathname || '/').finally(() => releaseWaiting());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isAuthenticated) return (
    <Alert severity="success" variant="outlined"> Welcome: {currentUser.name || currentUser.email}.</Alert>
  );

  return <div />
};
