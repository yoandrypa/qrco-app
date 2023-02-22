import React, { useEffect } from "react";
import session from "@ebanux/ebanux-utils/sessionStorage";
import { authWithAuthCode, startAuthorizationFlow } from "@ebanux/ebanux-utils/auth";


export function injectAuthenticationFlow(WrappedComponent: any) {
  // eslint-disable-next-line react/display-name
  return (props: any) => {
    useEffect(() => {
      const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
      console.log(111, session.isAuthenticated, session.isAuthenticating, urlParams.get('code'));

      if (session.isAuthenticating) {
        console.log(444);
        // const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const authCode: string | null = urlParams.get('code');
        authWithAuthCode(authCode as string).then(() => {
          console.log('rrrr');
          window.location.replace(session.oauthRedirectUri)
        });
      } else if (!session.isAuthenticated) {
        startAuthorizationFlow();
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (session.isAuthenticated) {
      return React.createElement(WrappedComponent, { user: session.currentUser, ...props });
    }

    return <div />
  }
}

const AuthenticatorInternal = ({ children, user }: any) => {
  return <>{typeof children === 'function' ? children({ user }) : children}</>;
}

export const Authenticator = injectAuthenticationFlow(AuthenticatorInternal)