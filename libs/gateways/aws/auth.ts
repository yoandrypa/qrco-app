import Joi from 'joi';
// @ts-ignore
import CognitoExpress from 'cognito-express';

import { NextApiRequest } from "next";
import { getUserAttrs } from './users';
import { setCurrentToken } from './base';

const region = process.env.AWS_REGION || 'us-east-1';
const cognitoUserPoolId = process.env.AWS_COGNITO_USER_POOL_ID || 'undefined';

const cognitoExpress: CognitoExpress = new CognitoExpress({ region, cognitoUserPoolId, tokenUse: 'id' });

let currentUser: any = null;

const parseCurrentUserFromValidateTokenResponse = async (user: any) => {
  /* eslint-disable camelcase */
  const { sub, aud, 'cognito:roles': roles } = user;
  const { email, email_verified, ...attrs } = await getUserAttrs(sub);

  currentUser = {
    cognito_user_id: sub,
    email,
    email_verified,
    roles: roles
      .filter((r: string) => r.match(/\/ebanux-[\w+-]+$/))
      .map((r: string) => r.split(/\//)[1]),
    client_id: aud,
    custom: {},
  };

  Object.entries(attrs).forEach(([k, v]) => {
    if (k.match(/^custom:/)) currentUser.custom[k.replace(/^custom:/, '')] = v;
  });

  console.log(currentUser);

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

  //@ts-ignore
  request.currentUser = session.currentUser;
};

export const getCurrentUser = () => currentUser;
