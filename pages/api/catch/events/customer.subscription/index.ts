import Stripe from "stripe";
import Subscription from "../../../../../models/subscription";
import { fixNullAttrs } from '../helpers';

export const process = async (event: Stripe.Event) => {
  const { id, items: { data: items }, ...others } = event.data.object as any;
  const data = fixNullAttrs({ items, ...others });

  await Subscription.update({ id }, data);
};
