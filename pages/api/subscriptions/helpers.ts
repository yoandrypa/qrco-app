import Joi from "joi";

import { NextApiRequest } from "next";
import { BatRequest } from "../../../libs/exceptions";
import { IS_PRODUCTION } from "../base/helpers";
import { stripe } from "../../../libs/gateways/stripe";

import * as Users from "../../../handlers/users";

import {
  PLAN_TEST_MODE_PRICES, PLAN_LIVE_MODE_PRICES,
  PLAN_LIVE_METERED_PRICES, PLAN_TEST_METERED_PRICES,
} from '../../../consts'

export { NotFound, respondWithException } from "../../../libs/exceptions";
export { withSessionRoute, checkAuthorization } from '../base/helpers';

function getLicencePlanId(type: string) {
  //@ts-ignore
  const planId = IS_PRODUCTION ? PLAN_LIVE_MODE_PRICES[type] : PLAN_TEST_MODE_PRICES[type];

  if (!planId) throw new BatRequest('Invalid plan type');

  return planId;
}

function getMeteredPlanId(type: string) {
  //@ts-ignore
  const planId = IS_PRODUCTION ? PLAN_LIVE_METERED_PRICES[type] : PLAN_TEST_METERED_PRICES[type];

  if (!planId) throw new BatRequest('Invalid plan type');

  return planId;
}

/**
 * Parse and validate the request via POST
 * @param req
 */
export function parseFromPostRequest(req: NextApiRequest) {
  const schema = Joi.object({
    planType: Joi.string().required(),
  });

  return Joi.attempt(req.body, schema, { abortEarly: false });
}

// TODO: Deprecate
// export async function createCustomer(currentUser: any) {
//   const { email, localRecord } = currentUser;
//   const stripeRecord = await stripe.customers.create({ email })
//
//   localRecord.customerId = stripeRecord.id;
//
//   return await Users.update({ id: localRecord.id }, { customerId: stripeRecord.id });
// }

export async function createCheckoutSession(currentUser: any, planType: string) {
  const { email, cognito_user_id } = currentUser;
  const serverBaseUrl = process.env.SERVER_BASE_URL;
  const licencePriceId = getLicencePlanId(planType);
  const meteredPriceId = getMeteredPlanId(planType);

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    client_reference_id: cognito_user_id,
    customer_email: email,
    line_items: [{ price: licencePriceId, quantity: 1 }, { price: meteredPriceId }],
    success_url: `${serverBaseUrl}/plans/account?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${serverBaseUrl}/plans`,
    metadata: { cognito_user_id, plan_type: planType }
  });

  await Users.update({ id: cognito_user_id }, { planType });

  return { type: 'checkout_session', result: checkoutSession }
}
