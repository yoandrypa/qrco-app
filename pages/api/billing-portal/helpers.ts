import { stripe } from "../../../libs/gateways/stripe";

import Subscription from "../../../models/subscription";

export { NotFound, respondWithException } from "../../../libs/exceptions";
export { withSessionRoute, checkAuthorization, allowCors } from '../base/helpers';

export async function getBillingPortal({ cognito_user_id }: any) {
  // TODO: Save local record with billing-portal data.
  const lrSubscription = await Subscription.getActiveByUser(cognito_user_id);

  const billingPortal = await stripe.billingPortal.sessions.create({
    customer: lrSubscription.customer,
    return_url: `${process.env.SERVER_BASE_URL}/plans`,
  });

  const { id, url } = billingPortal;

  return { type: 'billing_portal', result: { id, url } }
}
