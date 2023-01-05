// @ts-ignore
import { Authenticator } from "@ebanux/ebanux-utils/auth";
import "@ebanux/ebanux-utils/styles/spinner.css";
import { useRouter } from "next/router";
import { PRIVATE_ROUTES } from "./qr/constants";
import { AppProps } from "next/app";
import { setCookie } from "cookies-next";
import { useContext, useEffect } from "react";
import Context from "./context/Context";

const isAPrivateRoute = (
  path: string, isDynamic: boolean) => PRIVATE_ROUTES.some(
  (route: string) => path.match(route)) && isDynamic;

export default function MainHandler ({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // @ts-ignore
  const { data } = useContext(Context);

  useEffect(() => {
    if (router.pathname !== "/auth_callback") {
      setCookie("final_callback_path",
        { pathname: router.pathname, query: router.query });
    }
  }, [router.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isAPrivateRoute(router.pathname,    // @ts-ignore
    data.isDynamic || pageProps.isDynamic || false)) {
    return (
      <Authenticator>
        {({ user }: any) => (
          <Component {...pageProps} user={user}/>
        )}
      </Authenticator>
    );
  }

  return <Component {...pageProps} />;
}
