import React from "react";

import LoginIcon from "@mui/icons-material/Login";

import classes from "./classes.sx";
import Button from "@mui/material/Button";

import { onLogin } from "./MenuItemLogin";

export default function ButtonLogin() {
  const { navButton } = classes;

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