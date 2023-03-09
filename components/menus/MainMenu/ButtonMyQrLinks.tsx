import React, { useContext } from "react";
import { useRouter } from "next/router";

import FirstPageIcon from "@mui/icons-material/FirstPage";

import Context from "../../context/Context";
import classes from "./classes.sx";
import Button from "@mui/material/Button";

import { startWaiting, releaseWaiting } from "../../Waiting";

export default function ButtonMyQrLinks() {
  const router = useRouter();
  const { clearData } = useContext(Context);
  const { navButton } = classes;

  const onClick = () => {
    startWaiting();
    clearData(true);
    router.push('/').finally(releaseWaiting);
  }

  return (
    <Button variant="outlined"
            startIcon={<FirstPageIcon />}
            sx={navButton}
            color="primary"
            onClick={onClick}
    >
      {'My QRLynks'}
    </Button>
  );
}