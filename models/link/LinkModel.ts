import dynamoose from "../../libs/dynamoose";
import { UserModel } from "../UserModel";
import { DomainModel } from "./DomainModel";

// instantiate a dynamoose schema
const LinkSchema = new dynamoose.Schema({
  /*id: {
    type: String,
    //rangeKey: true
    default: getUuid()
  },*/
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
    type: [ String, dynamoose.type.NULL ]
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
    type: [ DomainModel, dynamoose.type.NULL ]
  },
  password: {
    type: [ String, dynamoose.type.NULL ]
  },
  expireIn: {
    type: [ Date, dynamoose.type.NULL ]
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

// create a model from schema and export it
export const LinkModel = dynamoose.model("links", LinkSchema);
