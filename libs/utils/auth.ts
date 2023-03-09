import session from "@ebanux/ebanux-utils/sessionStorage";

import { NextRouter } from "next/router";
import { startAuthorizationFlow as _startAuthorizationFlow } from "@ebanux/ebanux-utils/auth";
import { startWaiting } from "../../components/Waiting";

interface RouterType {
  pathname: string,
  query?: any
}

export function startAuthorizationFlow(callbackRoute?: NextRouter | RouterType) {
  startWaiting();
  const { pathname, query } = callbackRoute || { pathname: '/' };
  session.set('CALLBACK_ROUTE', { pathname, query });
  _startAuthorizationFlow();
}