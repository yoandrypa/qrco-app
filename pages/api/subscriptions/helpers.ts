import Joi from "joi";

import { NextApiRequest } from "next";
import { isProductionMode } from "../base/helpers";
import { stripe } from "../../../libs/gateways/stripe";

import * as Users from "../../../handlers/users";
import Subscription from "../../../models/subscription";

import {
  PLAN_TEST_MODE_PRICES, PLAN_LIVE_MODE_PRICES,
  PLAN_LIVE_METERED_PRICES, PLAN_TEST_METERED_PRICES,
} from '../../../consts'

export { NotFound, respondWithException } from "../../../libs/exceptions";
export { withSessionRoute, checkAuthorization } from '../base/helpers';

function getPricesIds(type: string) {
  const [licencePlans, meteredPlans] = isProductionMode
    ? [PLAN_LIVE_MODE_PRICES, PLAN_LIVE_METERED_PRICES]
    : [PLAN_TEST_MODE_PRICES, PLAN_TEST_METERED_PRICES];

  //@ts-ignore
  return { licencePriceId: licencePlans[type], meteredPriceId: meteredPlans[type] }
}

/**
 * Parse and validate the request via POST
 * @param req
 */
export function parseFromPostRequest(req: NextApiRequest) {
  const planTypeOptions = Object.keys(isProductionMode ? PLAN_LIVE_MODE_PRICES : PLAN_TEST_MODE_PRICES);
  const schema = Joi.object({
    planType: Joi.string().valid(...planTypeOptions).required(),
  });

  return Joi.attempt(req.body, schema, { abortEarly: false });
}

export async function getSubscription(currentUser: any) {
  const localRecord = await Subscription.getActiveByUser(currentUser);
  return { type: 'subscription', result: localRecord }
}

export async function createCheckoutSession(currentUser: any, planType: string) {
  const serverBaseUrl = process.env.SERVER_BASE_URL;
  const { email, cognito_user_id } = currentUser;
  const { licencePriceId, meteredPriceId } = getPricesIds(planType);

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
