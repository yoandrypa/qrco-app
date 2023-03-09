import React from "react";
import { useRouter } from "next/router";

import session from "@ebanux/ebanux-utils/sessionStorage";

import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";

import classes from "./classes.sx";

import { startWaiting } from "../../Waiting";
import { startAuthorizationFlow } from "@ebanux/ebanux-utils/auth";

export default function ButtonLogin() {
  const router = useRouter();
  const { navButton } = classes;

  const onLogin = () => {
    startWaiting();
    const { pathname, query } = router;
    session.set('CALLBACK_ROUTE', { pathname, query });
    startAuthorizationFlow();
  }

  return (
    <Button variant="contained"
            startIcon={<LoginIcon />}
            sx={navButton}
            color="primary"
            onClick={onLogin}
    >
      {"Login"}
    </Button>
  );
}