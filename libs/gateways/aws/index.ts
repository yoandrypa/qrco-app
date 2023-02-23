import { fromCognitoIdentityPool, FromCognitoIdentityPoolParameters } from '@aws-sdk/credential-providers';
import {
  CognitoIdentityProvider,
  CognitoIdentityProviderClientConfig,
} from '@aws-sdk/client-cognito-identity-provider';

const awsAccountId = process.env.AMZ_WS_ACCOUNT_ID || 'undefined';
const cognitoUserPoolId = process.env.AMZ_WS_COGNITO_USER_POOL_ID || 'undefined';
const identityPoolId = process.env.AMZ_WS_COGNITO_INDETITY_POOL_ID || 'undefined';
const region = process.env.AMZ_WS_REGION as string;
const adminRole = process.env.AMZ_WS_EBANUX_ADMIN_ROLE as string;
const userRole = process.env.AMZ_WS_EBANUX_USER_ROLE as string;

let currentToken: string | null = null;

export const setCurrentToken = (token: string) => (currentToken = token);

export const getCredentials = (assumeRole: string) => fromCognitoIdentityPool({
  identityPoolId,
  clientConfig: { region },
  customRoleArn: `arn:aws:iam::${awsAccountId}:role/${assumeRole}`,
  logins: {
    [`cognito-idp.${region}.amazonaws.com/${cognitoUserPoolId}`]: currentToken,
  },
} as FromCognitoIdentityPoolParameters);

export const cognitoIdentityProvider = (assumeRole: string) => (
  new CognitoIdentityProvider(<CognitoIdentityProviderClientConfig>{
    region,
    credentials: getCredentials(assumeRole),
  })
);

export const getAdminProvider = () => cognitoIdentityProvider(adminRole);
export const getUserProvider = () => cognitoIdentityProvider(userRole);
