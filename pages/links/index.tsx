import components from "../../libs/aws/components";
import * as UserHandler from "../../handlers/users";
import * as LinkHandler from "../../handlers/links";
import * as DomainHandler from "../../handlers/domains";

import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import LinkHome from "../../components/link/LinkHome";

import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "../../libs/aws/aws-exports";
import { QR_TYPE_ROUTE } from "../../components/qr/constants";
import React from "react";

Amplify.configure(awsExports);

export default function Index({ linksData, domainsData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  //@ts-ignore
  return (
    <Authenticator components={components}>
      {({ user }) => (<LinkHome linksData={linksData} domainsData={domainsData} userInformation={user} />
      )}
    </Authenticator>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query, req }) => {
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
    } catch (e) {
      return null;
    }
  };

  const userInfo = await getUserInfo();

  // @ts-ignore
  if (!userInfo?.userData) {
    return {
      props: {
        linksData: JSON.stringify({}),
        domainsData: JSON.stringify([])
      }
    };
  }

  // @ts-ignore
  const userData = JSON.parse(userInfo.userData as string);
  const userId = userData.UserAttributes[0].Value;
  let user = await UserHandler.find(userId);
  if (!user) {
    user = await UserHandler.create({ id: userId });
  }
  const links = await LinkHandler.list({ limit: 10, userId: user.id });
  const domains = await DomainHandler.list({ userId: user.id });

  return {
    props: {
      linksData: JSON.stringify(links),
      domainsData: JSON.stringify(domains),
      revalidate: 10
    }
  };
};
