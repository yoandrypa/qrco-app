import Stripe from "stripe";
import Subscription from "../../../../../models/subscription";
import { fixNullAttrs } from '../helpers';

export const process = async (event: Stripe.Event) => {
  const { id, items: { data: items }, metadata, ...others } = event.data.object as any;
  const { cognito_user_id, plan_type } = metadata;

  if (cognito_user_id && plan_type) {
    const data = fixNullAttrs({
      items,
      metadata,
      cognito_user_id,
      ...others
    });

    await Subscription.update({ id }, data);

    return { success: true };
  } else {
    return {
      success: false,
      message: 'Ignored because it does not have cognito_user_id or plan_type in the metadata.'
    };
  }
};
