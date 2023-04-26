import {useContext, useEffect} from "react";

import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {useRouter} from "next/router";

import PleaseWait from "../../components/PleaseWait";
import {getItemBySecret} from "../../handlers/qrs";
import {QR_CONTENT_ROUTE, QR_DESIGN_ROUTE} from "../../components/qr/constants";
import Context from "../../components/context/Context";

import {releaseWaiting, startWaiting} from "../../components/Waiting";

export default function EditionBySecret({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const { setOptions, } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    startWaiting();
    if (data) {
      const objToEdit = { ...data.qrOptionsId, ...data, mode: "secret" } as any; // @ts-ignore
      if (!objToEdit.image?.trim()?.length && data.qrOptionsId?.image?.trim()?.length) { // @ts-ignore
        objToEdit.image = data.qrOptionsId.image;
      }
      setOptions(objToEdit);
      router.push(data.isDynamic ? QR_CONTENT_ROUTE : QR_DESIGN_ROUTE, undefined, { shallow: true })
        .finally(() => releaseWaiting());
    } else {
      router.push('/', undefined, { shallow: true }).finally(() => releaseWaiting());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return <PleaseWait redirecting hidePleaseWait />;
}

export const getServerSideProps: GetServerSideProps = async ({ params}) => {
  // @ts-ignore
  const { code } = params;

  const response = await getItemBySecret(code);

  const data = Boolean(response) ? JSON.parse(JSON.stringify(response)) : null;

  return { props: { data } }
}
