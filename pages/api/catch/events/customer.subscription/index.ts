import Stripe from "stripe";
import Subscription from "../../../../../models/subscription";
import { fixNullAttrs } from '../helpers';

export const process = async (event: Stripe.Event) => {
  const { id, items: { data: items }, metadata, ...others } = event.data.object as any;
  const data = fixNullAttrs({
    items,
    metadata,
    cognito_user_id: metadata.cognito_user_id,
    ...others
  });

  await Subscription.update({ id }, data);

  return { success: true };
};
