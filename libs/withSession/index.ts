import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { IronSessionOptions } from "iron-session";
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler,
} from "next";

const sessionOptions: IronSessionOptions = {
  cookieName: process.env.SESSION_COOKIE_NAME as string,
  password: (process.env.SESSION_SECRET || process.env.AMZ_WS_SECRET_ACCESS_KEY || '123456789') as string,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.APP_ENV === "production",
  },
};

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    currentUser?: any;
    currentToken?: string | undefined | null;
  }
}

export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

export function withSessionSsr<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
  handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return withIronSessionSsr(handler, sessionOptions);
}