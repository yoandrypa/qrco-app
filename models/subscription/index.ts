import dynamoose from "../../libs/gateways/dynamodb/dynamoose";
import schema from "./schemas/subscription";

import { AnyItem } from "dynamoose/dist/Item";

interface ISubscriptionModel extends AnyItem {
  // Add the model's custom method prototypes here
  getActiveByUser: (cognito_user_id: string) => Promise<any>;
}

export const Subscription = dynamoose.model<ISubscriptionModel>("Subscription", schema);

Subscription.methods.set("getActiveByUser", async function (cognito_user_id) {
  // @ts-ignore
  const result = await this.query({ cognito_user_id }).where('status').not().eq('canceled').limit(1).exec();

  return result[0];
});

export default Subscription;