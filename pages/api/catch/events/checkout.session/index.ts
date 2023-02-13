import Stripe from 'stripe';
import { stripe } from "../../../../../libs/gateways/stripe";
import * as Users from "../../../../../handlers/users";

export const process = async (event: Stripe.Event) => {
  const capturedRecord: any = event.data.object;
  const { id, status, client_reference_id: userId, metadata = {} } = capturedRecord;
  const { plan_type: planType } = metadata;

  if (status === 'complete') {
    const localUser = userId ? await Users.get(userId) : null;

    if (localUser || !planType) {
      const message = `Cannot identify owner user or plan type of checkout-session instance with ID ${id}`;
      console.warn(message);
      return { success: false, message };
    }

    await stripe.subscriptions.update(capturedRecord.subscription, { metadata });
  }

  return { success: true };
}
