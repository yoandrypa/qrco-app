import dynamoose from "../../libs/dynamoose";
import schema from "./subscription";

export const Subscription = dynamoose.model("Subscription", schema);

export default Subscription;