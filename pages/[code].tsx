import {GetServerSideProps, InferGetServerSidePropsType} from "next";

import {useRouter} from "next/router";

import Claimer from "../components/claimer/Claimer";
import {IS_DEV_ENV} from "../components/qr/constants";

const ClaimEntry = ({code}: InferGetServerSidePropsType<typeof  getServerSideProps>) => {
  const router = useRouter();

  if (!IS_DEV_ENV) {
    router.push('/', '/');
  }

  if (code === 'error') {
    return (
      <>
        {'Error, please contact support.'}
      </>
    )
  }
  return (
    <Claimer code={code} />
  );
};

export default ClaimEntry;

export const getServerSideProps: GetServerSideProps = async ({params}) => (
  {props: {code: params?.code || 'error'}}
);
