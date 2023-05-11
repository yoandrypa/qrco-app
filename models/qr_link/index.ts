import dynamoose from "../../libs/gateways/dynamodb/dynamoose";
import schema from "./link";
import { ModelType, ObjectType } from "dynamoose/dist/General";
import { Item } from "dynamoose/dist/Item";

interface ICountByUserResponseType {
  count: number;
}

interface ILinkModel extends Item {
  countByUser: (userId: string, preGenerated?: boolean) => Promise<ICountByUserResponseType>;
  fetchByUser: (userId: string, limit?: number, pageKey?: string) => Promise<any>;
}

export const Link: ModelType<ILinkModel> = dynamoose.model<ILinkModel>("links", schema);

Link.methods.set("countByUser", async function (userId: string, preGenerated?: boolean) {
  const query = Link.query({ userId });

  if (preGenerated !== undefined) query.where('preGenerated').eq(preGenerated);

  return await query.count().exec();
});

Link.methods.set("fetchByUser", async function (userId: string, limit: number = 10, pageKey?: string) {
  const query = Link.query({ userId }).limit(limit);

  if (pageKey) {
    const key: ObjectType = JSON.parse(Buffer.from(pageKey, 'base64').toString('utf8'));
    query.startAt(key);
  }

  const { count } = await Link.query({ userId }).count().exec();
  const response = await query.exec();

  return {
    items: response,
    nextPageKey: Buffer.from(JSON.stringify(pageKey), 'utf8').toString('base64'),
    count,
  };
});

export default Link;