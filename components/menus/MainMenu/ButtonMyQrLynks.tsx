import React, { useContext } from "react";
import { useRouter } from "next/router";

import FirstPageIcon from "@mui/icons-material/FirstPage";

import Context from "../../context/Context";
import classes from "./classes.sx";
import Button from "@mui/material/Button";

import { startWaiting, releaseWaiting } from "../../Waiting";

interface ButtonMyQrLynksProp {
  setShowingDetails?: (item: undefined) => void;
}

export default function ButtonMyQrLynks({setShowingDetails}: ButtonMyQrLynksProp) {
  const router = useRouter();
  const { clearData } = useContext(Context);
  const { navButton } = classes;

  const onClick = () => {
    if (setShowingDetails === undefined) {
      startWaiting();
      router.push('/').finally(() => {
        clearData(true);
        releaseWaiting();
      });
    } else {
      setShowingDetails(undefined);
    }
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
