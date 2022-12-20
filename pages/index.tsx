import * as QrHandler from "../handlers/qrs";
import {GetStaticProps, InferGetStaticPropsType,} from "next";
import "@aws-amplify/ui-react/styles.css";
import {useRouter} from "next/router";

import QrGen from "./qr/type";
import {useContext, useEffect} from "react";
import Context from "../components/context/Context";

// @ts-ignore
import session from "@ebanux/ebanux-utils/sessionStorage";
import QrList from "../components/qr/QrList";
import PleaseWait from "../components/PleaseWait";

export default function Index ({ user }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter(); // @ts-ignore
  const { clearData, setLoading } = useContext(Context);

  useEffect(() => {
    clearData();

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (router.isFallback) {
    return <PleaseWait/>;
  }

  if (!session.isAuthenticated) {
    return <QrGen/>;
  }

  return (
    <QrList user={user}/>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const qrs = await QrHandler.list({ userId: "some" });

  // return only the list data
  return {
    props: {
      qrData: JSON.parse(
        // @ts-ignore
        JSON.stringify(qrs),
      ),
    },
  };
};
