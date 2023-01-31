import dynamoose from "./dynamoose.mjs";
import { getUuid } from "./utils.mjs";

// PreGeneratedModel Schema
const PreGeneratedSchema = new dynamoose.default.Schema({
  code: {
    type: String,
    hashKey: true,
    required: true,
  },
});
export const PreGeneratedModel = dynamoose.default.model("pre_generated",
  PreGeneratedSchema);

// User Schema
const UserSchema = new dynamoose.default.Schema({
  id: {
    hashKey: true,
    type: String,
    default: getUuid(),
  },
  email: {
    type: String,
  },
  banned: {
    type: Boolean,
    required: true,
    default: false,
  },
  bannedById: {
    type: dynamoose.default.type.THIS,
  },
  coolDowns: {
    type: Array,
    schema: [String],
  },
  customerId: {
    type: String,
    required: false,
    index: {
      name: "customerIdIndex",
    },
  },
  planType: {
    type: String,
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
      periodEndsAt: Number,
    },
    required: false,
  },
  planUsage: {
    type: Number,
    default: 0,
  },
}, {
  "saveUnknown": [
    "subscriptionData.**",
  ]
  ,
  "timestamps": true,
});
export const UserModel = dynamoose.default.model("users", UserSchema);

// Domain Schema
const DomainSchema = new dynamoose.default.Schema({
  banned: {
    type: Boolean,
    required: true,
    default: false,
  },
  bannedById: {
    type: UserModel,
  },
  address: {
    type: String,
    required: true,
    index: {
      name: "addressIndex",
      type: "global",
    },
    //TODO most be unique
  },
  homepage: {
    type: [String, dynamoose.default.type.NULL],
  },
  userId: {
    type: UserModel,
    hashKey: true,
    //TODO delete in cascade if user reference is deleted
  },
  createdAt: {
    type: Date,
    rangeKey: true,
  },
}, {
  "timestamps": {
    createdAt: undefined,
    updatedAt: "updatedAt",
  },
});
export const DomainModel = dynamoose.default.model("domains", DomainSchema);

// Link Schema
const LinkSchema = new dynamoose.default.Schema({
  type: {
    type: String,
    enum: [ "redirect_link", "qr_link", "download_link" ],
    default: "qr_link"
  },
  claimable: {
    type: Boolean,
    default: false
  },
  preGenerated: {
    type: Boolean,
    default: false
  },
  address: {
    type: String,
    required: true,
    index: {
      name: "addressIndex"
    }
  },
  description: {
    type: [ String, dynamoose.default.type.NULL ]
  },
  banned: {
    type: Boolean,
    required: true,
    default: false
  },
  bannedById: {
    type: UserModel
  },
  paused: {
    type: Boolean,
    default: false
  },
  pausedById: {
    type: UserModel
  },
  domainId: {
    type: [ DomainModel, dynamoose.default.type.NULL ]
  },
  password: {
    type: [ String, dynamoose.default.type.NULL ]
  },
  expireIn: {
    type: [ Date, dynamoose.default.type.NULL ]
  },
  target: {
    type: String,
    //TODO including limit of 2040 characters
    required: true
  },
  userId: {
    type: UserModel,
    hashKey: true
    //TODO delete in cascade if user reference is deleted
  },
  visitCount: {
    type: Number,
    required: true,
    default: 0
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
export const LinkModel = dynamoose.default.model("links", LinkSchema);