import React, { useEffect } from "react";
import { useRouter } from "next/router";

import session from "@ebanux/ebanux-utils/sessionStorage";
import { authWithAuthCode } from "@ebanux/ebanux-utils/auth";

import Alert from "@mui/material/Alert";

import Context from "../../components/context/Context";
import { startWaiting, releaseWaiting } from "../../components/Waiting";
import { setSuccess, setError } from "../../components/Notification";

export default function AuthCallback() {
  const router = useRouter();
  // @ts-ignore
  const { setUserInfo } = React.useContext(Context);

  function onLogin() {
    const currentUser = session.currentUser;
    const callbackRoute = session.get('CALLBACK_ROUTE', '/');

    setSuccess(`Welcome: ${currentUser.name || currentUser.email}...`);
    setUserInfo(currentUser);
    router.push(callbackRoute, callbackRoute.pathname || '/').finally(() => releaseWaiting());
  }

  function onError({ message }: any) {
    console.error(message);
    setSuccess(message);
  }

  useEffect(() => {
    const { isAuthenticating, isAuthenticated } = session;

    startWaiting();

    if (isAuthenticating) {
      const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
      const authCode: string | null = urlParams.get('code');

      authWithAuthCode(authCode as string).then(onLogin).catch(onError);
    } else if (isAuthenticated) {
      onLogin();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div />
};
