import dynamoose from "../../libs/gateways/dynamodb/dynamoose";
import schema from "./schemas/qr_data";

import { AnyItem } from "dynamoose/dist/Item";
import { QueryResponse } from "dynamoose/dist/ItemRetriever";
import { TFetchByUser } from "../commons/types";
import { decodePageKey, encodePageKey } from "../commons/helpers";

interface IQrDataModel extends AnyItem {
  // Add the model's custom method prototypes here
  fetchByUser: TFetchByUser;
}

export const QrData = dynamoose.model<IQrDataModel>("qr_data", schema);

QrData.methods.set("fetchByUser", async function (userId: string, limit: number, pageKey: string | null) {
  const query = QrData.query({ userId }).limit(limit);

  if (pageKey) query.startAt(decodePageKey(pageKey));

  const { count: total } = await QrData.query({ userId }).count().exec();
  const items = await query.exec();

  return { items, total, nextPageKey: encodePageKey(items.lastKey) };
});

export default QrData;