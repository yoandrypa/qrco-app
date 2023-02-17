import dynamoose from "../../libs/dynamoose";
import schema from "./subscription";

export const Subscription = dynamoose.model("Subscription", schema);

Subscription.methods.set("getActiveByUser", async function (cognito_user_id) {
  const result = await this.query({ cognito_user_id }).where('status').not().eq('canceled').limit(1).exec();

  return result[0];
});

export default Subscription;