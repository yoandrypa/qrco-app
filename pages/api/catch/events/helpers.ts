import { NextApiRequest } from "next";
import { buffer } from 'micro';
import { constructEvent } from "../../../../libs/gateways/stripe";

export { NotFound, respondWithException } from "../../../../libs/exceptions";

/**
 * Validate and returns the event from webhook request.
 * @param request
 */
export const parseFromEventCatchRequest = async (req: NextApiRequest) => {
  const rawBody = await buffer(req);
  const signature = req.headers['stripe-signature']?.toString() || '';

  return constructEvent(rawBody, signature);
};
