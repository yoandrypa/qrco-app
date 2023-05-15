import dynamoose from "../../libs/gateways/dynamodb/dynamoose";
import { UserModel } from "../UserModel";
import {getUuid} from "../../helpers/qr/helpers";

// instantiate a dynamoose schema
const HostSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true,
    default: getUuid()
  },
  address: {
    type: String,
    required: true
    //TODO most be Unique
  },
  banned: {
    type: Boolean,
    required: true,
    default: false
  },
  bannedById: {
    type: UserModel //TODO Include reference to User
  }
}, { "timestamps": true });

// create a model from schema and export it
export const HostModel = dynamoose.model("hosts", HostSchema);
