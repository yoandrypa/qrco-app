import dynamoose from "../../libs/dynamoose";
import { QrOptionsModel } from "./QrOptionsModel";
import { LinkModel } from "../link";
import { UserModel } from "../UserModel";

const QrDataSchema = new dynamoose.Schema({
  /*id: {
    hashKey: true,
    type: String
  },*/
  qrName: { type: String, required: true },
  qrType: { type: String, required: true },
  secret: String,
  isDynamic: { type: Boolean, default: false },
  shortLinkId: { type: [LinkModel, Object] },
  userId: { type: UserModel, hashKey: true },
  qrOptionsId: {
    type: QrOptionsModel
  },
  createdAt: {
    type: Date,
    rangeKey: true
  }
}, {
  "timestamps": {
    createdAt: undefined,
    updatedAt: "updatedAt"
  },
  saveUnknown: true
});

// create a model from schema and export it
export const QrDataModel = dynamoose.model("qr_data", QrDataSchema);
