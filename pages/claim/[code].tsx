import {GetServerSideProps, InferGetServerSidePropsType} from "next";

import Claimer from "../../components/claimer/Claimer";

const ClaimEntry = ({code}: InferGetServerSidePropsType<typeof  getServerSideProps>) => {
  if (code === 'error') {
    return (
      <>
        {'Error, please contact support.'}
      </>
    )
  }
  return <Claimer code={code} />;
};

export default ClaimEntry;

export const getServerSideProps: GetServerSideProps = async ({params}) => (
  {props: {code: params?.code || 'error'}}
);
