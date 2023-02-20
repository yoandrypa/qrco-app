import { NextApiRequest } from "next";
import { buffer } from 'micro';
import { constructEvent } from "../../../../libs/gateways/stripe";
import { isObject, isEmpty } from "@ebanux/ebanux-utils/utils";

export { NotFound, respondWithException } from "../../../../libs/exceptions";

const reduceNullAttrs = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map((v) => reduceNullAttrs(v));

  const newObj: any = {};

  Object.entries(obj).forEach(([k, pV]) => {
    if (pV !== null) newObj[k] = isObject(pV) || Array.isArray(pV) ? reduceNullAttrs(pV) : pV;
  });

  return newObj;
};

export const fixNullAttrs = (obj: any) => {
  const data: any = { $SET: {}, $REMOVE: [] };

  Object.entries(obj).forEach(([k, v]) => {
    if (v === null) {
      data.$REMOVE.push(k);
    } else {
      data.$SET[k] = isObject(v) || Array.isArray(v) ? reduceNullAttrs(v) : v;
    }
  });

  if (isEmpty(data.$SET)) delete data.$SET;
  if (isEmpty(data.$REMOVE)) delete data.$REMOVE;

  return data;
};

/**
 * Validate and returns the event from webhook request.
 * @param request
 */
export const parseFromEventCatchRequest = async (req: NextApiRequest) => {
  const rawBody = await buffer(req);
  const signature = req.headers['stripe-signature']?.toString() || '';

  return constructEvent(rawBody, signature);
};
