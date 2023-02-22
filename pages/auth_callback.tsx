import React, { useEffect } from "react";
import { useRouter } from "next/router";

import session from "@ebanux/ebanux-utils/sessionStorage";
import { Authenticator } from "@ebanux/ebanux-utils/auth";

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
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Authenticator>
      {({ user }: any) => (
        <Alert severity="success" variant="outlined">
          Welcome: {user.name || user.email}.
        </Alert>
      )}
    </Authenticator>
  );
};
