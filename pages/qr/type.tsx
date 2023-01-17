import QrTypeSelector from "../../components/qr/QrTypeSelector";
import QrWizard from "../../components/qr/QrWizard";
import { useContext, useEffect } from "react";
import Context from "../../components/context/Context";
import { useRouter } from "next/router";
import { QR_DESIGN_ROUTE } from "../../components/qr/constants";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

export default function QrGen ({ code }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // @ts-ignore
  const { options, clearData, userInfo, setData } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    if (options?.mode !== "edit" && router.query.mode !== "edit") {
      if (router.pathname === QR_DESIGN_ROUTE) {
        clearData(true, userInfo !== undefined || undefined, true);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <QrWizard>
      <QrTypeSelector/>
    </QrWizard>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  let props = {};
  if (query?.address) {
    props = {
      address: query.address,
      isDynamic: true,
    };
  }

  return {
    props,
  };
};
