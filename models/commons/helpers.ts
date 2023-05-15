import { ObjectType } from "dynamoose/dist/General";

export function decodePageKey(token: string): ObjectType {
  return JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
}

export function encodePageKey(pageKey?: ObjectType): string | undefined {
  return pageKey ? Buffer.from(JSON.stringify(pageKey), 'utf8').toString('base64') : undefined;
}