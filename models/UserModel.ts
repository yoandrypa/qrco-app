import dynamoose from "../libs/dynamoose";
import {getUuid} from "../helpers/qr/helpers";

// user schema
const UserSchema = new dynamoose.Schema({
  id: {
    hashKey: true,
    type: String,
    default: getUuid()
  },
  banned: {
    type: Boolean,
    required: true,
    default: false
  },
  bannedById: {
    type: dynamoose.THIS
  },
  coolDowns: {
    type: Array,
    schema: [String]
  },
  customerId: {
    type: String,
    required: false,
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
  },
},{
  "saveUnknown":[
    "subscriptionData.**"
  ]
,
 "timestamps": true });

export const UserModel = dynamoose.model("users", UserSchema);

UserModel.methods.set("findOne", async function(criteria: any) {
  // @ts-ignore
  const results = await this.scan(criteria).exec();
  return results[0];
});
