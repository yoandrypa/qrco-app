import { useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Context from "../context/Context";

import { useRouter } from "next/router";
import QrList from "./QrList";

export default function QrHome ({ user }: any) {
  const router = useRouter();

  // @ts-ignore
  const { userInfo, setUserInfo, setLoading } = useContext(Context);

  useEffect(() => {
    if (router.query.login) {
      setLoading(true);
      const { path } = router.query;
      const route = { pathname: path !== undefined ? `${path}` : "/" };
      if (router.query.selected) { // @ts-ignore
        route.query = { selected: router.query.selected };
      }
      router.push(route, "/", { shallow: false }).then(() => {
        setLoading(false);
      });
    }
    /*if (!userInfo) {
      setUserInfo(userInformation);
    }*/
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <QrList user={user}/>
        </Grid>
      </Grid>
    </Box>
  );
};
