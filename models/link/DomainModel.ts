import dynamoose from "../../libs/gateways/dynamodb/dynamoose";
import { getUuid } from "../../helpers/qr/helpers";

// instantiate a dynamoose schema
const DomainSchema = new dynamoose.Schema({
  /*id: {
    type: String,
    //hashKey: true,
    default: getUuid()
  },*/
  banned: {
    type: Boolean,
    required: true,
    default: false
  },
  bannedById: {
    type: String
  },
  address: {
    type: String,
    required: true,
    index: {
      name: "addressIndex",
      type: "global"
    }
    //TODO most be unique
  },
  homepage: {
    type: [String, dynamoose.type.NULL]
  },
  userId: {
    type: String,
    hashKey: true
    //TODO delete in cascade if user reference is deleted
  },
  createdAt: {
    type: Date,
    rangeKey: true
  }
}, {
  "timestamps": {
    createdAt: undefined,
    updatedAt: "updatedAt"
  }
});

// create a model from schema and export it
export const DomainModel = dynamoose.model("domains", DomainSchema);
