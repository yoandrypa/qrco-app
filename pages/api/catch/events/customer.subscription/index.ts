import Stripe from "stripe";
import Subscription from "../../../../../models/subscription";

export const process = async (event: Stripe.Event) => {
  const capturedRecord: any = event.data.object;
  const { id } = capturedRecord;

  Subscription.update({ id }, { capturedRecord });
};
