import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import components from "../../../libs/aws/components";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "../../../libs/aws/aws-exports";
import QrDetails from "../../../components/qr/QrDetails";
import * as VisitHandler from "../../../handlers/visit";
import * as UserHandler from "../../../handlers/users";
import { useRouter } from "next/router";
import PleaseWait from "../../../components/PleaseWait";
import QrGen from "../type";

Amplify.configure(awsExports);

export default function Details({ visitData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();

  if (router.isFallback) {
    return <PleaseWait />;
  }

  if (visitData === "noUser" &&
    ((!router.query.login && !router.query.qr_text) || (router.pathname === "/" && !router.query.login))) {
    return <QrGen />;
  }

  return (
    <Authenticator components={components}>
      {({ user }) => (
        <QrDetails visitData={JSON.parse(visitData)} user={user} />
      )}
    </Authenticator>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const getUserInfo = async () => {
    try {
      let userInfo = {};
      for (const [key, value] of Object.entries(req.cookies)) {
        // @ts-ignore
        userInfo[key.split(".").pop()] = value;
      }
      // @ts-ignore
      if (!userInfo.userData) {
        return null;
      }
      return userInfo;
    } catch {
      return null;
    }
  };

  const userInfo = await getUserInfo();

  // @ts-ignore
  if (!userInfo?.userData) {
    return {
      props: {
        visitData: "noUser"
      }
    };
  }

  // @ts-ignore
  const userData = JSON.parse(userInfo.userData as string);
  const userId = userData.UserAttributes[0].Value;
  let user = await UserHandler.get(userId);
  if (!user) {
    user = await UserHandler.create({ id: userId });
  }

  const createdAt = JSON.parse(params?.id as string);
  const visitData = (await VisitHandler.findByShortLink({ userId: user.id, createdAt }))[0];
  return {
    props: { visitData: JSON.stringify(visitData) }
  };
};