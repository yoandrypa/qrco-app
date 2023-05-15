import dynamoose from "../../libs/gateways/dynamodb/dynamoose";
import schema from "./schemas/user";

export const User = dynamoose.model("users", schema);

export default User;