import Schema from '../../commons/schema';

import QrOptionsModel from "../../qr_options";
import QrLinkModel from "../../qr_link";
import UserModel from "../../user";

const schema = new Schema({
  qrName: { type: String, required: true },
  qrType: { type: String, required: true },
  secret: String,
  secretOps: String,
  isDynamic: { type: Boolean, default: false },
  shortLinkId: { type: QrLinkModel },
  userId: { type: UserModel, hashKey: true },
  qrOptionsId: { type: QrOptionsModel },
  createdAt: {
    type: Date,
    rangeKey: true
  }
}, {
  timestamps: {
    createdAt: undefined,
    updatedAt: "updatedAt"
  },
  saveUnknown: true
});

export default schema;
