import dynamoose from "../../libs/gateways/dynamodb/dynamoose";
import schema from "./schemas/qr_options";

import { AnyItem } from "dynamoose/dist/Item";

interface IQrOptionsModel extends AnyItem {
  // Add the model's custom method prototypes here
}

export const QrOptions = dynamoose.model<IQrOptionsModel>("qr_options", schema);

export default QrOptions;