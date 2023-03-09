import React from "react";
import { useRouter } from "next/router";

import Button from "@mui/material/Button";
import LoginIcon from "@mui/icons-material/Login";
import classes from "./classes.sx";

import { startAuthorizationFlow } from "../../../libs/utils/auth";

export default function ButtonLogin() {
  const router = useRouter();
  const { navButton } = classes;

  const onLogin = () => startAuthorizationFlow(router);

  return (
    <Button variant="contained"
            startIcon={<LoginIcon />}
            sx={{ ...navButton, textTransform: 'uppercase' }}
            color="primary"
            onClick={onLogin}
    >
      {"Login"}
    </Button>
  );
}