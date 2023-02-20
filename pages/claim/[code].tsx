import React from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import Claimer from "../../components/claimer/Claimer";

const ClaimEntry = ({ code }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <Claimer code={code} />;
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // @ts-ignore
  return { props: { code: params.code } };
}

export default ClaimEntry;