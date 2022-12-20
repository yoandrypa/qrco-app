// @ts-ignore
import {Authenticator} from "@ebanux/ebanux-utils/auth";
import "@ebanux/ebanux-utils/styles/spinner.css";
import {useRouter} from "next/router";
import {PRIVATE_ROUTES} from "./qr/constants";
import {AppProps} from "next/app";
import {setCookie} from "cookies-next";
import {useContext} from "react";
import Context from "./context/Context";

const isAPrivateRoute = (path: string, isDynamic: boolean) => {
  return PRIVATE_ROUTES.some((route: string) => path.match(route))
};

export default function MainHandler({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // @ts-ignore
  const { data } = useContext(Context);

  if (router.pathname !== "/auth_callback") {
    setCookie("final_callback_path", { pathname: router.pathname, query: router.query });
  }

  if (isAPrivateRoute(router.pathname, data.isDynamic || false)) {
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
