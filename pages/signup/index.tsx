import { useEffect } from "react";
import session from "@ebanux/ebanux-utils/sessionStorage";

import { useRouter } from "next/router";
import { startAuthorizationFlow } from "../../libs/utils/auth";

import { startWaiting, releaseWaiting } from "../../components/Waiting";

export default function SingUp() {
  const router = useRouter();

  useEffect(() => {
    startWaiting();
    if (session.isAuthenticated) {
      router.push('/').finally(releaseWaiting);
    } else {
      startAuthorizationFlow({ pathname: '/' }, true);
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps
};