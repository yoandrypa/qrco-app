import { useContext, useEffect } from "react";
import session from "@ebanux/ebanux-utils/sessionStorage";

import QrGen from "./qr/type";
import Context from "../components/context/Context";
import QrList from "../components/qr/QrList";

export default function Index({ user }: any) {
  // @ts-ignore
  const { clearData } = useContext(Context);

  useEffect(() => {
    clearData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!session.isAuthenticated) {
    return <QrGen />;
  }

  return (
    <QrList user={user} />
  );
};
