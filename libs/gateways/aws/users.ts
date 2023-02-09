import { getAdminProvider, getUserProvider } from './base';
import { StandardError } from '../../exceptions';

const UserPoolId = process.env.AWS_COGNITO_USER_POOL_ID || 'undefined';

// eslint-disable-next-line consistent-return
const parseResponse = (resolve: (rep: any) => void, reject: (err: any) => void) => (err: any, data: any) => {
  if (err) return reject(new StandardError(err.message, 400));
  resolve(data);
};

export const inviteNewUser = (data: any) => new Promise((resolve, reject) => {
  const password = new Array(12).fill(0).map(() => String.fromCharCode(Math.random() * 86 + 40)).join('');

  const params = {
    UserPoolId,
    Username: data.username,
    UserAttributes: data.attrs,
    TemporaryPassword: password,
    DesiredDeliveryMediums: ['EMAIL'],
    // MessageAction: RESEND | SUPPRESS,
  };

  getAdminProvider().adminCreateUser(params, parseResponse(resolve, reject));
});

export const addUserToGroup = (username: string, group: string) => new Promise((resolve, reject) => {
  const params = {
    UserPoolId,
    Username: username,
    GroupName: group,
  };

  getAdminProvider().adminAddUserToGroup(params, parseResponse(resolve, reject));
});

export const setUserAttrs = (username: string, attrs: any) => new Promise((resolve, reject) => {
  const userAttrs = Object.keys(attrs).map((name) => ({ Name: name, Value: attrs[name] }));
  const params = {
    UserPoolId,
    Username: username,
    UserAttributes: userAttrs,
  };

  getAdminProvider().adminUpdateUserAttributes(params, parseResponse(resolve, reject));
});

export const getUserInfo = (username: string) => new Promise((resolve, reject) => {
  const params = {
    UserPoolId,
    Username: username,
  };
  getUserProvider().adminGetUser(params, parseResponse(resolve, reject));
});

export const getUserAttrs = async (username: string) => {
  const user: any = await getUserInfo(username);
  return Object.fromEntries(user.UserAttributes.map(({ Name, Value }: any) => [Name, Value]));
};
