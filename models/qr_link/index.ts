import dynamoose from "../../libs/gateways/dynamodb/dynamoose";
import schema from "./schemas/link";

import { AnyItem } from "dynamoose/dist/Item";
import { QueryResponse } from "dynamoose/dist/ItemRetriever";
import { TCountByUser, TFetchByUser } from "../commons/types";
import { decodePageKey, encodePageKey } from "../commons/helpers";

interface IQrLinkModel extends AnyItem {
  // Add the model's custom method prototypes here
  countByUser: TCountByUser;
  fetchByUser: TFetchByUser;
}

export const QrLink = dynamoose.model<IQrLinkModel>("links", schema);

QrLink.methods.set("countByUser", async function (userId: string, preGenerated?: boolean) {
  const query = QrLink.query({ userId });

  if (preGenerated !== undefined) query.where('preGenerated').eq(preGenerated);

  return await query.count().exec();
});

QrLink.methods.set("fetchByUser", async function (userId: string, limit: number, pageKey: string | null) {
  const query = QrLink.query({ userId }).limit(limit);

  if (pageKey) query.startAt(decodePageKey(pageKey));

  const { count: total } = await QrLink.query({ userId }).count().exec();
  const items = await query.exec();

  return { items, total, nextPageKey: encodePageKey(items.lastKey) };
});

export default QrLink;