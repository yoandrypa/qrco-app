import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import QrDetails from "../../../components/qr/QrDetails";
import * as VisitHandler from "../../../handlers/visit";
import * as QrHandler from "../../../handlers/qrs";
import { useContext, useEffect, useState } from "react";
import Context from "../../../components/context/Context";
import Loading from "../../../components/Loading";

const getQr = async (userId: string, createdAt: number) => {
  return await (await QrHandler.get({
    userId, createdAt
  })).populate({ properties: ["shortLinkId", "qrOptionsId"] });
};

const getVisits = async (userId: string, createdAt: number) => {
  return await VisitHandler.findByShortLink({ userId, createdAt });
};

export default function Details ({ id }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [data, setData] = useState({ qrData: {}, visitData: {} });
  // @ts-ignore
  const { setLoading, userInfo } = useContext(Context);
  let createdAt = JSON.parse(id);

  useEffect(() => {
    if (createdAt) {
      setLoading(true);
      getQr(userInfo.cognito_user_id, createdAt).then(qrData => {
        let visitData; // @ts-ignore
        if (qrData.shortLinkId?.visitCount > 0) { // @ts-ignore
          createdAt = (new Date(qrData.shortLinkId.createdAt)).getTime(); // eslint-disable-line react-hooks/exhaustive-deps
          visitData = getVisits(userInfo.cognito_user_id, createdAt);
        } // @ts-ignore
        setData({ qrData, visitData });
      }).finally(() => setLoading(false));
    }
  }, []);

  if (!Object.keys(data.qrData).length) {
    return <Loading />;
  }

  return <QrDetails visitData={data.visitData} qrData={data.qrData}/>;
};

export const getServerSideProps: GetServerSideProps = async ({params}) => {
  return { props: { id: params?.id } };
};
