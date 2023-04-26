import {useContext, useEffect} from "react";
import {useRouter} from "next/router";

import session from "@ebanux/ebanux-utils/sessionStorage";
import {Authenticator} from "@ebanux/ebanux-utils/auth";
import "@ebanux/ebanux-utils/styles/spinner.css";

import {PRIVATE_ROUTES} from "./qr/constants";
import {AppProps} from "next/app";
import Context from "./context/Context";

const isAPrivateRoute = (pathname: string, isDynamic: boolean) =>
  isDynamic && PRIVATE_ROUTES.some((route: string) => pathname.match(route));

export default function MainHandler({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // @ts-ignore
  const { data } = useContext(Context);
  const { pathname, query } = router;
  // @ts-ignore
  const isDynamic: boolean = data?.isDynamic || pageProps.isDynamic;

  useEffect(() => {
    if (!session.isAuthenticated && isAPrivateRoute(pathname, isDynamic)) {
      session.set('CALLBACK_ROUTE', { pathname, query });
    }
  }, [pathname, isDynamic]); // eslint-disable-line react-hooks/exhaustive-deps

  if (data?.mode?.secret !== undefined && isAPrivateRoute(pathname, isDynamic)) {
    return (
      <Authenticator>
        {({ user }: any) => (
          <Component {...pageProps} user={user} />
        )}
      </Authenticator>
    );
  }

  return <Component {...pageProps} />;
}
