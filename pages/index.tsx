import components from "../libs/aws/components";
import * as UserHandler from "../handlers/users";
import * as QrHandler from "../handlers/qrs";
import QrHome from "../components/qr/QrHome";
import {
  GetServerSideProps,
  GetStaticProps,
  InferGetServerSidePropsType, InferGetStaticPropsType,
} from "next";
import { formFields } from "../libs/aws/components";

import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "../libs/aws/aws-exports";
import { useRouter } from "next/router";
import PleaseWait from "../components/PleaseWait";

import QrGen from "./qr/type";
import { useContext, useEffect } from "react";
import Context from "../components/context/Context";

// @ts-ignore
import session from "@ebanux/ebanux-utils/sessionStorage";

const noUser = "noUser";

export default function Index ({ user }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter(); // @ts-ignore
  const { clearData } = useContext(Context);

  useEffect(() => {
    clearData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /*if (router.isFallback) {
    return <PleaseWait/>;
  }*/

  if (!session.isAuthenticated) {
    return <QrGen/>;
  }

  return (
    <QrHome user={user}/>
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
