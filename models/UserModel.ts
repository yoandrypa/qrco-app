import dynamoose from "../libs/dynamoose";
import { getUuid } from "../helpers/qr/helpers";

// user schema
const UserSchema = new dynamoose.Schema({
  id: {
    hashKey: true,
    type: String,
    default: getUuid()
  },
  email: {
    type: String,
  },
  banned: {
    type: Boolean,
    required: true,
    default: false
  },
  bannedById: {
    type: dynamoose.type.THIS
  },
  coolDowns: {
    type: Array,
    schema: [String]
  },
  customerId: {
    type: String,
    required: false,
    index: {
      name: "customerIdIndex"
    }
  },
  planType: {
    type: String
  },
  subscriptionData: {
    type: Object,
    schema: {
      id: String,
      priceId: String,
      status: String,
      currency: String,
      interval: String,
      intervalCount: Number,
      createdDate: Number,
      periodStartsAt: Number,
      periodEndsAt: Number
    },
    required: false
  }
}, {
  "saveUnknown": [
    "subscriptionData.**"
  ]
  ,
  "timestamps": true
});

export const UserModel = dynamoose.model("users", UserSchema);
