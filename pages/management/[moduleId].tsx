import React, { useEffect, useRef, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { startUpEventListener, useDidUpdated } from "../../helpers/managements";

const payLynkAppUrl: string = process.env.PAYLINK_APP_URL || '';

export default function Page({ moduleId }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [src] = useState<string>(`${payLynkAppUrl}/${moduleId}`);
  const iRef = useRef<HTMLIFrameElement | null>(null);
  const didUpdated = useDidUpdated();

  useEffect(startUpEventListener, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (didUpdated) iRef.current?.contentWindow?.postMessage({ cmd: 'openModule', moduleId }, payLynkAppUrl);
  }, [moduleId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <iframe
      id="iframe-management"
      src={src}
      ref={iRef}
      style={{
        width: '100%',
        height: 'calc(100vh - 145px)',
        border: 'none', borderRadius: 'inherit',
        margin: 0,
        padding: 0,
      }} />
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  // @ts-ignore
  return { props: { moduleId: params.moduleId as string } };
}