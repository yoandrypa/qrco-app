import Joi from 'joi';
// @ts-ignore
import CognitoExpress from 'cognito-express';

import { NextApiRequest } from "next";
import { setCurrentToken } from './index';
import { getUserAttrs } from './users';
import * as Users from "../../../handlers/users";

const region = process.env.AMZ_WS_REGION || 'us-east-1';
const cognitoUserPoolId = process.env.AMZ_WS_COGNITO_USER_POOL_ID || 'undefined';

const cognitoExpress: CognitoExpress = new CognitoExpress({ region, cognitoUserPoolId, tokenUse: 'id' });

let currentUser: any = null;

const parseCurrentUserFromValidateTokenResponse = async (user: any) => {
  /* eslint-disable camelcase */
  const { sub, aud, email, email_verified, 'cognito:roles': roles } = user;

  currentUser = {
    cognito_user_id: sub,
    email,
    email_verified,
    roles: roles
      .filter((r: string) => r.match(/\/(ebanux|qr)-[\w+-]+$/))
      .map((r: string) => r.split(/\//)[1]),
    client_id: aud,
    custom: {},
    localRecord: await Users.getOrCreate(sub),
  };

  if (process.env.INCLUDE_CUSTOM_USER_ATTRS) {
    const attrs = await getUserAttrs(sub);

    Object.entries(attrs).forEach(([k, v]) => {
      if (k.match(/^custom:/)) currentUser.custom[k.replace(/^custom:/, '')] = v;
    });
  }

  return currentUser;
  /* eslint-enable camelcase */
};

/**
 *
 * @param request
 */
export const checkAuthorization = async (request: NextApiRequest) => {
  const [tokenType, token] = (request.headers.authorization || '').split(' ');

  const schema = Joi.object({
    tokenType: Joi.string().required().valid('Bearer'),
    token: Joi.string().required(),
  });

  Joi.assert({ tokenType, token }, schema, { abortEarly: false });

  const cognitoUser = await cognitoExpress.validate(token);
  const { session } = request;

  setCurrentToken(token);

  if (!session.currentUser || session.currentToken !== token) {
    session.currentToken = token;
    session.currentUser = await parseCurrentUserFromValidateTokenResponse(cognitoUser);
  }
};

export const getCurrentUser = () => currentUser;
