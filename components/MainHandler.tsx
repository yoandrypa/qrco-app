// @ts-ignore
import { Authenticator } from "@ebanux/ebanux-utils/auth";
// @ts-ignore
import session from "@ebanux/ebanux-utils/sessionStorage";
import "@ebanux/ebanux-utils/styles/spinner.css";
import { useRouter } from "next/router";
import { PRIVATE_ROUTES } from "./qr/constants";
import { AppProps } from "next/app";
import { useContext, useEffect } from "react";
import Context from "./context/Context";

const isAPrivateRoute = (path: string, isDynamic: boolean) =>
  PRIVATE_ROUTES.some((route: string) => path.match(route)) && isDynamic;

export default function MainHandler({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // @ts-ignore
  const { data } = useContext(Context);

  useEffect(() => {
    if (router.pathname !== "/auth_callback") {
      session.set('CALLBACK_ROUTER', { pathname: router.pathname, query: router.query })
    }
  }, [router.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // @ts-ignore
  if (router.query.code || isAPrivateRoute(router.pathname, data?.isDynamic || pageProps.isDynamic || false)) {
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
