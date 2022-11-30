import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import components from "../../../libs/aws/components";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "../../../libs/aws/aws-exports";
import QrDetails from "../../../components/qr/QrDetails";
import * as VisitHandler from "../../../handlers/visit";
import * as QrHandler from "../../../handlers/qrs";
import * as UserHandler from "../../../handlers/users";
import { useRouter } from "next/router";
import PleaseWait from "../../../components/PleaseWait";
import QrGen from "../type";

Amplify.configure(awsExports);

export default function Details({ visitData, qrData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Authenticator components={components}>
      <QrDetails visitData={visitData ? JSON.parse(visitData) : visitData} qrData={JSON.parse(qrData)} />
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
  const qrData = (await (await QrHandler.findByShortLink({
    userId: user.id,
    createdAt
  }))[0].populate({ properties: "shortLinkId" }));

  if (!qrData) {
    return {
      notFound: true
    };
  }
  let visitData = null;
  // @ts-ignore
  if (qrData.shortLinkId.visitCount > 0) {
    visitData = (await VisitHandler.findByShortLink({ userId: user.id, createdAt }));
  }

  return {
    props: {
      visitData: visitData ? JSON.stringify(visitData) : visitData,
      qrData: JSON.stringify(qrData)
    }
  };
};