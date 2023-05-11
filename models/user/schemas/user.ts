import { v4 as uuid } from 'uuid';

import Schema from '../../commons/schema';
import dynamoose from "../../../libs/gateways/dynamodb/dynamoose";

const schema = new Schema({
  id: {
    hashKey: true,
    type: String,
    default: uuid()
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
  },
  planUsage: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  saveUnknown: [
    "subscriptionData.**"
  ],
});

export default schema;
