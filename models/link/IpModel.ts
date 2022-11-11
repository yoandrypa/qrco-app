import dynamoose from "../../libs/dynamoose";
import {getUuid} from "../../helpers/qr/helpers";

// instantiate a dynamoose schema
const IpSchema = new dynamoose.Schema({
  ip: {
    type: String,
    hashKey: true,
    required: true
  }
}, { "timestamps": true });

// create a model from schema and export it
export const IpModel = dynamoose.model("ips", IpSchema);
