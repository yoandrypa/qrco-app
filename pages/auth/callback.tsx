import React, { useEffect } from "react";
import { useRouter } from "next/router";

import session from "@ebanux/ebanux-utils/sessionStorage";
import { authWithAuthCode } from "@ebanux/ebanux-utils/auth";

import Alert from "@mui/material/Alert";

import Context from "../../components/context/Context";
import { startWaiting, releaseWaiting } from "../../components/Waiting";

export default function AuthCallback() {
  const router = useRouter();
  const { isAuthenticating, isAuthenticated, currentUser } = session;
  // @ts-ignore
  const { setUserInfo } = React.useContext(Context);

  function onLogin() {
    const callbackRoute = session.get('CALLBACK_ROUTE', '/');
    setUserInfo(session.currentUser);
    router.push(callbackRoute, callbackRoute.pathname || '/').finally(() => releaseWaiting());
  }

  function onError(err: any) {
    console.error(err.message)
  }

  useEffect(() => {
    startWaiting();

    if (isAuthenticating) {
      const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
      const authCode: string | null = urlParams.get('code');

      authWithAuthCode(authCode as string).then(onLogin).catch(onError);
    } else if (isAuthenticated) {
      onLogin();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isAuthenticated) return (
    <Alert severity="success" variant="outlined"> Welcome: {currentUser.name || currentUser.email}.</Alert>
  );

  return <div />
};
