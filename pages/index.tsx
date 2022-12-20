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

export default function Index ({ user }: any) {
  const router = useRouter(); // @ts-ignore
  const { clearData, setLoading } = useContext(Context);

  useEffect(() => {
    clearData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!session.isAuthenticated) {
    return <QrGen/>;
  }

  return (
    <QrList user={user}/>
  );
};
